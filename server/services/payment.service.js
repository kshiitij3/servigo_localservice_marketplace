import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/*
==========================================
Current Servigo Commission
==========================================

For now:
0%

Later:
Change this to the required percentage.
Do NOT calculate this from frontend input.
*/

const COMMISSION_RATE = 0;


// ==========================================
// Create Razorpay Order
// ==========================================

export const createPaymentOrder = async (
  customerId,
  bookingId
) => {

  // ----------------------------------------
  // 1. Find Booking
  // ----------------------------------------

  const booking = await Booking.findById(
    bookingId
  );

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }


  // ----------------------------------------
  // 2. Verify Customer
  // ----------------------------------------

  if (
    booking.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to pay for this booking"
    );
  }


  // ----------------------------------------
  // 3. Booking must require payment
  // ----------------------------------------

  if (
    booking.status !==
    "payment_pending"
  ) {
    throw new ApiError(
      400,
      "Payment is not currently required for this booking"
    );
  }


  if (
    booking.paymentStatus !==
    "pending"
  ) {
    throw new ApiError(
      400,
      "Payment cannot be initiated in the current state"
    );
  }


  // ----------------------------------------
  // 4. Find Professional
  // ----------------------------------------

  const professional = await User.findOne({
    _id: booking.professional,
    role: "professional",
    isActive: true,
  });

  if (!professional) {
    throw new ApiError(
      404,
      "Professional not found or inactive"
    );
  }


  // ----------------------------------------
  // 5. Check Razorpay account
  // ----------------------------------------

  const paymentProfile =
    professional.professionalProfile
      ?.paymentProfile;

  if (
    !paymentProfile?.razorpayAccountId
  ) {
    throw new ApiError(
      400,
      "Professional has not completed payment onboarding"
    );
  }

  if (
    paymentProfile.onboardingStatus !==
    "active"
  ) {
    throw new ApiError(
      400,
      "Professional payment account is not active"
    );
  }

  if (
    !paymentProfile.isPaymentEnabled
  ) {
    throw new ApiError(
      400,
      "Professional is not enabled to receive payments"
    );
  }


  // ----------------------------------------
  // 6. Check existing payment
  // ----------------------------------------

  const existingPayment =
    await Payment.findOne({
      booking: booking._id,
    });


  if (
    existingPayment &&
    (
      existingPayment.status === "paid" ||
      existingPayment.status === "processing"
    )
  ) {
    throw new ApiError(
      400,
      "Payment has already been initiated or completed"
    );
  }


  // ----------------------------------------
  // 7. Trusted amount
  // ----------------------------------------

  const grossAmount =
    booking.agreedAmount;

  if (
    !grossAmount ||
    grossAmount <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid booking amount"
    );
  }


  // ----------------------------------------
  // 8. Commission calculation
  // ----------------------------------------

  const commissionAmount =
    Math.round(
      grossAmount *
      COMMISSION_RATE /
      100 *
      100
    ) / 100;

  const professionalAmount =
    grossAmount -
    commissionAmount;


  if (professionalAmount <= 0) {
    throw new ApiError(
      400,
      "Professional transfer amount is invalid"
    );
  }


  // ----------------------------------------
  // 9. Convert to paise
  // ----------------------------------------

  const amountInPaise =
    Math.round(
      grossAmount * 100
    );

  const professionalAmountInPaise =
    Math.round(
      professionalAmount * 100
    );


  // ----------------------------------------
  // 10. Create Razorpay Order
  // ----------------------------------------

  let razorpayOrder;

  try {

    razorpayOrder =
      await razorpay.orders.create({

        amount: amountInPaise,

        currency: "INR",

        receipt:
          booking.bookingId,

        partial_payment: false,

        notes: {
          bookingId:
            booking._id.toString(),

          customerId:
            booking.customer.toString(),

          professionalId:
            booking.professional.toString(),

          commissionRate:
            COMMISSION_RATE.toString(),
        },

      });

  } catch (error) {

    console.error(
      "Razorpay order creation failed:",
      error
    );

    throw new ApiError(
      502,
      "Payment provider failed to create order"
    );
  }


  // ----------------------------------------
  // 11. Create / Update Payment
  // ----------------------------------------

  let payment =
    existingPayment;

  if (!payment) {

    payment =
      await Payment.create({

        booking:
          booking._id,

        customer:
          booking.customer,

        professional:
          booking.professional,

        amount:
          grossAmount,

        currency:
          "INR",

        provider:
          "razorpay",

        razorpayOrderId:
          razorpayOrder.id,

        status:
          "created",

        commission: {
          rate:
            COMMISSION_RATE,

          amount:
            commissionAmount,
        },

        transfer: {
          amount:
            professionalAmount,

          status:
            "not_started",
        },

      });

  } else {

    payment.amount =
      grossAmount;

    payment.razorpayOrderId =
      razorpayOrder.id;

    payment.status =
      "created";

    payment.failureReason =
      "";

    payment.commission = {
      rate:
        COMMISSION_RATE,

      amount:
        commissionAmount,
    };

    payment.transfer = {
      amount:
        professionalAmount,

      status:
        "not_started",
    };

    await payment.save();
  }


  // ----------------------------------------
  // 12. Link Payment with Booking
  // ----------------------------------------

  booking.payment =
    payment._id;

  booking.paymentStatus =
    "processing";

  await booking.save();


  // ----------------------------------------
  // 13. Return Checkout Data
  // ----------------------------------------

  return {

    paymentId:
      payment._id,

    razorpayOrder: {
      id:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,
    },

    amount:
      grossAmount,

    commission:
      commissionAmount,

    professionalAmount,

    keyId:
      process.env.RAZORPAY_KEY_ID,
  };
};


// ==========================================
// Verify Razorpay Payment
// ==========================================

export const verifyPayment = async (
  customerId,
  bookingId,
  razorpayPaymentId,
  razorpaySignature
) => {

  // ----------------------------------------
  // 1. Find Booking
  // ----------------------------------------

  const booking =
    await Booking.findById(
      bookingId
    );

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }


  // ----------------------------------------
  // 2. Verify Customer
  // ----------------------------------------

  if (
    booking.customer.toString() !==
    customerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to verify this payment"
    );
  }


  // ----------------------------------------
  // 3. Find Payment
  // ----------------------------------------

  const payment =
    await Payment.findOne({
      booking:
        booking._id,
    }).select("+razorpaySignature");


  if (!payment) {
    throw new ApiError(
      404,
      "Payment record not found"
    );
  }


  // ----------------------------------------
  // 4. Prevent duplicate verification
  // ----------------------------------------

  if (
    payment.isVerified &&
    payment.status === "paid"
  ) {
    throw new ApiError(
      400,
      "Payment has already been verified"
    );
  }


  // ----------------------------------------
  // 5. Get Order ID
  // ----------------------------------------

  const orderId =
    payment.razorpayOrderId;

  if (!orderId) {
    throw new ApiError(
      400,
      "Razorpay order ID not found"
    );
  }


  // ----------------------------------------
  // 6. Verify Signature
  // ----------------------------------------

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${orderId}|${razorpayPaymentId}`
      )
      .digest("hex");


  const receivedBuffer =
    Buffer.from(
      razorpaySignature,
      "utf8"
    );

  const generatedBuffer =
    Buffer.from(
      generatedSignature,
      "utf8"
    );


  if (
    receivedBuffer.length !==
    generatedBuffer.length
  ) {

    payment.status =
      "failed";

    payment.failureReason =
      "Payment signature verification failed";

    await payment.save();

    throw new ApiError(
      400,
      "Payment verification failed"
    );
  }


  const signatureMatches =
    crypto.timingSafeEqual(
      receivedBuffer,
      generatedBuffer
    );


  if (!signatureMatches) {

    payment.status =
      "failed";

    payment.failureReason =
      "Payment signature verification failed";

    await payment.save();

    throw new ApiError(
      400,
      "Payment verification failed"
    );
  }


  // ----------------------------------------
  // 7. Verify payment with Razorpay
  // ----------------------------------------
  
  // Signature verification proves that the
  // response is authentic. Fetching the payment
  // lets us confirm the payment/order state.
  
  let razorpayPayment;

  try {

    razorpayPayment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

  } catch (error) {

    console.error(
      "Failed to fetch Razorpay payment:",
      error
    );

    throw new ApiError(
      502,
      "Unable to verify payment status with Razorpay"
    );
  }


  if (
    razorpayPayment.order_id !==
    orderId
  ) {
    throw new ApiError(
      400,
      "Payment does not belong to this order"
    );
  }


  if (
    razorpayPayment.status !==
    "captured"
  ) {
    throw new ApiError(
      400,
      `Payment is not captured. Current status: ${razorpayPayment.status}`
    );
  }


  // ----------------------------------------
  // 8. Verify amount
  // ----------------------------------------

  const expectedAmountInPaise =
    Math.round(
      payment.amount * 100
    );

  if (
    razorpayPayment.amount !==
    expectedAmountInPaise
  ) {
    throw new ApiError(
      400,
      "Payment amount does not match booking amount"
    );
  }


  // ----------------------------------------
  // 9. Mark Payment as Paid
  // ----------------------------------------

  payment.razorpayPaymentId =
    razorpayPaymentId;

  payment.razorpaySignature =
    razorpaySignature;

  payment.status =
    "paid";

  payment.isVerified =
    true;

  payment.verifiedAt =
    new Date();

  payment.paidAt =
    new Date();

  await payment.save();


  // ----------------------------------------
  // 10. Update Booking
  // ----------------------------------------

  booking.payment =
    payment._id;

  booking.paymentStatus =
    "paid";

  booking.paidAt =
    new Date();

  booking.status =
    "paid";

  await booking.save();


  // ----------------------------------------
  // 11. Create Route Transfer
  // ----------------------------------------

  /*
    At this point:

    Customer payment = captured
    Professional = verified
    Linked Account = active

    Now transfer the professional's share.
  */

  const professional =
    await User.findById(
      payment.professional
    );

  if (!professional) {

    throw new ApiError(
      404,
      "Professional not found for transfer"
    );
  }


  const razorpayAccountId =
    professional.professionalProfile
      ?.paymentProfile
      ?.razorpayAccountId;


  if (!razorpayAccountId) {

    payment.transfer.status =
      "failed";

    await payment.save();

    throw new ApiError(
      400,
      "Professional Razorpay account not found"
    );
  }


  const transferAmountInPaise =
    Math.round(
      payment.transfer.amount * 100
    );


  let transferResult;

  try {

    const result =
      await razorpay.payments.createTransfer(
        razorpayPaymentId,
        {
          transfers: [
            {
              account:
                razorpayAccountId,

              amount:
                transferAmountInPaise,

              currency:
                "INR",

              notes: {
                bookingId:
                  booking._id.toString(),

                transactionId:
                  payment.transactionId,
              },
            },
          ],
        }
      );

    transferResult =
      result;

  } catch (error) {

    console.error(
      "Razorpay transfer creation failed:",
      error
    );

    payment.transfer.status =
      "failed";

    await payment.save();

    throw new ApiError(
      502,
      "Payment succeeded but professional transfer could not be created"
    );
  }


  // ----------------------------------------
  // 12. Save Transfer Information
  // ----------------------------------------

  const transfer =
    transferResult?.items?.[0];


  if (transfer) {

    payment.transfer
      .razorpayTransferId =
        transfer.id;

    payment.transfer.status =
      transfer.transfer_status ||
      "pending";

    if (
      transfer.transfer_status ===
      "processed"
    ) {
      payment.transfer.transferredAt =
        new Date();
    }

    await payment.save();
  }


  return payment;
};