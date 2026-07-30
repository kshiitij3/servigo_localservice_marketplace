import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    
    bookingId: {
      type: String,
      unique: true,
      index: true,
    },

    workRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkRequest",
      required: [true, "Work request is required"],
      unique: true,
    },

    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: [true, "Accepted quote is required"],
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

    agreedAmount: {
      type: Number,
      required: [true, "Agreed amount is required"],
      min: [0, "Agreed amount cannot be negative"],
    },

    // Copy the location when booking is created.
    // This prevents future WorkRequest edits from
    // changing the confirmed booking location.

    workLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },
    },

    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },

    scheduledTime: {
      type: String,
      required: [true, "Scheduled time is required"],
    },

    status: {
      type: String,

      enum: [
        "confirmed",
        "scheduled",
        "on_the_way",
        "arrived",
        "work_started",
        "work_completed",
        "payment_pending",
        "paid",
        "closed",
        "cancelled",
      ],

      default: "confirmed",

      index: true,
    },

    confirmedAt: {
      type: Date,
      default: Date.now,
    },

    onTheWayAt: {
      type: Date,
      default: null,
    },

    arrivedAt: {
      type: Date,
      default: null,
    },

    workStartedAt: {
      type: Date,
      default: null,
    },

    workCompletedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",

      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },


    isReviewed: {
      type: Boolean,
      default: false,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },


    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Customer booking history
bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

// Professional booking history
bookingSchema.index({
  professional: 1,
  createdAt: -1,
});

// Professional upcoming jobs
bookingSchema.index({
  professional: 1,
  status: 1,
  scheduledDate: 1,
});

// Location-based operations
bookingSchema.index({
  workLocation: "2dsphere",
});


bookingSchema.pre("save", async function () {
  if (this.bookingId) {
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

  this.bookingId =
    `SVG-BKG-${year}${month}${day}-${randomNumber}`;
});


const Booking = mongoose.model(
  "Booking",
  bookingSchema
);

export default Booking;