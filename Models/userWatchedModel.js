const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    id: {
      type: Number,
    },
    overview: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    backdrop_path: {
      type: String,
    },
    adult: {
      type: Boolean,
    },
    poster_path: {
      type: String,
    },
    genre_ids: {
      type: Array,
    },
    title: {
      type: String,
    },
    vote_average: {
      type: Number,
    },
    release_date: {
      type: String,
    },
    type: {
      type: String,
    },
    mode: {
      type: String,
    },
    original_language: {
      type: String,
    },
    embed_url: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("usersWatchingList", userSchema);

module.exports = UserModel;
