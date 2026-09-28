const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const waiting = [];
const partners = new Map();
const reports = [];

function removeFromQueue(socketId) {
  const i = waiting.indexOf(socketId);
  if (i !== -1) waiting.splice(i, 1);
}

function disconnectPair(id, message) {
  const partnerId = partners.get(id);
  if (partnerId) {
    partners.delete(id);
    partners.delete(partnerId);
    io.to(partnerId).emit("partner-left", { message });
  }
}

function tryMatch() {
  while (waiting.length >= 2) {
    const a = waiting.shift();
    const b = waiting.shift();
    if (!io.sockets.sockets.has(a) || !io.sockets.sockets.has(b)) continue;

    partners.set(a, b);
    partners.set(b, a);

    io.to(a).emit("matched", { message: "You are connected to a new chat." });
    io.to(b).emit("matched", { message: "You are connected to a new chat." });
  }
}

io.on("connection", (socket) => {
  socket.on("find-chat", () => {
    disconnectPair(socket.id, "The other user started a new chat.");
    removeFromQueue(socket.id);
    waiting.push(socket.id);
    socket.emit("waiting");
    tryMatch();
  });

  socket.on("message", (text) => {
    if (typeof text !== "string") return;
    text = text.trim().slice(0, 300);
    if (!text) return;

    const partnerId = partners.get(socket.id);
    if (!partnerId) return;

    io.to(partnerId).emit("message", text);
  });

  socket.on("next", () => {
    disconnectPair(socket.id, "The other user moved to a new chat.");
    removeFromQueue(socket.id);
    waiting.push(socket.id);
    socket.emit("waiting");
    tryMatch();
  });

  socket.on("report", (reason) => {
    const partnerId = partners.get(socket.id);
    if (!partnerId) return;

    reports.push({
      reporter: socket.id,
      reported: partnerId,
      reason: String(reason || "No reason").slice(0, 500),
      at: new Date().toISOString()
    });

    io.to(socket.id).emit("report-sent");
    disconnectPair(socket.id, "Chat ended.");
  });

  socket.on("disconnect", () => {
    removeFromQueue(socket.id);
    disconnectPair(socket.id, "The other user disconnected.");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`RandomTalk server running on http://localhost:${PORT}`);
});
