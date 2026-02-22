// client/src/components/Room/RoomPicker.jsx — Room selection screen
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { theme } from "../../theme";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://sequencer-api.onrender.com"
    : "http://localhost:3001";

// ── Animations ─────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.08); }
  50%      { box-shadow: 0 0 40px rgba(255,215,0,0.18); }
`;

// ── Styled Components ──────────────────────────────────────
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing["3xl"]};
  background-image: radial-gradient(
    circle at 25px 25px,
    rgba(255, 255, 255, 0.02) 2%,
    transparent 0%
  );
  background-size: 50px 50px;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize["4xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(
    135deg,
    ${theme.colors.tracks.piano.primary} 0%,
    ${theme.colors.tracks.bass.primary} 50%,
    ${theme.colors.tracks.drums.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  animation: ${fadeUp} 0.6s ease-out;
`;

const Subtitle = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin-top: -${theme.spacing["2xl"]};
  animation: ${fadeUp} 0.6s ease-out 0.1s both;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.xl};
  animation: ${fadeUp} 0.6s ease-out 0.2s both;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.button`
  position: relative;
  width: 260px;
  padding: ${theme.spacing["2xl"]} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius["2xl"]};
  border: 1px solid ${theme.colors.glass.border};
  background: ${theme.colors.glass.background};
  backdrop-filter: blur(16px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  transition: all ${theme.transitions.normal};
  animation: ${pulseGlow} 4s ease-in-out infinite;

  &:hover {
    transform: translateY(-4px);
    border-color: ${(p) => p.$accentColor};
    box-shadow: 0 8px 32px ${(p) => p.$accentColor}33;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const RoomName = styled.span`
  font-family: ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const UserCount = styled.span`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active ? theme.colors.transport.play : theme.colors.text.disabled};
  box-shadow: ${(p) =>
    p.$active ? `0 0 8px ${theme.colors.transport.play}` : "none"};
`;

const Badge = styled.span`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${(p) => p.$color || theme.colors.text.muted};
  padding: 2px 8px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${(p) => p.$color || theme.colors.border}44;
  background: ${(p) => p.$color || theme.colors.border}11;
`;

// ── Room accent colours ────────────────────────────────────
const ACCENTS = [
  theme.colors.tracks.piano.primary,
  theme.colors.tracks.bass.primary,
  theme.colors.tracks.drums.primary,
  "#a855f7", // purple for room 4
];

// ── Component ──────────────────────────────────────────────
export default function RoomPicker() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // Poll room info every 3 seconds
  useEffect(() => {
    const fetchRooms = () =>
      fetch(`${API_BASE}/api/rooms`)
        .then((r) => r.json())
        .then(setRooms)
        .catch(console.error);

    fetchRooms();
    const timer = setInterval(fetchRooms, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Wrapper>
      <Title>Sequencer</Title>
      <Subtitle>Choose a room to start jamming</Subtitle>
      <Grid>
        {rooms.map((room, i) => (
          <RoomCard
            key={room.id}
            $accentColor={ACCENTS[i % ACCENTS.length]}
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <RoomName>{room.name}</RoomName>
            <UserCount>
              <StatusDot $active={room.users > 0} />
              {room.users} {room.users === 1 ? "user" : "users"} online
            </UserCount>
            {room.playing && (
              <Badge $color={theme.colors.transport.play}>
                ▶ Playing · {room.bpm} BPM
              </Badge>
            )}
          </RoomCard>
        ))}
      </Grid>
    </Wrapper>
  );
}
