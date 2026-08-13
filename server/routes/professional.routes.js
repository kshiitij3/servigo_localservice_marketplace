import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  updateProfessionalAvailability,
} from "../controllers/professional.controller.js";
import {
  updateAvailabilityValidation,
} from "../validations/professional.validation.js";
import { validate } from "../validations/workRequest.validation.js";

const router = express.Router();

router.patch(
  "/availability",
  protect,
  authorize("professional"),
  updateAvailabilityValidation,
  validate,
  updateProfessionalAvailability
);

export default router;
