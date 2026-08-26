import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  create,
  updateStatus,
} from "../controllers/booking.controller.js";

import {
  createBookingValidation,
  updateBookingStatusValidation,
} from "../validations/booking.validation.js";

import { validate } from "../validations/workRequest.validation.js";

const router = express.Router();

// Create booking from accepted quote
router.post(
  "/",
  protect,
  authorize("customer"),
  createBookingValidation,
  validate,
  create
);

router.patch(
  "/:id/status",
  protect,
  authorize("professional"),
  updateBookingStatusValidation,
  validate,
  updateStatus
);

export default router;
