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

export const updateProfessionalLocationValidation = [
  body("location")
    .exists()
    .withMessage("Location data is required")
    .isObject()
    .withMessage("Location must be an object"),
  body("location.type")
    .optional()
    .equals("Point")
    .withMessage("Location type must be Point"),
  body("location.coordinates")
    .exists()
    .withMessage("Location coordinates are required")
    .isArray({ min: 2, max: 2 })
    .withMessage("Location coordinates must contain longitude and latitude"),
  body("location.coordinates.0")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),
  body("location.coordinates.1")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),
  body("location.address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),
  body("location.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),
  body("location.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),
  body("location.pincode")
    .optional()
    .isString()
    .withMessage("Pincode must be a string"),
];
