const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    active: {
      type: Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deviceID: {
      type: String,
    },
    device: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    date: {
      type: String,
    },
    screenSize: {
      type: String,
    },
    browser: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);
const DeviceDetails = mongoose.model("deviceDetails", userSchema);

module.exports = DeviceDetails;
