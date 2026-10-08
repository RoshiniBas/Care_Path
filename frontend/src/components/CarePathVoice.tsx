import { useEffect, useState } from "react";

import {
  SessionProvider,
  useSession,
  useTracks,
  VideoTrack,
  RoomAudioRenderer,
} from "@livekit/components-react";

import { TokenSource, Track } from "livekit-client";

import "@livekit/components-styles";

const TOKEN_SERVER_ID = "aiavatar-y4749g";

function AvatarView() {
  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  return (
    <div className="carepath-avatar">
      {cameraTracks.length > 0 ? (
        cameraTracks.map((track) => {
          if (!track.publication) return null;

          return (
            <VideoTrack
              key={track.publication.trackSid}
              trackRef={track as any}
            />
          );
        })
      ) : (
        <div className="avatar-placeholder">
          <div className="avatar-circle">C</div>
          <p>CarePath AI</p>
          <span>Waiting for avatar...</span>
        </div>
      )}
    </div>
  );
}

function VoiceSession({
  session,
  autoStart,
}: {
  session: any;
  autoStart: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!autoStart || started || starting) return;

    const startAutomatically = async () => {
      try {
        setStarting(true);

        console.log("🤖 Auto-starting CarePath voice...");

        await session.start();

        console.log("✅ LiveKit session started!");

        setStarted(true);
      } catch (error) {
        console.error("❌ LiveKit auto-start failed:", error);
      } finally {
        setStarting(false);
      }
    };

    startAutomatically();
  }, [autoStart, started, starting, session]);

  const startConversation = async () => {
    if (starting || started) return;

    console.log("🎤 Starting CarePath voice session...");

    try {
      setStarting(true);

      console.log("⏳ Calling session.start()...");

      await session.start();

      console.log("✅ LiveKit session started!");

      setStarted(true);
    } catch (error) {
      console.error("❌ LiveKit connection failed:", error);

      if (error instanceof Error) {
        console.error("❌ Error message:", error.message);
        console.error("❌ Error stack:", error.stack);

        alert(`CarePath voice failed:\n\n${error.message}`);
      } else {
        alert(`CarePath voice failed:\n\n${String(error)}`);
      }
    } finally {
      setStarting(false);
    }
  };

  const stopConversation = async () => {
    try {
      await session.end();
    } catch (error) {
      console.error("❌ Error ending session:", error);
    }

    setStarted(false);
  };

  return (
    <div className="carepath-voice-container">
      <AvatarView />

      <div className="voice-status">
        {starting
          ? "Connecting to CarePath..."
          : started
          ? "CarePath is listening..."
          : "Ready to talk"}
      </div>

      {!started ? (
        <button
          className="start-voice-button"
          onClick={startConversation}
          disabled={starting}
        >
          {starting ? "Connecting..." : "🎤 Start conversation"}
        </button>
      ) : (
        <button
          className="stop-voice-button"
          onClick={stopConversation}
        >
          End conversation
        </button>
      )}
    </div>
  );
}

export default function CarePathVoice({
  autoStart = false,
}: {
  autoStart?: boolean;
}) {
  const [roomName] = useState(
    () => `carepath-${crypto.randomUUID()}`
  );

  const tokenSource = TokenSource.developmentTokenServer(
    TOKEN_SERVER_ID
  );

  const session = useSession(tokenSource, {
    roomName,
    agentName: "carepath-voice",
  });

  return (
    <SessionProvider session={session}>
      <VoiceSession
        session={session}
        autoStart={autoStart}
      />

      <RoomAudioRenderer />
    </SessionProvider>
  );
}