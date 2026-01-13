import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import PlayerProvider from "./components/context/PlayerProviderHowler";
import Sequencer from "./components/Sequencer/Sequencer";
import Loader from "./components/Loader/Loader";
import Rotate from "./components/Rotate/Rotate";
import "./App.css";

const socket = io.connect(
  process.env.NODE_ENV === "production"
    ? "https://sequencer-api.onrender.com"
    : "http://localhost:3001"
);

socket.on("connect_error", (error) => {
  console.log("Connection Error", error);
});

socket.on("connect_timeout", (timeout) => {
  console.log("Connection Timeout", timeout);
});

socket.on("error", (error) => {
  console.log("Error", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected", reason);
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
  // else the socket will automatically try to reconnect
});

function App() {
  const [orientation, setOrientation] = useState(
    window.screen.orientation.type
  );

  useEffect(() => {
    const handleOrientationChange = () =>
      setOrientation(window.screen.orientation.type);
    window.addEventListener("orientationchange", handleOrientationChange);
    return () =>
      window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PlayerProvider>
                {({
                  players,
                  loadInstrument,
                  isLoading,
                  initializeAudio,
                  isAudioReady,
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
                    />
                  );
                }}
              </PlayerProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
