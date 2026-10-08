import { useEffect, useState } from "react";

import {
  SessionProvider,
  useSession,
  useTracks,
  VideoTrack,
  RoomAudioRenderer,
} from "@livekit/components-react";

import {TokenSource, Track } from "livekit-client";

import "@livekit/components-styles";

const TOKEN_SERVER_ID = "aiavatar-y4749g";

function AvatarView() {
  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  return (
    <div className="carepath-avatar">
      {cameraTracks.length > 0 ? (
        cameraTracks.map((track) => (
          <VideoTrack
            key={track.publication.trackSid}
            trackRef={track}
          />
        ))
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

  useEffect(() => {
  if (!autoStart || started) return;

  const startAutomatically = async () => {
  console.log("🤖 Auto-starting CarePath voice...");

  try {
    await session.start();

    console.log("✅ LiveKit auto-start successful!");

    setStarted(true);
  } catch (error) {
    console.error("❌ LiveKit auto-start failed:", error);
  }
};

  startAutomatically();
}, [autoStart, session, started]);

  const startConversation = async () => {
  console.log("🎤 Starting CarePath voice session...");

  try {
    await session.start();

    console.log("✅ LiveKit session started!");

    setStarted(true);
  } catch (error) {
    console.error("❌ LiveKit connection failed:", error);
  }
};

  const stopConversation = async () => {
    await session.end();
    setStarted(false);
  };


  return (
    <div className="carepath-voice-container">

      <AvatarView />

      <div className="voice-status">
        {started
          ? "CarePath is listening..."
          : "Ready to talk"}
      </div>

      {!started ? (
        <button
          className="start-voice-button"
          onClick={startConversation}
        >
          🎤 Start conversation
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
  const tokenSource =
    TokenSource.developmentTokenServer(
      TOKEN_SERVER_ID
    );

  const [roomName] = useState(
    () => `carepath-${crypto.randomUUID()}`
  );

  console.log("🏠 CarePath room:", roomName);

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