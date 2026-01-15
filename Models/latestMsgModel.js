const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "users", // Reference to user documents
      },
    ],

    latestMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const latestChatModel = mongoose.model("latestChat", ChatSchema);

module.exports = latestChatModel;
