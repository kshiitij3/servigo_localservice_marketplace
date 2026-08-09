import { body, param, validationResult } from "express-validator";

export const createWorkRequestValidation = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category"),

  body("customCategory")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Custom category cannot exceed 100 characters"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must contain longitude and latitude"),

  body("location.coordinates.0")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("location.coordinates.1")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("budget.min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum budget must be greater than or equal to 0")
    .custom((value, { req }) => {
      if (
        req.body.budget &&
        req.body.budget.max !== undefined &&
        Number(value) > Number(req.body.budget.max)
      ) {
        throw new Error(
          "Minimum budget cannot exceed maximum budget"
        );
      }

      return true;
    }),

  body("budget.max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum budget must be greater than or equal to 0")
    .custom((value, { req }) => {
      if (
        req.body.budget &&
        req.body.budget.min !== undefined &&
        Number(value) < Number(req.body.budget.min)
      ) {
        throw new Error(
          "Maximum budget cannot be less than minimum budget"
        );
      }

      return true;
    }),

  body("preferredDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid preferred date")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error(
          "Preferred date cannot be in the past"
        );
      }

      return true;
    }),

  body("preferredTimeSlot.start")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),

  body("preferredTimeSlot.end")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format")
    .custom((value, { req }) => {
      if (
        req.body.preferredTimeSlot &&
        req.body.preferredTimeSlot.start &&
        value <= req.body.preferredTimeSlot.start
      ) {
        throw new Error(
          "End time must be after start time"
        );
      }

      return true;
    }),

  body("visibilityRadius")
    .optional()
    .isFloat({ min: 5, max: 50 })
    .withMessage(
      "Visibility radius must be between 5 and 50 km"
    ),

  body("isUrgent")
    .optional()
    .isBoolean()
    .withMessage("isUrgent must be true or false"),

  body("media")
    .optional()
    .isArray()
    .withMessage("Media must be an array"),

  body("media.*.url")
    .optional()
    .isURL()
    .withMessage("Invalid media URL"),

  body("media.*.publicId")
    .optional()
    .notEmpty()
    .withMessage("publicId is required"),

  body("media.*.mediaType")
    .optional()
    .isIn(["image", "video"])
    .withMessage("Media type must be image or video"),
];

export const updateWorkRequestValidation = [

  param("id")
    .isMongoId()
    .withMessage("Invalid work request id"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category"),

  body("customCategory")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Custom category cannot exceed 100 characters"),

  body("isUrgent")
    .optional()
    .isBoolean()
    .withMessage("isUrgent must be true or false"),

  body("visibilityRadius")
    .optional()
    .isFloat({ min: 5, max: 50 })
    .withMessage(
      "Visibility radius must be between 5 and 50 km"
    ),
];

export const workRequestIdValidation = [

  param("id")
    .isMongoId()
    .withMessage("Invalid work request id"),
];

export const validate = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};