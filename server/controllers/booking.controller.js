import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createBooking,
   updateBookingStatus
} from "../services/booking.service.js";

export const create = asyncHandler(
  async (req, res) => {
    const booking = await createBooking(
      req.user._id,
      req.body
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Booking created successfully",
        booking
      )
    );
  }
);


export const updateStatus = asyncHandler(
  async (req, res) => {
    const booking = await updateBookingStatus(
      req.params.id,
      req.user._id,
      req.body.status
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Booking status updated successfully",
        booking
      )
    );
  }
);
