import { body, param } from "express-validator";

export const createQuoteValidation = [
  body("workRequest")
    .notEmpty()
    .withMessage("Work request is required")
    .isMongoId()
    .withMessage("Invalid work request ID"),

  body("initialAmount")
    .notEmpty()
    .withMessage("Initial quote amount is required")
    .isFloat({ min: 1 })
    .withMessage("Quote amount must be greater than 0"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Quote message cannot exceed 1000 characters"
    ),

  body("estimatedDuration.value")
    .optional()
    .isFloat({ min: 1 })
    .withMessage(
      "Estimated duration must be greater than 0"
    ),

  body("estimatedDuration.unit")
    .optional()
    .isIn(["minutes", "hours", "days"])
    .withMessage(
      "Duration unit must be minutes, hours, or days"
    ),

  body("availableDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid available date"),

  body("availableTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Available time must be in HH:mm format"),
];

export const updateQuoteValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid quote ID"),

  body("amount")
    .notEmpty()
    .withMessage("Quote amount is required")
    .isFloat({ min: 1 })
    .withMessage(
      "Quote amount must be greater than 0"
    ),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Quote message cannot exceed 1000 characters"
    ),

  body("estimatedDuration.value")
    .optional()
    .isFloat({ min: 1 })
    .withMessage(
      "Estimated duration must be greater than 0"
    ),

  body("estimatedDuration.unit")
    .optional()
    .isIn(["minutes", "hours", "days"])
    .withMessage(
      "Duration unit must be minutes, hours, or days"
    ),
];

export const quoteIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid quote ID"),
];