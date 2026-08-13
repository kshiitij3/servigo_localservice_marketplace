import dotenv from "dotenv";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/healthRoutes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import workRequestRoutes from "./routes/workRequest.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import quoteRoutes from "./routes/quote.route.js";
import professionalRoutes from "./routes/professional.routes.js";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();
// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/work-requests", workRequestRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/professionals", professionalRoutes);
app.use(errorMiddleware);

export default app;
