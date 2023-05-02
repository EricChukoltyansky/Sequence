const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"});

app.use(cors());
app.use(express);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Create 4 rooms
const room1 = io.of("/room1");
const room2 = io.of("/room2");
const room3 = io.of("/room3");
const room4 = io.of("/room4");

// Create 4 redis clients

const roomEventListeners = (socket, roomName) => {
  console.log(`User Connected to ${roomName}`, socket.id);

  socket.on("arm", (armMsg) => {
    io.to(roomName).emit("arm", armMsg);
  });

  socket.on("sequence", (sequenceMsg) => {
    redisClient.set(`sequence:${roomName}`, JSON.stringify(sequenceMsg), (err, reply) => {
      if (err) {
        console.log(err);
      }
    });
  });

  socket.on("switch", (switchMsm) => {
    io.to(roomName).emit("switch", switchMsm);
  });

  socket.on("rewind", () => {
    io.to(roomName).emit("rewind");
  });

  socket.on("clearAll", (clearAllMsg) => {
    io.to(roomName).emit("clearAll", clearAllMsg);
  });

  socket.on("BPM", (BPMmessage) => {
    io.to(roomName).emit("BPM", BPMmessage);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected from ${roomName}`, socket.id);
  });
}

room1.on("connection", (socket) => {
  roomEventListeners(socket, "room1");
});

room2.on("connection", (socket) => {
  roomEventListeners(socket, "room2");
});

room3.on("connection", (socket) => {
  roomEventListeners(socket, "room3");
});

room4.on("connection", (socket) => {
  roomEventListeners(socket, "room4");
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

  



