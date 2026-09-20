import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  create,
  getProfessional,
  getForBooking,
  update,
} from "../controllers/review.controller.js";

const router = express.Router();

// All review routes require authentication
router.use(protect);

// POST /api/v1/reviews
router.post("/", create);

// GET /api/v1/reviews/professional/:professionalId?page=&limit=
router.get("/professional/:professionalId", getProfessional);

// GET /api/v1/reviews/booking/:bookingId
router.get("/booking/:bookingId", getForBooking);

// PUT /api/v1/reviews/:id
router.put("/:id", update);

export default router;
