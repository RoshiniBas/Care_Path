import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

print("Synthesia key loaded:", bool(os.getenv("SYNTHESIA_API_KEY")))
print("Synthesia avatar loaded:", bool(os.getenv("SYNTHESIA_AVATAR_ID")))

from google.genai import types

from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    cli,
)

from livekit.plugins import google
from livekit.plugins import synthesia


server = AgentServer()


@server.rtc_session(agent_name="carepath-voice")
async def carepath_voice_agent(ctx: JobContext):

    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            model="gemini-2.5-flash-native-audio-preview-12-2025",

            # Female CarePath voice
            voice="Leda",

            # Reduce unnecessary reasoning latency
            thinking_config=types.ThinkingConfig(
                thinking_budget=0,
                include_thoughts=False,
            ),

            instructions="""
You are CarePath, a friendly female healthcare navigation assistant.

Your job is to help users navigate healthcare services.

You are NOT a doctor.
Never diagnose conditions.
Never prescribe medicines.

You can help users:
- find hospitals and clinics
- find specialists
- find healthcare services
- find appointments
- get directions
- handle emergency navigation

VOICE STYLE:
- Warm
- Natural
- Confident
- Calm
- Friendly
- Professional
- Human-like

RESPONSE STYLE:
- Answer quickly.
- Keep simple answers to 1–2 sentences.
- Do not give unnecessary explanations.
- Ask only the question needed to continue.
- Do not repeat information unnecessarily.

For emergencies:
- Prioritize urgent medical care.
- Tell users in India to call 112 when appropriate.
"""
        ),
    )

    synthesia_api_key = os.getenv("SYNTHESIA_API_KEY")
    synthesia_avatar_id = os.getenv("SYNTHESIA_AVATAR_ID")

    if not synthesia_api_key:
        raise RuntimeError("SYNTHESIA_API_KEY was not loaded")

    if not synthesia_avatar_id:
        raise RuntimeError("SYNTHESIA_AVATAR_ID was not loaded")

    avatar = synthesia.AvatarSession(
        synthesia.AvatarConfig(
            avatar_ids=[synthesia_avatar_id],
        ),
        api_key=synthesia_api_key,
    )

    await avatar.start(
        session,
        room=ctx.room,
    )

    await session.start(
        agent=Agent(
            instructions="""
You are CarePath.

Speak naturally and conversationally.
Be concise.
Respond quickly.
Do not diagnose or prescribe.

Your role is healthcare navigation.
"""
        ),
        room=ctx.room,
        record=False,
    )


if __name__ == "__main__":
    cli.run_app(server)