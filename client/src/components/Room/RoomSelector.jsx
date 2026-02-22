// client/src/components/Room/RoomSelector.jsx — Compact room switcher for NavBar
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://sequencer-api.onrender.com"
    : "http://localhost:3001";

// ── Styled Components ──────────────────────────────────────
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CurrentRoom = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.glass.background};
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  &:hover {
    border-color: ${theme.colors.borderLight};
    background: rgba(255, 255, 255, 0.08);
  }
`;

const RoomLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.xs};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.text.secondary};
`;

const RoomName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const UsersBadge = styled.span`
  font-size: 10px;
  color: ${theme.colors.text.muted};
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active ? theme.colors.transport.play : theme.colors.text.disabled};
  box-shadow: ${(p) =>
    p.$active ? `0 0 6px ${theme.colors.transport.play}` : "none"};
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + ${theme.spacing.sm});
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  background: ${theme.colors.secondary};
  border: 1px solid ${theme.colors.glass.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  z-index: ${theme.zIndex.popover};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);

  /* Animate open */
  animation: dropUp 0.2s ease-out;
  @keyframes dropUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const ACCENTS = [
  theme.colors.tracks.piano.primary,
  theme.colors.tracks.bass.primary,
  theme.colors.tracks.drums.primary,
  "#a855f7",
];

const RoomOption = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${(p) =>
    p.$selected ? theme.colors.text.primary : theme.colors.text.secondary};
  background: ${(p) =>
    p.$selected ? "rgba(255,255,255,0.08)" : "transparent"};
  border: 1px solid
    ${(p) => (p.$selected ? p.$accent + "66" : "transparent")};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: ${theme.colors.text.primary};
  }
`;

const OptionInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: ${theme.colors.text.muted};
`;

// ── Component ──────────────────────────────────────────────
export default function RoomSelector({ currentRoom, onRoomChange, userCount }) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const ref = useRef();

  // Close on click outside
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Fetch room info when dropdown opens
  useEffect(() => {
    if (!open) return;
    const fetchRooms = () =>
      fetch(`${API_BASE}/api/rooms`)
        .then((r) => r.json())
        .then(setRooms)
        .catch(console.error);
    fetchRooms();
    const timer = setInterval(fetchRooms, 3000);
    return () => clearInterval(timer);
  }, [open]);

  const displayName = currentRoom.replace("room", "Room ");

  return (
    <Wrapper ref={ref}>
      {open && (
        <Dropdown>
          {rooms.map((room, i) => (
            <RoomOption
              key={room.id}
              $selected={room.id === currentRoom}
              $accent={ACCENTS[i % ACCENTS.length]}
              onClick={() => {
                onRoomChange(room.id);
                setOpen(false);
              }}
            >
              {room.name}
              <OptionInfo>
                <Dot $active={room.users > 0} />
                {room.users}
                {room.playing ? " ▶" : ""}
              </OptionInfo>
            </RoomOption>
          ))}
        </Dropdown>
      )}
      <CurrentRoom onClick={() => setOpen((v) => !v)}>
        <RoomLabel>Room</RoomLabel>
        <RoomName>{displayName}</RoomName>
        <UsersBadge>
          <Dot $active={userCount > 0} />
          {userCount} {userCount === 1 ? "user" : "users"}
        </UsersBadge>
      </CurrentRoom>
    </Wrapper>
  );
}
