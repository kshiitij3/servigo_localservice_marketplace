import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
