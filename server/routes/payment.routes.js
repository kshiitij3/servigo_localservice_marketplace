import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  createOrder,
  verify,
} from "../controllers/payment.controller.js";

// NEW: Professional onboarding controller
import {
  onboardPayment,
} from "../controllers/professionalPayment.controller.js";

import {
  createPaymentOrderValidation,
  verifyPaymentValidation,
  paymentOnboardingValidation, // NEW
} from "../validations/payment.validation.js";

import { validate } from "../validations/workRequest.validation.js";

const router = express.Router();


// ==========================================
// CUSTOMER PAYMENT
// ==========================================

/*
Create Razorpay Order
Customer only
*/

router.post(
  "/create-order",
  protect,
  authorize("customer"),
  createPaymentOrderValidation,
  validate,
  createOrder
);


/*
Verify Razorpay Payment
Customer only
*/

router.post(
  "/verify",
  protect,
  authorize("customer"),
  verifyPaymentValidation,
  validate,
  verify
);


// ==========================================
// PROFESSIONAL PAYMENT ONBOARDING
// ==========================================

/*
Professional starts Razorpay onboarding
*/

router.post(
  "/professional/onboard",
  protect,
  authorize("professional"),
  paymentOnboardingValidation,
  validate,
  onboardPayment
);


export default router;