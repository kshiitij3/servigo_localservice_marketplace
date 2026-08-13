import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createQuote,
  updateQuote,
  getQuotesForWorkRequest,
  getMyQuotes,
  acceptQuote,
} from "../services/quote.service.js";


// Professional creates quote
export const create = asyncHandler(
  async (req, res) => {
    const quote = await createQuote(
      req.user._id,
      req.body
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Quote submitted successfully",
        quote
      )
    );
  }
);


// Professional updates / negotiates quote
export const update = asyncHandler(
  async (req, res) => {
    const quote = await updateQuote(
      req.params.id,
      req.user._id,
      req.body
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Quote updated successfully",
        quote
      )
    );
  }
);


// Customer gets quotes for a work request
export const getForWorkRequest = asyncHandler(
  async (req, res) => {
    const quotes =
      await getQuotesForWorkRequest(
        req.params.workRequestId,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Quotes fetched successfully",
        quotes
      )
    );
  }
);


// Professional gets own quotes
export const getMine = asyncHandler(
  async (req, res) => {
    const quotes =
      await getMyQuotes(req.user._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        "Your quotes fetched successfully",
        quotes
      )
    );
  }
);

export const accept = asyncHandler(
  async (req, res) => {

    const quote = await acceptQuote(
      req.params.id,
      req.user._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Quote accepted successfully",
        quote
      )
    );
  }
);