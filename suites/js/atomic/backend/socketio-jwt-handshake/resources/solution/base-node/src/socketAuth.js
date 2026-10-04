import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "node:http";

const SECRET = process.env.JWT_SECRET || "socket-secret";

export function attachSocketAuth(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      socket.user = jwt.verify(token, SECRET);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });
  return io;
}

export function createAuthedServer() {
  const httpServer = http.createServer();
  const io = attachSocketAuth(new Server(httpServer));
  io.on("connection", (socket) => {
    socket.emit("ready", { sub: socket.user.sub });
  });
  return { httpServer, io, sign: (payload) => jwt.sign(payload, SECRET) };
}
