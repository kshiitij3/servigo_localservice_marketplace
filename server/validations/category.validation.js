import { param, validationResult } from "express-validator";


export const getCategoryByIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category id"),
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