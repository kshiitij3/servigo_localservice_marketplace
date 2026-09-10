import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  updateProfessionalAvailability,
  updateProfessionalLocationController,
} from "../controllers/professional.controller.js";
import {
  updateAvailabilityValidation,
  updateProfessionalLocationValidation,
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

router.patch(
  "/location",
  protect,
  authorize("professional"),
  updateProfessionalLocationValidation,
  validate,
  updateProfessionalLocationController
);

export default router;
