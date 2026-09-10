import Booking from "../models/Booking.js";
import Quote from "../models/Quote.js";
import WorkRequest from "../models/WorkRequest.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";


const timeToMinutes = (time) => {
  if (typeof time !== "string" || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    return NaN;
  }

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const isTimeOverlap = (
  newStart,
  newEnd,
  existingStart,
  existingEnd
) => {
  return (
    newStart < existingEnd &&
    newEnd > existingStart
  );
};


export const createBooking = async (
  customerId,
  bookingData
) => {
  const {
    quote: quoteId,
    scheduledDate,
    scheduledTime,
  } = bookingData;

  if (!scheduledTime || typeof scheduledTime !== "object") {
    throw new ApiError(400, "Scheduled time is required");
  }


  const quote = await Quote.findById(quoteId);

  if (!quote) {
    throw new ApiError(404, "Quote not found");
  }


  if (quote.status !== "accepted") {
    throw new ApiError(
      400,
      "Only an accepted quote can create a booking"
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


  if (
    workRequest.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to create this booking"
    );
  }


  if (workRequest.status !== "BOOKED") {
    throw new ApiError(
      400,
      "Work request is not ready for booking"
    );
  }


  const existingBooking = await Booking.findOne({
    workRequest: workRequest._id,
  });

  if (existingBooking) {
    throw new ApiError(
      409,
      "A booking already exists for this work request"
    );
  }


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


  if (
    professional.professionalProfile
      ?.availabilityStatus !== "available"
  ) {
    throw new ApiError(
      400,
      "Professional is currently unavailable"
    );
  }


  const newStart = timeToMinutes(
    scheduledTime.start
  );

  const newEnd = timeToMinutes(
    scheduledTime.end
  );

  if (!Number.isFinite(newStart) || !Number.isFinite(newEnd) || newEnd <= newStart) {
    throw new ApiError(400, "Scheduled time must be a valid non-empty interval");
  }

  if (quote.customer.toString() !== customerId.toString()) {
    throw new ApiError(403, "You are not allowed to create this booking");
  }


  const selectedDate = new Date(scheduledDate);

  if (!Number.isFinite(selectedDate.getTime())) {
    throw new ApiError(400, "Scheduled date is invalid");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    throw new ApiError(400, "Scheduled date cannot be in the past");
  }

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await Booking.find({
    professional: professional._id,

    scheduledDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },

    status: {
      $nin: ["cancelled", "closed"],
    },
  });


  const hasConflict = existingBookings.some(
    (booking) => {
      const existingStart = timeToMinutes(
        booking.scheduledTime.start
      );

      const existingEnd = timeToMinutes(
        booking.scheduledTime.end
      );

      return isTimeOverlap(
        newStart,
        newEnd,
        existingStart,
        existingEnd
      );
    }
  );

  if (hasConflict) {
    throw new ApiError(
      409,
      "Professional already has a booking during this time slot"
    );
  }


  const booking = await Booking.create({
    workRequest: workRequest._id,

    quote: quote._id,

    customer: workRequest.customer,

    professional: quote.professional,

    agreedAmount: quote.amount,

    workLocation: workRequest.location,

    scheduledDate: selectedDate,

    scheduledTime: {
      start: scheduledTime.start,
      end: scheduledTime.end,
    },

    status: "confirmed",

    paymentStatus: "pending",
  });

  await User.updateOne(
    { _id: professional._id },
    {
      $set: {
        "professionalProfile.availabilityStatus": "busy",
      },
    }
  );


  return booking;
};

export const getMyBookings = async (
  userId,
  role
) => {
  const filter =
    role === "customer"
      ? { customer: userId }
      : { professional: userId };

  return Booking.find(filter)
    .populate(
      "workRequest",
      "requestId title description category location"
    )
    .populate(
      "quote",
      "amount estimatedDuration availableDate availableTime status"
    )
    .populate(
      "customer",
      "name email phone avatar"
    )
    .populate(
      "professional",
      "name email phone professionalProfile avatar"
    )
    .sort({ createdAt: -1 });
};

export const getBookingById = async (
  bookingId,
  userId
) => {
  const booking = await Booking.findById(
    bookingId
  )
    .populate(
      "workRequest",
      "requestId title description category customCategory media location budget preferredDate preferredTimeSlot"
    )
    .populate(
      "quote",
      "amount initialAmount message estimatedDuration availableDate availableTime status"
    )
    .populate(
      "customer",
      "name email phone avatar"
    )
    .populate(
      "professional",
      "name email phone professionalProfile avatar"
    );

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  const isCustomer =
    booking.customer?._id?.toString() ===
    userId?.toString() ||
    booking.customer?.toString() ===
    userId?.toString();

  const isProfessional =
    booking.professional?._id?.toString() ===
    userId?.toString() ||
    booking.professional?.toString() ===
    userId?.toString();

  if (!isCustomer && !isProfessional) {
    throw new ApiError(
      403,
      "You are not authorized to view this booking"
    );
  }

  return booking;
};

export const updateBookingStatus = async (
  bookingId,
  professionalId,
  newStatus
) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Only the assigned professional
  // can update the work progress.
  if (
    booking.professional.toString() !==
    professionalId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to update this booking"
    );
  }

  // Allowed sequential transitions.
  const allowedTransitions = {
    confirmed: ["scheduled"],
    scheduled: ["on_the_way"],
    on_the_way: ["arrived"],
    arrived: ["work_started"],
    work_started: ["work_completed"],
    work_completed: [],
    payment_pending: [],
    paid: [],
    closed: [],
    cancelled: [],
  };

  const nextStatuses =
    allowedTransitions[booking.status] || [];

  if (!nextStatuses.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change booking status from ${booking.status} to ${newStatus}`
    );
  }

  const now = new Date();

  booking.status = newStatus;

  // Store timestamp for each milestone.
  if (newStatus === "scheduled") {
    booking.confirmedAt =
      booking.confirmedAt || now;
  }

  if (newStatus === "on_the_way") {
    booking.onTheWayAt = now;
  }

  if (newStatus === "arrived") {
    booking.arrivedAt = now;
  }

  if (newStatus === "work_started") {
    booking.workStartedAt = now;
  }

  if (newStatus === "work_completed") {
    booking.workCompletedAt = now;

    // Payment becomes due.
    booking.status = "payment_pending";

    booking.paymentStatus = "pending";
  }

  await booking.save();

  await booking.populate([
    { path: "customer", select: "name email phone avatar" },
    { path: "professional", select: "name email phone avatar" },
  ]);

  return booking;
};