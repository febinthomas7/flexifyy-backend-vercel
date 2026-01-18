const axios = require("axios");
const api_key = process.env.API_KEY;

const search = (req, res) => {
  const query = req.query.search;
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=true&with_genres=${
      req.query.genreid || "18"
    }&with_original_language=${req.query.lang || "en"}&with_origin_country=${
      req.query.country || "US"
    }&page=1&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const searchAnime = (req, res) => {
  const query = req.query.search;
  const options = {
    method: "GET",
    url: `https://vidapi.xyz/ani-api/search?q=${query}&page=1`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
const movies = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/movie?include_adult=true&with_genres=${
      req.query.genreid || "18"
    }&include_video=false&with_original_language=${
      req.query.lang || "en"
    }&page=${req.query.page || "1"}&with_origin_country=${
      req.query.country || "US"
    }&sort_by=popularity.desc&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const trending = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/trending/all/day?include_adult=true&with_genres=18&with_original_language=en&with_origin_country=US&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const TrendingAnime = (req, res) => {
  const options = {
    method: "GET",
    url: `https://vidapi.xyz/ani-api/top`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const series = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&with_genres=${
      req.query.genreid || "18"
    }&with_original_language=${req.query.lang || "en"}&with_origin_country=${
      req.query.country || "US"
    }&page=${req.query.page || "1"}&sort_by=popularity.desc&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const anime = (req, res) => {
  const options = {
    method: "GET",
    url: `https://vidapi.xyz/ani-api/new?page=${req.query.page || "1"}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const animeEpisodes = (req, res) => {
  const options = {
    method: "GET",
    url: `https://vidapi.xyz/ani-api/episodes?url=${req.query.id}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const upcomingseries = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const upcomingmovies = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/upcoming?page=1&with_genres=18&with_original_language=en&with_origin_country=US&page=1&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const recommendations = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${req.query.mode}/${req.query.id}/recommendations?language=en-US&page=1&sort_by=popularity.desc&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const similar = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${req.query.mode}/${req.query.id}/similar?language=en-US&page=1&sort_by=popularity.desc&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const topratedmovies = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/top_rated?with_genres=18&with_original_language=en&with_origin_country=US&page=1&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const person = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/person/${req.query.id}?language=en-US&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error("error");
    });
};
const combinedcredits = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/person/${req.query.id}/combined_credits?language=en-US&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const actors = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/person/popular?language=en-US&page=${req.query.page}&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const trailer = (req, res) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${req.query.mode || "movie"}/${
      req.query.id
    }/videos?language=en-US&api_key=${api_key}`,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data.results);
    })
    .catch(function (error) {
      console.error("error");
    });
};

const download = async (req, res) => {
  const id = req.query.id;

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${api_key}`,
  };

  try {
    const firstResponse = await axios.request(options);
    const firstData = firstResponse.data?.imdb_id;

    const secondResponse = await axios.request(
      `https://yts.bz/api/v2/movie_details.json?imdb_id=${firstData}`,
    );
    const secondData = secondResponse.data.data.movie?.torrents;
    res.json(secondData);
  } catch (error) {
    console.error("Error download:");
  }
};

const credits = (req, res) => {
  const { id, mode } = req.query;

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${mode}/${
      id || "8859"
    }/credits?language=en-US&api_key=${api_key}`,
  };

  try {
    axios.request(options).then((response) => {
      res.json(response.data);
    });
  } catch (error) {
    res.json({ status: "404", error: error });
    console.error("Error:", error);
  }
};

module.exports = {
  search,
  movies,
  anime,
  TrendingAnime,
  trending,
  series,
  upcomingseries,
  upcomingmovies,
  recommendations,
  topratedmovies,
  similar,
  trailer,
  download,
  credits,
  person,
  combinedcredits,
  actors,
  animeEpisodes,
  searchAnime,
};
