import { useState, useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import PlayerProvider from "./components/context/PlayerProviderHowler";
import Sequencer from "./components/Sequencer/Sequencer";
import Loader from "./components/Loader/Loader";
import Rotate from "./components/Rotate/Rotate";
import "./App.css";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://sequencer-api.onrender.com"
    : "http://localhost:3001";

function App() {
  const [orientation, setOrientation] = useState(
    window.screen.orientation.type
  );
  const [currentRoom, setCurrentRoom] = useState("room1");
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const handleOrientationChange = () =>
      setOrientation(window.screen.orientation.type);
    window.addEventListener("orientationchange", handleOrientationChange);
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  // Create socket scoped to the current room namespace
  const socket = useMemo(() => {
    const s = io(`${API_BASE}/${currentRoom}`, {
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
  }, [currentRoom]);

  // Track user count from server
  useEffect(() => {
    const handleUsers = (data) => setUserCount(data.count);
    socket.on("room:users", handleUsers);
    return () => socket.off("room:users", handleUsers);
  }, [socket]);

  // Disconnect old socket when room changes
  useEffect(() => {
    return () => socket.disconnect();
  }, [socket]);

  const handleRoomChange = useCallback(
    (newRoom) => {
      if (newRoom !== currentRoom) {
        socket.disconnect();
        setCurrentRoom(newRoom);
      }
    },
    [currentRoom, socket]
  );

  return (
    <div className="App">
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
          if (!players || isLoading) {
            return <Loader />;
          }
          return orientation === "portrait-primary" ? (
            <Rotate />
          ) : (
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
              currentRoom={currentRoom}
              onRoomChange={handleRoomChange}
              userCount={userCount}
            />
          );
        }}
      </PlayerProvider>
    </div>
  );
}

export default App;
