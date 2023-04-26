const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");


app.use(cors());
app.use(express);

const server = http.createServer(app);






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

  socket.on("sequence", (sequenceMsg) => {
    console.log(JSON.stringify(sequenceMsg));

    io.emit("sequence", sequenceMsg);

    redisClient.publish("sequence", JSON.stringify(sequenceMsg));

    redisClient.get("sequence", (err, reply) => {
      console.log(reply);
    }
    );


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
