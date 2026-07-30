import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
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

    // Chat initially belongs to a work request
    // because negotiation happens before booking

    workRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkRequest",
      required: [true, "Work request is required"],
      index: true,
    },

  
    // Professional must submit a quote before
    // customer and professional start negotiation.

    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: [true, "Quote is required"],
    },


    // Initially null.
    // Added when customer accepts the quote.

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    // Used to display chat previews.

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "closed", "blocked"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// One professional should have only one chat
// with a customer for a particular work request.

chatSchema.index(
  {
    workRequest: 1,
    professional: 1,
  },
  {
    unique: true,
  }
);


chatSchema.index({
  customer: 1,
  lastMessageAt: -1,
});


chatSchema.index({
  professional: 1,
  lastMessageAt: -1,
});


const Chat = mongoose.model("Chat", chatSchema);

export default Chat;