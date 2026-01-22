const router = require("express").Router();

const {
  search,
  anime,
  movies,
  trending,
  series,
  upcomingseries,
  upcomingmovies,
  recommendations,
  similar,
  topratedmovies,
  trailer,
  download,
  credits,
  person,
  combinedcredits,
  actors,
  animeEpisodes,
  TrendingAnime,
  searchAnime,
  singleMovie,
  singleSeries,
  seasonEpisodes,
} = require("../Controllers/MovieController");

router.get("/search", search);

router.get("/movies", movies);

router.get("/anime", anime);
router.get("/trending", trending);
router.get("/single/movie", singleMovie);
router.get("/season/episodes", seasonEpisodes);
router.get("/single/series", singleSeries);

router.get("/trendinganime", TrendingAnime);

router.get("/series", series);

router.get("/upcomingseries", upcomingseries);
router.get("/upcomingmovies", upcomingmovies);

router.get("/recommendations", recommendations);

router.get("/similar", similar);

router.get("/topratedmovies", topratedmovies);
router.get("/person", person);
router.get("/combinedcredits", combinedcredits);
router.get("/actors", actors);

router.get("/trailer", trailer);

router.get("/download/movie", download);

router.get("/credits", credits);

router.get("/episode", animeEpisodes);

router.get("/search/anime", searchAnime);

module.exports = router;
