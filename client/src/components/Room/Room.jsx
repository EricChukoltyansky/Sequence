import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Room = () => {
  const { roomId } = useParams();

  const socket = io.connect(
    `${
      process.env.NODE_ENV === "production"
        ? "https://sequencer-api.onrender.com"
        : "http://localhost:3001"
    }/${roomId}`
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
      socket.connect();
    } else {
      socket.connect();
    }
  });
};

export default Room;
