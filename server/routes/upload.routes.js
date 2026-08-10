import express from "express";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadMedia,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/media",
  protect,
  upload.single("file"),
  uploadMedia
);

export default router;
