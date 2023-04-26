const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const redis = require("redis");

app.use(cors());
app.use(express);

const server = http.createServer(app);

let redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
redisClient.connect();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.log("Something went wrong " + err);
});

redisClient.on("message", (channel, message) => {
  console.log("Message: " + message + " on channel: " + channel + " is arrive!");
});

redisClient.subscribe("arm");
redisClient.subscribe("switch");
redisClient.subscribe("rewind");
redisClient.subscribe("clearAll");
redisClient.subscribe("BPM");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("arm", (armMsg) => {
    io.emit("arm", armMsg);
  });

  socket.on("switch", (switchMsm) => {
    io.emit("switch", switchMsm);
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
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});
