import express from "express";

import {
  create,
  getMyChats,
  getById,
  getMessages,
  markAsRead,
} from "../controllers/chat.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", create);

router.get("/my", getMyChats);

router.get("/:id", getById);

router.get("/:id/messages", getMessages);

router.patch("/:id/read", markAsRead);

export default router;
