import express from "express";

import {
  create,
  getMine,
  getById,
  updateStatus,
} from "../controllers/booking.controller.js";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  createBookingValidation,
  bookingIdValidation,
  updateBookingStatusValidation,
} from "../validations/booking.validation.js";

import { validate } from "../validations/workRequest.validation.js";

const router = express.Router();

router.use(protect);

// Create booking from accepted quote (customer only)
router.post(
  "/",
  authorize("customer"),
  createBookingValidation,
  validate,
  create
);

// Get current user's bookings (customer or professional)
router.get(
  "/my",
  getMine
);

// Get single booking by ID (accessible by assigned customer or professional)
router.get(
  "/:id",
  bookingIdValidation,
  validate,
  getById
);

// Update booking status milestone (assigned professional only)
router.patch(
  "/:id/status",
  authorize("professional"),
  updateBookingStatusValidation,
  validate,
  updateStatus
);

export default router;
