// client/src/components/Room/Room.jsx — Connects to a room namespace and renders Sequencer
import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import PlayerProvider from "../context/PlayerProviderHowler";
import Sequencer from "../Sequencer/Sequencer";
import Loader from "../Loader/Loader";
import Rotate from "../Rotate/Rotate";
import styled from "styled-components";
import { theme } from "../../theme";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://sequencer-api.onrender.com"
    : "http://localhost:3001";

const BackButton = styled.button`
  position: fixed;
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  z-index: ${theme.zIndex.sticky + 10};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.text.primary};
    border-color: ${theme.colors.borderLight};
  }
`;

const RoomBadge = styled.span`
  position: fixed;
  top: ${theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${theme.zIndex.sticky + 10};
  padding: ${theme.spacing.xs} ${theme.spacing.lg};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export default function Room({ orientation }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  // Create a socket connection to this room's namespace.
  // useMemo ensures we only create it once per roomId.
  const socket = useMemo(() => {
    const s = io(`${API_BASE}/${roomId}`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    s.on("connect_error", (err) => console.log("Connection Error", err));
    s.on("disconnect", (reason) => {
      console.log("Disconnected", reason);
      if (reason === "io server disconnect") s.connect();
    });

    return s;
  }, [roomId]);

  // Listen for user count
  useEffect(() => {
    const handleUsers = (data) => setUserCount(data.count);
    socket.on("room:users", handleUsers);
    return () => socket.off("room:users", handleUsers);
  }, [socket]);

  // Clean up socket on unmount / room change
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const roomLabel = roomId.replace("room", "Room ");

  return (
    <PlayerProvider>
      {({
        players,
        loadInstrument,
        isLoading,
        initializeAudio,
        isAudioReady,
        getSoundSettings,
        updateSoundSettings,
        playSound,
        getEffects,
        updateEffects,
      }) => {
        if (!players || isLoading) return <Loader />;
        if (orientation === "portrait-primary") return <Rotate />;

        return (
          <>
            <BackButton onClick={() => { socket.disconnect(); navigate("/"); }}>
              ← Rooms
            </BackButton>
            <RoomBadge>
              {roomLabel} · {userCount} {userCount === 1 ? "user" : "users"}
            </RoomBadge>
            <Sequencer
              players={players}
              socket={socket}
              loadInstrument={loadInstrument}
              initializeAudio={initializeAudio}
              isAudioReady={isAudioReady}
              getSoundSettings={getSoundSettings}
              updateSoundSettings={updateSoundSettings}
              playSound={playSound}
              getEffects={getEffects}
              updateEffects={updateEffects}
            />
          </>
        );
      }}
    </PlayerProvider>
  );
}
