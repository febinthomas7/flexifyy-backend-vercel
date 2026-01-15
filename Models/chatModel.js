const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userchatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);
const userchat = mongoose.model("userchat", userchatSchema);
module.exports = userchat;
