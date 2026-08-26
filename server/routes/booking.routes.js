import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  create,
} from "../controllers/booking.controller.js";

import {
  createBookingValidation,
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

export default router;