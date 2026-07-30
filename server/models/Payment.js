import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
   
    transactionId: {
      type: String,
      unique: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
      unique: true,
      index: true,
    },

 
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
      index: true,
    },

   
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Professional is required"],
      index: true,
    },

   
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

   
    provider: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

   
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

    // Never expose this unnecessarily to the frontend.
    
    razorpaySignature: {
      type: String,
      default: null,
      select: false,
    },

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

    refund: {
      refundId: {
        type: String,
        default: null,
      },

      amount: {
        type: Number,
        default: 0,
      },

      reason: {
        type: String,
        default: "",
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


paymentSchema.pre("save", async function () {
  if (this.transactionId) {
    return;
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
});


const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;