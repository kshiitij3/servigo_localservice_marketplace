import Quote from "../models/Quote.js";
import WorkRequest from "../models/WorkRequest.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// Create Quote
export const createQuote = async (
  professionalId,
  quoteData
) => {
  const {
    workRequest,
    initialAmount,
    message,
    estimatedDuration,
    availableDate,
    availableTime,
  } = quoteData;

  const request = await WorkRequest.findById(workRequest);

  if (!request) {
    throw new ApiError(
      404,
      "Work request not found"
    );
  }

  if (
    request.status === "CANCELLED_BY_CUSTOMER" ||
    request.status === "CANCELLED_BY_PROFESSIONAL"
  ) {
    throw new ApiError(
      400,
      "This work request has been cancelled"
    );
  }

  if (
    request.status === "BOOKED" ||
    request.status === "IN_PROGRESS" ||
    request.status === "COMPLETED"
  ) {
    throw new ApiError(
      400,
      "This work request is no longer accepting quotes"
    );
  }

  if (
    request.customer.toString() ===
    professionalId.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot quote on your own work request"
    );
  }

  const existingQuote = await Quote.findOne({
    workRequest,
    professional: professionalId,
  });

  if (existingQuote) {
    throw new ApiError(
      409,
      "You have already submitted a quote for this request"
    );
  }

  const quote = await Quote.create({
    workRequest,
    professional: professionalId,
    customer: request.customer,
    initialAmount,
    amount: initialAmount,
    message,
    estimatedDuration,
    availableDate,
    availableTime,
  });

  await WorkRequest.findByIdAndUpdate(
    workRequest,
    {
      $inc: {
        quoteCount: 1,
      },
      $set: {
        status: "QUOTED",
      },
    }
  );

  return quote;
};


// Update / Negotiate Quote
export const updateQuote = async (
  quoteId,
  professionalId,
  quoteData
) => {
  const quote = await Quote.findById(quoteId);

  if (!quote) {
    throw new ApiError(
      404,
      "Quote not found"
    );
  }

  if (
    quote.professional.toString() !==
    professionalId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to modify this quote"
    );
  }

  if (
    quote.status === "accepted" ||
    quote.status === "rejected" ||
    quote.status === "withdrawn"
  ) {
    throw new ApiError(
      400,
      "This quote can no longer be modified"
    );
  }

  const {
    amount,
    message,
    estimatedDuration,
  } = quoteData;

  if (!Number.isFinite(Number(amount)) || Number(amount) < 1) {
    throw new ApiError(400, "Quote amount must be greater than 0");
  }

  // Save previous version
  quote.revisions.push({
    amount: quote.amount,
    message: quote.message,
  });

  quote.amount = Number(amount);

  if (message !== undefined) {
    quote.message = message;
  }

  if (estimatedDuration !== undefined) {
    quote.estimatedDuration = estimatedDuration;
  }

  quote.status = "negotiating";

  await quote.save();

  return quote;
};


// Get quotes for customer
export const getQuotesForWorkRequest = async (
  workRequestId,
  customerId
) => {
  const request = await WorkRequest.findById(
    workRequestId
  );

  if (!request) {
    throw new ApiError(
      404,
      "Work request not found"
    );
  }

  if (
    request.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view these quotes"
    );
  }

  return Quote.find({
    workRequest: workRequestId,
  })
    .populate(
      "professional",
      "name profileImage professionalProfile"
    )
    .sort({ amount: 1 });
};


// Get professional's own quotes
export const getMyQuotes = async (
  professionalId
) => {
  return Quote.find({
    professional: professionalId,
  })
    .populate(
      "workRequest",
      "title description category location status"
    )
    .sort({ createdAt: -1 });
};

export const acceptQuote = async (
  quoteId,
  customerId
) => {

  const quote = await Quote.findById(quoteId);

  if (!quote) {
    throw new ApiError(
      404,
      "Quote not found"
    );
  }

  const workRequest = await WorkRequest.findById(
    quote.workRequest
  );

  if (!workRequest) {
    throw new ApiError(
      404,
      "Work request not found"
    );
  }

  // Only the customer who created
  // the work request can accept the quote.
  if (
    workRequest.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to accept this quote"
    );
  }

  // Work request must still be available.
  if (
    workRequest.status !== "OPEN" &&
    workRequest.status !== "QUOTED"
  ) {
    throw new ApiError(
      400,
      "This work request is no longer available"
    );
  }

  // Quote must still be active.
  if (
    quote.status === "accepted" ||
    quote.status === "rejected" ||
    quote.status === "withdrawn"
  ) {
    throw new ApiError(
      400,
      "This quote can no longer be accepted"
    );
  }

  // Check that the quoted professional is still active.
  const professional = await User.findOne({
    _id: quote.professional,
    role: "professional",
    isActive: true,
  });

  if (!professional) {
    throw new ApiError(
      404,
      "Professional not found or inactive"
    );
  }

  // The professional must be available before acceptance.
  const availability =
    professional.professionalProfile
      ?.availabilityStatus;

  if (availability !== "available") {
    throw new ApiError(
      400,
      "Professional is currently unavailable"
    );
  }

  // Accept selected quote.
  quote.status = "accepted";
  quote.acceptedAt = new Date();
  quote.respondedAt = new Date();

  await quote.save();

  // Reject every other quote.
  await Quote.updateMany(
    {
      workRequest: workRequest._id,
      _id: { $ne: quote._id },
      status: {
        $in: ["submitted", "negotiating"],
      },
    },
    {
      $set: {
        status: "rejected",
        respondedAt: new Date(),
      },
    }
  );

  // Update the work request for the future booking flow.
  workRequest.status = "BOOKED";
  workRequest.selectedProfessional =
    quote.professional;
  workRequest.selectedQuote = quote._id;

  await workRequest.save();

  return quote;
};
