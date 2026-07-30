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

    initialAmount: {
      type: Number,
      required: [true, "Quote amount is required"],
      min: [0, "Quote amount cannot be negative"],
    },

    amount: {
      type: Number,
      required: [true, "Current quote amount is required"],
      min: [0, "Quote amount cannot be negative"],
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

    revisions: [
      {
        amount: {
          type: Number,
          required: true,
          min: 0,
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

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// A professional cannot create multiple separate
// quotes for the same work request.
//
// They should update/revise the existing quote.
quoteSchema.index(
  {
    workRequest: 1,
    professional: 1,
  },
  {
    unique: true,
  }
);

// Helps when customer requests:
// "Show all quotes for this work sorted by price"
quoteSchema.index({
  workRequest: 1,
  amount: 1,
});

quoteSchema.index({
  professional: 1,
  createdAt: -1,
});


const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;