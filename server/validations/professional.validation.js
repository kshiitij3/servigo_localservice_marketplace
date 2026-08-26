import { body } from "express-validator";

export const updateAvailabilityValidation = [
  body("availabilityStatus")
    .notEmpty()
    .withMessage("Availability status is required")
    .isIn(["available", "busy", "unavailable"])
    .withMessage(
      "Availability status must be available, busy, or unavailable"
    ),
];
