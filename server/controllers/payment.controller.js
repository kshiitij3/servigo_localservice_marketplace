import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../services/payment.service.js";



export const createOrder = asyncHandler(
  async (req, res) => {

    const result =
      await createPaymentOrder(
        req.user._id,
        req.body.booking
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Payment order created successfully",
        result
      )
    );
  }
);



export const verify = asyncHandler(
  async (req, res) => {

    const {
      booking,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;


    const payment =
      await verifyPayment(
        req.user._id,
        booking,
        razorpayPaymentId,
        razorpaySignature
      );


    return res.status(200).json(
      new ApiResponse(
        200,
        "Payment verified successfully",
        payment
      )
    );
  }
);