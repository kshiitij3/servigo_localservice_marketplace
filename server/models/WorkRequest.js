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
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Work description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

  
    media: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          default: "",
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

      // GeoJSON format:
      // [longitude, latitude]
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


    preferredDate: {
      type: Date,
    },

    preferredTime: {
      type: String,
      default: "",
    },


    status: {
      type: String,

      enum: [
        "open",
        "receiving_quotes",
        "booked",
        "in_progress",
        "completed",
        "cancelled",
      ],

      default: "open",

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


    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


workRequestSchema.index({
  location: "2dsphere",
});

// Helps professionals search for nearby,
// open jobs belonging to their categories.
workRequestSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

workRequestSchema.pre("save", async function () {
  if (this.requestId) {
    return;
  }

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  this.requestId =
    `SVG-${year}${month}${day}-${randomNumber}`;
});


const WorkRequest = mongoose.model(
  "WorkRequest",
  workRequestSchema
);

export default WorkRequest;