import { body, param } from "express-validator";



export const createPaymentOrderValidation = [
  body("booking")
    .notEmpty()
    .withMessage("Booking is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),
];



export const verifyPaymentValidation = [
  body("booking")
    .notEmpty()
    .withMessage("Booking is required")
    .isMongoId()
    .withMessage("Invalid booking ID"),

  body("razorpayPaymentId")
    .notEmpty()
    .withMessage("Razorpay payment ID is required")
    .isString()
    .withMessage("Invalid Razorpay payment ID"),

  body("razorpaySignature")
    .notEmpty()
    .withMessage("Razorpay signature is required")
    .isString()
    .withMessage("Invalid Razorpay signature"),
];




export const paymentIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid payment ID"),
];


export const paymentOnboardingValidation = [
  body("legalBusinessName")
    .notEmpty()
    .withMessage("Legal business name is required")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage(
      "Legal business name must be between 2 and 200 characters"
    ),

  body("customerFacingBusinessName")
    .notEmpty()
    .withMessage(
      "Customer-facing business name is required"
    )
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(
      "Customer-facing business name must be between 1 and 255 characters"
    ),

  body("businessType")
    .notEmpty()
    .withMessage("Business type is required")
    .isString()
    .withMessage("Business type must be a string"),
];