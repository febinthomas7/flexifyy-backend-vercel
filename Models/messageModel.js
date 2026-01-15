const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userMessages = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    senderName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const message = mongoose.model("message", userMessages);

module.exports = message;
