const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const { register, login } = require("./controllers/controllers");

dotenv.config({ path: "./.env" });

app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let pubClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

// Create 4 rooms
const room1 = io.of("/room1");
const room2 = io.of("/room2");
const room3 = io.of("/room3");
const room4 = io.of("/room4");

io.on("connection", (socket) => {
  console.log("User connected to the default namespace", socket.id);

  socket.on("arm", (armMsg) => {
    io.emit("arm", armMsg);
  });

  socket.on("sequence", (sequenceMsg) => {
    pubClient.set(`sequence`, JSON.stringify(sequenceMsg), (err, reply) => {
      if (err) {
        console.log(err);
      }
    });

    io.emit("sequence", sequenceMsg);
  });

  socket.on("switch", (switchMsg) => {
    io.emit("switch", switchMsg);
  });

  socket.on("rewind", () => {
    io.emit("rewind");
  });

  socket.on("clearAll", (clearAllMsg) => {
    io.emit("clearAll", clearAllMsg);
  });

  socket.on("BPM", (BPMmessage) => {
    io.emit("BPM", BPMmessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from the default namespace", socket.id);
  });
});

const roomEventListeners = (socket, roomName) => {
  console.log(`User Connected to ${roomName}`, socket.id);

  socket.on("arm", (armMsg) => {
    io.of(roomName).emit("arm", armMsg);
  });

  socket.on("sequence", (sequenceMsg) => {
    pubClient.set(
      `sequence:${roomName}`,
      JSON.stringify(sequenceMsg),
      (err, reply) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  socket.on("switch", (switchMsg) => {
    io.of(roomName).emit("switch", switchMsg);
  });

  socket.on("rewind", () => {
    io.of(roomName).emit("rewind");
  });

  socket.on("clearAll", (clearAllMsg) => {
    io.of(roomName).emit("clearAll", clearAllMsg);
  });

  socket.on("BPM", (BPMmessage) => {
    io.of(roomName).emit("BPM", BPMmessage);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected from ${roomName}`, socket.id);
  });
};

for (let room of [io, room1, room2, room3, room4]) {
  room.on("connection", (socket) => {
    roomEventListeners(socket, room.name);
  });
}

app.post("/login", login);
app.post("/register", register);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
