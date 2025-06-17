/**
 * Main file for the Movie Client
 * Sujod Hagazi - 212150569
 * Fadi Shaer - 324992874
 * Tarek Jarjoura - 212771984
 * date: 17/06/2025
 * GitHub:https://github.com/fadi48/ex2B
 */

// Get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Fetch movie data from the server
async function fetchMovieData() {
  const movieCode = getUrlParameter("title");
  if (!movieCode) {
    alert("No movie title specified");
    return;
  }

  try {
    const response = await fetch(`/api/movie?title=${movieCode}`);
    if (!response.ok) {
      throw new Error("Movie not found");
    }
    const data = await response.json();
    displayMovieData(data);
  } catch (error) {
    console.error("Error fetching movie data:", error);
    document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
  }
}

// Display movie data on the page
function displayMovieData(data) {
  const { movie, details, reviews } = data;

  // Set movie title and year
  document.getElementById(
    "movie-title"
  ).textContent = `${movie.Title} (${movie.Year})`;

  // Set movie poster
  document.getElementById("movie-poster").src = movie.Poster;

  // Set score
  const scoreImage = movie.Score >= 60 ? "freshbig.png" : "rottenbig.png";
  document.getElementById("score-image").src = scoreImage;
  document.getElementById("score-value").textContent = `${movie.Score}%`;

  // Populate movie details
  const detailsContainer = document.getElementById("movie-details");
  details.forEach((detail) => {
    const dt = document.createElement("dt");
    dt.textContent = detail.Attribute;

    const dd = document.createElement("dd");
    if (detail.Attribute === "Starring") {
      const actors = detail.Value.split(", ");
      actors.forEach((actor, index) => {
        dd.appendChild(document.createTextNode(actor));
        if (index < actors.length - 1) {
          dd.appendChild(document.createElement("br"));
        }
      });
    } else {
      dd.textContent = detail.Value;
    }

    detailsContainer.appendChild(dt);
    detailsContainer.appendChild(dd);
  });

  // Populate reviews
  const leftReviews = document.getElementById("left-reviews");
  const rightReviews = document.getElementById("right-reviews");

  reviews.forEach((review, index) => {
    const reviewElement = createReviewElement(review, movie.Score);
    if (index % 2 === 0) {
      leftReviews.appendChild(reviewElement);
    } else {
      rightReviews.appendChild(reviewElement);
    }
  });

  // Set review count
  document.getElementById(
    "review-count"
  ).textContent = `(1-${reviews.length}) of ${reviews.length}`;
}

// Create a review element
function createReviewElement(review, score) {
  const reviewDiv = document.createElement("div");
  reviewDiv.className = "review";

  const quoteP = document.createElement("p");
  quoteP.className = "review-quote";

  const img = document.createElement("img");
  img.src = score >= 60 ? "fresh.gif" : "rotten.gif";
  img.alt = "score";

  const quote = document.createElement("q");
  quote.textContent = review.ReviewText;

  quoteP.appendChild(img);
  quoteP.appendChild(quote);

  const criticP = document.createElement("p");
  criticP.className = "critic-info";

  const criticImg = document.createElement("img");
  criticImg.src = "critic.gif";
  criticImg.alt = "Critic";

  criticP.appendChild(criticImg);
  criticP.appendChild(document.createTextNode(review.ReviewerName));
  criticP.appendChild(document.createElement("br"));
  criticP.appendChild(document.createTextNode(review.Affiliation));

  reviewDiv.appendChild(quoteP);
  reviewDiv.appendChild(criticP);

  return reviewDiv;
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", fetchMovieData);
