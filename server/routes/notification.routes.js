import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  getMine,
  getUnread,
  markRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

/* All notification routes require a valid JWT */
router.use(protect);

/* GET /api/v1/notifications?page=1&limit=20 */
router.get("/", getMine);

/* GET /api/v1/notifications/unread-count  – for the navbar badge */
router.get("/unread-count", getUnread);

/*
 * PATCH /api/v1/notifications/read-all
 * Must be declared BEFORE /:id/read so Express doesn't
 * interpret "read-all" as a dynamic :id segment.
 */
router.patch("/read-all", markAllRead);

/* PATCH /api/v1/notifications/:id/read */
router.patch("/:id/read", markRead);

export default router;
