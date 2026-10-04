import { Server } from "socket.io";
import http from "node:http";

export function createChatServer() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId }) => {
      socket.join(String(roomId));
    });

    socket.on("send-message", ({ roomId, message }) => {
      io.to(String(roomId)).emit("message", { roomId, message, from: socket.id });
    });
  });

  return { httpServer, io };
}
