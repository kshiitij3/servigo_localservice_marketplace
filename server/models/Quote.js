import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    workRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkRequest",
      required: [true, "Work request is required"],
      index: true,
    },

    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Professional is required"],
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
      index: true,
    },

    // Original amount proposed by professional
    initialAmount: {
      type: Number,
      required: [true, "Quote amount is required"],
      min: [1, "Quote amount must be greater than 0"],
    },

    // Current amount after negotiation
    amount: {
      type: Number,
      required: [true, "Current quote amount is required"],
      min: [1, "Quote amount must be greater than 0"],
    },

    message: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Quote message cannot exceed 1000 characters",
      ],
      default: "",
    },

    estimatedDuration: {
      value: {
        type: Number,
        min: 1,
      },

      unit: {
        type: String,
        enum: ["minutes", "hours", "days"],
      },
    },

    availableDate: {
      type: Date,
    },

    availableTime: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,

      enum: [
        "submitted",
        "negotiating",
        "accepted",
        "rejected",
        "withdrawn",
      ],

      default: "submitted",

      index: true,
    },

    // Stores previous quote versions
    revisions: [
      {
        amount: {
          type: Number,
          required: true,
          min: 1,
        },

        message: {
          type: String,
          trim: true,
          default: "",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    acceptedAt: {
      type: Date,
      default: null,
    },

    // CHANGED: track when customer responds
    respondedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// A professional can have only ONE quote
// for a particular work request.
quoteSchema.index(
  {
    workRequest: 1,
    professional: 1,
  },
  {
    unique: true,
  }
);


// Customer can get quotes sorted by price.
quoteSchema.index({
  workRequest: 1,
  amount: 1,
});


// Professional's quote history.
quoteSchema.index({
  professional: 1,
  createdAt: -1,
});


// Customer's quote history.
quoteSchema.index({
  customer: 1,
  createdAt: -1,
});


const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;