import { body } from "express-validator";

export const updateAvailabilityValidation = [
  body("availabilityStatus")
    .notEmpty()
    .withMessage("Availability status is required")
    .isIn(["available", "busy"])
    .withMessage(
      "Availability status must be available or busy"
    ),
];
