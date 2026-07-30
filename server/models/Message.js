import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat is required"],
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
      index: true,
    },

    type: {
      type: String,

      enum: [
        "text",
        "image",
        "system",
        "quote_update",
      ],

      default: "text",
    },

    content: {
      type: String,
      trim: true,
      maxlength: [
        5000,
        "Message cannot exceed 5000 characters",
      ],
      default: "",
    },

    media: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    quoteUpdate: {
      previousAmount: {
        type: Number,
      },

      newAmount: {
        type: Number,
      },
    },


    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// Fetch messages for a chat in chronological order.

messageSchema.index({
  chat: 1,
  createdAt: 1,
});


messageSchema.index({
  chat: 1,
  isRead: 1,
});


const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;