import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  create,
  update,
  getForWorkRequest,
  getMine,
  accept,
} from "../controllers/quote.controller.js";

import {
  createQuoteValidation,
  updateQuoteValidation,
  quoteIdValidation,
} from "../validations/quote.validation.js";

import { validate } from "../validations/workRequest.validation.js";

const router = express.Router();


// Professional creates quote
router.post(
  "/",
  protect,
  authorize("professional"),
  createQuoteValidation,
  validate,
  create
);


// Professional's own quotes
router.get(
  "/my",
  protect,
  authorize("professional"),
  getMine
);


// Customer gets quotes for a work request
router.get(
  "/work-request/:workRequestId",
  protect,
  authorize("customer"),
  getForWorkRequest
);

router.patch(
  "/:id/accept",
  protect,
  authorize("customer"),
  quoteIdValidation,
  validate,
  accept
);


// Professional negotiates / updates quote
router.put(
  "/:id",
  protect,
  authorize("professional"),
  updateQuoteValidation,
  validate,
  update
);

export default router;