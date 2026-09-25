import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(
    new URL("./.env", import.meta.url)
  ),
});

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";

import { socketAuth } from "./socket/socket.auth.js";
import { registerChatSocket } from "./socket/chat.socket.js";
import { setIO } from "./socket/io.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  },
});

setIO(io);

const PORT = process.env.PORT || 5000;

/*
 * 1. Authenticate socket
 */
io.use(socketAuth);

/*
 * 2. Register socket features
 */
registerChatSocket(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `Server running on ${PORT}`
    );
  });
});