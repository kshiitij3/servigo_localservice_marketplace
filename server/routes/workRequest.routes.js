import express from "express";

import protect from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  create,
  getMine,
  getById,
  update,
  remove,
  getNearby,
} from "../controllers/workRequest.controller.js";

import {
  createWorkRequestValidation,
  updateWorkRequestValidation,
  workRequestIdValidation,
  validate,
} from "../validations/workRequest.validation.js";

const router = express.Router();



// Create Work Request
router.post(
  "/",
  protect,
  authorize("customer"),
  createWorkRequestValidation,
  validate,
  create
);

// Get My Work Requests
router.get(
  "/my",
  protect,
  authorize("customer"),
  getMine
);

// Nearby Work Requests
router.get(
  "/nearby",
  protect,
  authorize("professional"),
  getNearby
);

// Get Single Work Request
router.get(
  "/:id",
  protect,
  workRequestIdValidation,
  validate,
  getById
);

// Update Work Request
router.put(
  "/:id",
  protect,
  authorize("customer"),
  updateWorkRequestValidation,
  validate,
  update
);

// Delete Work Request
router.delete(
  "/:id",
  protect,
  authorize("customer"),
  workRequestIdValidation,
  validate,
  remove
);

export default router;
