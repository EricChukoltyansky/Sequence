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

let pubClient;

if (process.env.REDIS_HOST) {
  pubClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log("Redis adapter connected");
    })
    .catch((err) => {
      console.error("Redis connection failed:", err.message);
      console.log("Continuing without Redis...");
      pubClient = null;
    });
} else {
  console.log("No REDIS_HOST set — running without Redis");
}

// Create 4 rooms
const room1 = io.of("/room1");
const room2 = io.of("/room2");
const room3 = io.of("/room3");
const room4 = io.of("/room4");

// ── Shared Transport Clock ────────────────────────────────────────
// Each namespace gets its own authoritative transport state so rooms
// are independent.  Clients never run their own freestanding timers;
// instead they compute their step position from the server's reference
// timestamp, keeping everyone sample-accurate.

const TOTAL_STEPS = 16;
const TOTAL_ROWS = 13;
const transports = new Map();
const sequences = new Map(); // In-memory sequence per namespace

function getTransport(name) {
  if (!transports.has(name)) {
    transports.set(name, {
      playing: false,
      bpm: 100,
      startTime: null, // server Date.now() when playback began
      startStep: 0,    // step index at startTime
    });
  }
  return transports.get(name);
}

function getSequence(name) {
  if (!sequences.has(name)) {
    // Build a fresh blank grid (13 rows × 16 cols)
    sequences.set(
      name,
      Array.from({ length: TOTAL_ROWS }, () =>
        Array.from({ length: TOTAL_STEPS }, () => ({ activated: false }))
      )
    );
  }
  return sequences.get(name);
}

function calculateCurrentStep(transport) {
  if (!transport.playing || !transport.startTime) return transport.startStep;
  const stepDurationMs = 60000 / transport.bpm / 4; // 16th-note
  const elapsed = Date.now() - transport.startTime;
  return (transport.startStep + Math.floor(elapsed / stepDurationMs)) % TOTAL_STEPS;
}

// ── REST endpoint: room info (user counts) ──
app.get("/api/rooms", (req, res) => {
  const roomNames = ["/room1", "/room2", "/room3", "/room4"];
  const rooms = roomNames.map((name) => {
    const nsp = io.of(name);
    const transport = getTransport(name);
    return {
      id: name.replace("/", ""),
      name: name.replace("/", "").replace("room", "Room "),
      users: nsp.sockets ? nsp.sockets.size : 0,
      playing: transport.playing,
      bpm: transport.bpm,
    };
  });
  res.json(rooms);
});

function setupNamespace(nsp) {
  const nsName = nsp.name || "/";

  nsp.on("connection", (socket) => {
    console.log(`User connected to ${nsName}`, socket.id);

    const transport = getTransport(nsName);
    const seq = getSequence(nsName);

    // Send current transport + sequence state so late-joiners sync immediately
    socket.emit("transport:state", { ...transport });
    socket.emit("sequence:state", seq);

    // Broadcast updated user count to everyone in this namespace
    const broadcastUserCount = () => {
      const count = nsp.sockets ? nsp.sockets.size : 0;
      nsp.emit("room:users", { count });
    };
    broadcastUserCount();

    // ── Time-sync handshake (NTP-lite) ──
    socket.on("time-sync", (data) => {
      socket.emit("time-sync", {
        clientTime: data.clientTime,
        serverTime: Date.now(),
      });
    });

    // ── Cell toggle ──
    socket.on("arm", (armMsg) => {
      // Update server-side sequence
      const { x, z } = armMsg;
      if (seq[x] && seq[x][z] !== undefined) {
        seq[x][z] = { ...seq[x][z], activated: !seq[x][z].activated };
      }
      socket.broadcast.emit("arm", armMsg);
    });

    // ── Full sequence (Redis persistence + in-memory) ──
    socket.on("sequence", (sequenceMsg) => {
      sequences.set(nsName, sequenceMsg);
      if (pubClient) {
        const key = nsName === "/" ? "sequence" : `sequence:${nsName}`;
        pubClient.set(key, JSON.stringify(sequenceMsg)).catch(console.error);
      }
      socket.broadcast.emit("sequence", sequenceMsg);
    });

    // ── Play / Pause ──
    socket.on("switch", (switchMsg) => {
      if (switchMsg.tog) {
        transport.playing = true;
        transport.startTime = Date.now();
        transport.startStep = 0;
      } else {
        // Pause – snapshot current position so we can resume later
        transport.startStep = calculateCurrentStep(transport);
        transport.playing = false;
        transport.startTime = null;
      }
      nsp.emit("transport:state", { ...transport });
    });

    // ── Rewind (stop + reset to step 0) ──
    socket.on("rewind", () => {
      transport.playing = false;
      transport.startStep = 0;
      transport.startTime = null;
      nsp.emit("transport:state", { ...transport });
    });

    // ── Clear All ──
    socket.on("clearAll", () => {
      transport.playing = false;
      transport.startTime = null;
      transport.startStep = 0;
      // Reset server-side sequence
      const blank = Array.from({ length: TOTAL_ROWS }, () =>
        Array.from({ length: TOTAL_STEPS }, () => ({ activated: false }))
      );
      sequences.set(nsName, blank);
      nsp.emit("clearAll");
      nsp.emit("transport:state", { ...transport });
    });

    // ── BPM change ──
    socket.on("BPM", (BPMmessage) => {
      // Checkpoint current position before changing tempo so the
      // playhead doesn't jump when the step duration changes.
      if (transport.playing) {
        transport.startStep = calculateCurrentStep(transport);
        transport.startTime = Date.now();
      }
      transport.bpm = Number(BPMmessage.value);
      nsp.emit("transport:state", { ...transport });
      // Also broadcast BPM for slider UI sync on other clients
      socket.broadcast.emit("BPM", BPMmessage);
    });

    // ── Instrument change ──
    socket.on("instrumentChange", (msg) => {
      socket.broadcast.emit("instrumentChange", msg);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from ${nsName}`, socket.id);
      // Update user count after disconnect
      setTimeout(broadcastUserCount, 100);
    });
  });
}

// Register all namespaces (default + rooms)
[io, room1, room2, room3, room4].forEach(setupNamespace);

app.post("/login", login);
app.post("/register", register);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
