import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

  
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({
  professional: 1,
  createdAt: -1,
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;