import mongoose from "mongoose";

const workRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Work title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Work description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    customCategory: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Custom category cannot exceed 100 characters"],
    },

    media: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },

        mediaType: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: [true, "Work location is required"],
      },

      address: {
        type: String,
        required: [true, "Work address is required"],
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },
    },

    budget: {
      min: {
        type: Number,
        min: [0, "Minimum budget cannot be negative"],
      },

      max: {
        type: Number,
        min: [0, "Maximum budget cannot be negative"],
      },
    },

    preferredDate: {
      type: Date,
    },

    preferredTimeSlot: {
      start: {
        type: String,
        default: "",
      },

      end: {
        type: String,
        default: "",
      },
    },

    // Customer chooses how far the request
    // should be broadcast.
    // Minimum: 5 km
    // Default: 10 km
    // Maximum: 50 km
    visibilityRadius: {
      type: Number,
      default: 10,
      min: [5, "Minimum radius is 5 km"],
      max: [50, "Maximum radius is 50 km"],
    },

    isUrgent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "QUOTED",
        "BOOKED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED_BY_CUSTOMER",
        "CANCELLED_BY_PROFESSIONAL",
      ],
      default: "OPEN",
      index: true,
    },

    selectedProfessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    selectedQuote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      default: null,
    },

    quoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    quoteDeadline: {
      type: Date,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// GeoJSON index
workRequestSchema.index({
  location: "2dsphere",
});

// Category + status + latest requests
workRequestSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

// Customer's requests
workRequestSchema.index({
  customer: 1,
  createdAt: -1,
});

// Quote deadline
workRequestSchema.index({
  status: 1,
  quoteDeadline: 1,
});

// Generate request ID
workRequestSchema.pre("save", function () {
  if (this.requestId) {
    return;
  }

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  this.requestId =
    `SVG-${year}${month}${day}-${random}`;

});

const WorkRequest = mongoose.model(
  "WorkRequest",
  workRequestSchema
);

export default WorkRequest;
