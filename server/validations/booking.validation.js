import { body, param } from "express-validator";

export const createBookingValidation = [
  body("quote")
    .notEmpty()
    .withMessage("Quote is required")
    .isMongoId()
    .withMessage("Invalid quote ID"),

  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Invalid scheduled date")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error(
          "Scheduled date cannot be in the past"
        );
      }

      return true;
    }),

  body("scheduledTime.start")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),

  body("scheduledTime.end")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format")
    .custom((value, { req }) => {
      const startTime = req.body.scheduledTime?.start;

      if (startTime && value <= startTime) {
        throw new Error(
          "End time must be after start time"
        );
      }

      return true;
    }),
];

export const bookingIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid booking ID"),
];