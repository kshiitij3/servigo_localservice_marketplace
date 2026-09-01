import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ==========================================
    // Servigo Transaction ID
    // ==========================================

    transactionId: {
      type: String,
      unique: true,
      index: true,
    },

    // ==========================================
    // Booking
    // ==========================================

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
      unique: true,
      index: true,
    },

    // ==========================================
    // Customer
    // ==========================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
      index: true,
    },

    // ==========================================
    // Professional
    // ==========================================

    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Professional is required"],
      index: true,
    },

    // ==========================================
    // Total amount paid by customer
    // ==========================================

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [1, "Payment amount must be greater than 0"],
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    // ==========================================
    // Servigo Commission
    // ==========================================

    commission: {
      rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // ==========================================
    // Professional Transfer
    // ==========================================

    transfer: {
      razorpayTransferId: {
        type: String,
        default: null,
        index: true,
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "not_started",
          "pending",
          "processed",
          "failed",
          "reversed",
        ],
        default: "not_started",
        index: true,
      },

      transferredAt: {
        type: Date,
        default: null,
      },
    },

    // ==========================================
    // Payment Provider
    // ==========================================

    provider: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    // ==========================================
    // Razorpay Information
    // ==========================================

    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },

    // Never expose this unnecessarily
    razorpaySignature: {
      type: String,
      default: null,
      select: false,
    },

    // ==========================================
    // Payment Status
    // ==========================================

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "created",
      index: true,
    },

    // ==========================================
    // Verification
    // ==========================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Refund
    // ==========================================

    refund: {
      refundId: {
        type: String,
        default: null,
      },

      amount: {
        type: Number,
        default: 0,
        min: 0,
      },

      reason: {
        type: String,
        default: "",
        trim: true,
      },

      refundedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Indexes
// ==========================================

// Customer payment history
paymentSchema.index({
  customer: 1,
  createdAt: -1,
});

// Professional earnings history
paymentSchema.index({
  professional: 1,
  status: 1,
  createdAt: -1,
});

// Transfer history
paymentSchema.index({
  "transfer.status": 1,
  createdAt: -1,
});

// ==========================================
// Generate Transaction ID
// ==========================================

paymentSchema.pre("save", function (next) {
  if (this.transactionId) {
    return next();
  }

  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  this.transactionId =
    `SVG-PAY-${year}${month}${day}-${randomNumber}`;

  next();
});

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;