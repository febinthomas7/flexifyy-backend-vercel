const watchModel = require("../Models/userWatchedModel");
const userModel = require("../Models/userModel");
const deviceModel = require("../Models/deviceDetails");
const UserLikedModel = require("../Models/UserLiked");
const WatchingModel = require("../Models/WatchingModel");
const axios = require("axios");
const api_key = process.env.API_KEY;

const UserRecommendations = async (req, res) => {
  try {
    const { id } = req.query;

    // Find user and their liked or watched movies
    const user = await userModel.findOne({ _id: id }).populate("continue");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get movie IDs and types from user's continue watching list
    const movieDetails = user.continue
      .filter((movie) => movie.type !== undefined) // Exclude undefined types
      .map((movie) => ({ id: movie.id, type: movie.type }))
      .slice(-5);

    // If no valid movies to process, return an empty recommendation list
    if (!movieDetails.length) {
      return res.status(200).json({ recommendations: [] });
    }

    // Fetch recommendations for each movie
    const recommendations = [];
    for (const { id: movieId, type } of movieDetails) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${type}/${movieId}/recommendations`,
          {
            params: {
              language: "en-US",
              page: 1,
              sort_by: "popularity.desc",
              api_key: api_key, // Ensure API key is in environment
            },
          }
        );
        recommendations.push(...response.data.results);
      } catch (err) {
        console.error(`Error fetching recommendations :`);
      }
    }

    // Filter duplicates based on movie ID
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map((movie) => [movie.id, movie])).values()
    );

    // Limit recommendations to 10
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
    const limitedRecommendations = shuffleArray(uniqueRecommendations).slice(
      0,
      12
    );

    return res.status(200).json({ recommendations: limitedRecommendations });
  } catch (error) {
    console.error("Error fetching recommendations:");
    res.status(500).json({ error: "Internal server error" });
  }
};

const watch = async (req, res) => {
  const { type, mode, movie, userId } = req.body;
  const {
    adult,
    id,
    genre_ids,
    overview,
    title,
    poster_path,
    backdrop_path,
    vote_average,
    original_language,
    release_date,
    first_air_date,
    year,
    thumbnail,
    genres,
    embed_url,
    name,
    thumbnail_url,
  } = movie;

  try {
    // Validate incoming data (you can use a validation library like Joi for this)
    const query = id
      ? { id: id } // If `id` is defined, search by `id`
      : { title: title };

    const user = await userModel.findOne({ _id: userId }).populate("watchlist");
    const existingMovie = user.watchlist.find(
      (movie) =>
        (query.id && movie.id === query.id) || // Match by `id` if provided
        (query.title && movie.title === query.title) // Match by `title` if provided
    );

    if (existingMovie) {
      return res.status(200).json({
        message: "Movie already exists in the  Watching list",
        success: true,
        data: existingMovie, // Optionally return the existing data
      });
    }
    const list = await watchModel.create({
      adult,
      id,
      genre_ids: genre_ids || genres,
      overview,
      title: title || name,
      poster_path: poster_path || thumbnail || thumbnail_url,
      backdrop_path: backdrop_path || thumbnail,
      vote_average,
      type,
      release_date: release_date || first_air_date || year,
      embed_url,
      mode,
      original_language: original_language || "Ja",
      user: userId,
    });

    user.watchlist.push(list._id);

    await user.save();

    // Send a success response
    res.status(201).json({
      message: "added",
      success: true,
      data: {
        adult,
        id,
        genre_ids: genre_ids || genres,
        overview,
        title: title || name,
        poster_path: poster_path || thumbnail || thumbnail_url,
        backdrop_path: backdrop_path || thumbnail,
        vote_average,
        release_date: release_date || first_air_date || year,
        type,
        embed_url,
        mode,
        original_language: original_language || "Ja",
        user: userId,
      },
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const ContinueWatching = async (req, res) => {
  const { type, mode, movie, userId } = req.body;
  const {
    adult,
    id,
    genre_ids,
    overview,
    title,
    poster_path,
    backdrop_path,
    vote_average,
    original_language,
    release_date,
    first_air_date,
    year,
    thumbnail,
    genres,
    embed_url,
    name,
    thumbnail_url,
  } = movie;

  try {
    const query = id
      ? { id: id } // If `id` is defined, search by `id`
      : { title: title };

    const user = await userModel.findOne({ _id: userId }).populate("continue");
    const existingMovie = user.continue.find(
      (movie) =>
        (query.id && movie.id === query.id) || // Match by `id` if provided
        (query.title && movie.title === query.title) // Match by `title` if provided
    );

    if (existingMovie) {
      return res.status(200).json({
        message: "Movie already exists in the Continue Watching list",
        success: true,
        data: existingMovie, // Optionally return the existing data
      });
    }
    // Validate incoming data (you can use a validation library like Joi for this)

    const list = await WatchingModel.create({
      adult,
      id,
      genre_ids: genre_ids || genres,
      overview,
      title: title || name,
      poster_path: poster_path || thumbnail || thumbnail_url,
      backdrop_path: backdrop_path || thumbnail,
      vote_average,
      type,
      release_date: release_date || first_air_date || year,
      embed_url,
      mode,
      original_language: original_language || "Ja",
      user: userId,
    });

    user.continue.push(list._id);

    await user.save();

    // Send a success response
    res.status(201).json({
      message: "added",
      success: true,
      data: {
        adult,
        id,
        genre_ids: genre_ids || genres,
        overview,
        title: title || name,
        poster_path: poster_path || thumbnail || thumbnail_url,
        backdrop_path: backdrop_path || thumbnail,
        vote_average,
        release_date: release_date || first_air_date || year,
        type,
        embed_url,
        mode,
        original_language: original_language || "Ja",
        user: userId,
      },
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const like = async (req, res) => {
  const { type, mode, movie, userId } = req.body;
  const {
    adult,
    id,
    genre_ids,
    overview,
    title,
    poster_path,
    backdrop_path,
    vote_average,
    original_language,
    thumbnail,
    genres,
    embed_url,
  } = movie;

  try {
    // Validate incoming data (you can use a validation library like Joi for this)

    const list = await UserLikedModel.create({
      adult,
      id,
      genre_ids: genre_ids || genres,
      overview,
      title,
      poster_path: poster_path || thumbnail,
      backdrop_path: backdrop_path || thumbnail,
      vote_average,
      type,
      embed_url,
      mode,
      original_language: original_language || "Ja",
      user: userId,
    });

    const user = await userModel.findOne({ _id: userId });
    user.likedlist.push(list._id);

    await user.save();

    // Send a success response
    res.status(201).json({
      message: "liked",
      success: true,
      data: {
        adult,
        id,
        genre_ids: genre_ids || genres,
        overview,
        title,
        poster_path: poster_path || thumbnail,
        backdrop_path: backdrop_path || thumbnail,
        vote_average,
        type,
        embed_url,
        mode,
        original_language: original_language || "Ja",
        user: userId,
      },
    });
    console.log("added");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const deleteLikeById = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await userModel.findOne({ likedlist: id });
    if (user) {
      user.likedlist = user.likedlist.filter(
        (movieId) => movieId.toString() !== id
      );
      await user.save();

      res.status(200).json({ message: "deleted", success: true });
    } else {
      console.log("User not found");
    }

    console.log("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const Device = async (req, res) => {
  const active = true;
  try {
    const { userId, device, deviceID, state, country, browser, screenSize } =
      req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let existingDevice = await deviceModel.findOne({ userId, deviceID });
    if (!existingDevice) {
      // Create a new device entry if it doesn't exist
      existingDevice = await deviceModel.create({
        active,
        userId,
        device,
        deviceID,
        state,
        country,
        browser,
        screenSize,
      });
    }

    // Find the user and populate their device details
    const user = await userModel
      .findOne({ _id: userId })
      .populate("devicedetails");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Avoid adding the same device multiple times
    if (!user.devicedetails.some((d) => d._id.equals(existingDevice._id))) {
      user.devicedetails.push(existingDevice._id);
      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in device function:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchDeviceDetails = async (req, res) => {
  const { userid } = req.query;

  try {
    const user = await userModel
      .findOne({ _id: userid })
      .select("devicedetails") // Only include the devicedetails field
      .populate("devicedetails"); // Populate the devicedetails field with device details
    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.json({
      success: false,
    });
  }
};
const fetchDeviceLogout = async (req, res) => {
  const { deviceID, userId } = req.body;

  try {
    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (deviceID or userId)",
      });
    }

    // Find the user
    let user = await userModel
      .findOne({ _id: userId })
      .populate("devicedetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the device
    let existingDevice = await deviceModel.findOne({ userId, deviceID });
    if (!existingDevice) {
      return res.status(404).json({
        success: true,
        message: "Device not found",
      });
    }

    // Remove the device reference from the user's device details array
    user.devicedetails = user.devicedetails.filter(
      (d) => !d._id.equals(existingDevice._id)
    );
    await user.save();

    // Delete the device document
    await deviceModel.deleteOne({ _id: existingDevice._id });

    res.json({
      success: true,
      message: "Device logged out and removed successfully",
    });
  } catch (error) {
    console.error("Error in fetchDeviceLogout:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteContinue = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await userModel.findOne({ continue: id });
    await WatchingModel.findOneAndDelete({ _id: id });

    if (user) {
      user.continue = user.continue.filter(
        (movieId) => movieId.toString() !== id
      );

      await user.save();

      res.status(200).json({ message: "deleted", success: true });
    } else {
      console.log("User not found");
    }

    console.log("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const deleteMovieById = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await userModel.findOne({ watchlist: id });
    await watchModel.findOneAndDelete({ _id: id });

    if (user) {
      user.watchlist = user.watchlist.filter(
        (movieId) => movieId.toString() !== id
      );

      await user.save();

      res.status(200).json({ message: "deleted", success: true });
    } else {
      console.log("User not found");
    }

    console.log("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  watch,
  deleteMovieById,
  Device,
  like,
  deleteLikeById,
  ContinueWatching,
  deleteContinue,
  fetchDeviceDetails,
  fetchDeviceLogout,
  UserRecommendations,
};
