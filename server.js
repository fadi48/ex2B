/**
 * Main file for the Movie API
 * Sujod Hagazi - 212150569
 * Fadi Shaer - 324992874
 * Tarek Jarjoura - 212771984
 * date: 17/06/2025
 * GitHub:
 */

// Import important libraries
// Express - library for building web servers in Node.js
const express = require("express");
// Path - helps work with file paths
const path = require("path");
// SQLite3 - library for connecting to a local database
const sqlite3 = require("sqlite3").verbose();
// FS - library for reading and writing files
const fs = require("fs");

// Create Express application
const app = express();

// Connect to the database
const database = new sqlite3.Database(path.join(__dirname, "db", "rtfilms.db"));

// Set up public directories
app.use(express.static(path.join(__dirname, "public"))); // Path to public files like CSS and images

// Serve the HTML file instead of using EJS
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "movie.html"));
});

// API endpoint to get movie data
app.get("/api/movie", async (req, res) => {
  let movie_code = req.query.title; // Get movie ID from the request

  // Fetch data about the movie and its reviews
  const movieData = createQuery("SELECT * FROM films WHERE FilmCode = ?", [
    movie_code,
  ]);
  const additionalData = createQuery(
    "SELECT * FROM FilmDetails WHERE FilmCode = ?",
    [movie_code]
  );
  const userReviews = createQuery("SELECT * FROM Reviews WHERE FilmCode = ?", [
    movie_code,
  ]);

  // Wait for all queries to complete before continuing
  const [movie, details, reviews] = await Promise.all([
    movieData,
    additionalData,
    userReviews,
  ]);

  // Check if a movie with the given code was found
  const selectedMovie = movie[0];
  if (!selectedMovie) return res.status(404).json({ error: "Movie not found" });

  // Check if the movie has an image
  const imagePath = path.join(__dirname, "public", selectedMovie.FilmCode);
  if (fs.existsSync(imagePath)) {
    const images = fs.readdirSync(imagePath);
    const poster = images.find((file) => file.match(/\.(png|jpg)$/i));
    if (poster) selectedMovie.Poster = `/${selectedMovie.FilmCode}/${poster}`;
  }

  // Send the data as JSON
  res.json({ movie: selectedMovie, details, reviews });
});

// General function for executing queries on the database
const createQuery = (sql, params = []) => {
  return new Promise((resolve) => {
    database.all(sql, params, (error, results) => {
      resolve(results); // If no errors, return the data
    });
  });
};

// Start the server on port 3000
app.listen(3000, () => console.log("http://localhost:3000"));
