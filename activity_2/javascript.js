// Reference to the input and results div
const animeInput = document.getElementById("animeInput");
const resultsDiv = document.getElementById("results");

// Function to display search results
const displayResults = (data) => {
  resultsDiv.innerHTML = "";
  if (!data.data || data.data.length === 0) {
    resultsDiv.innerHTML = "No Result";
    return;
  }
  if (!data.data) {
    console.error("Unexpected API response:", data);
    return;
  }

  data.data.forEach((anime) => {
    // Extracting title from URL
    let title = anime.url.split("/anime/")[1].split("/")[1].replace(/_/g, " ");

    // Extract the image URL
    let imageUrl;
    if (anime.images && anime.images.medium) {
      imageUrl = anime.images.medium;
    } else {
      imageUrl = "path_to_default_image.jpg"; // fallback to a default image if not present
    }

    // Create elements for display
    const animeDiv = document.createElement("div");

    const animeTitle = document.createElement("h2");
    animeTitle.innerText = title;

    // const animeImage = document.createElement("img");
    // animeImage.src = imageUrl;

    animeDiv.appendChild(animeTitle);
    // animeDiv.appendChild(animeImage);

    resultsDiv.appendChild(animeDiv);
  });
};
document.getElementById("searchBtn").addEventListener("click", function () {
  const animeName = document.getElementById("animeInput").value.trim();
  const genre = document.getElementById("genreSelect").value;
  const type = document.getElementById("typeSelect").value;
  const year = document.getElementById("yearInput").value;
  const rating = document.getElementById("ratingSelect").value;
  const status = document.getElementById("statusSelect").value;
  const country = document.getElementById("countrySelect").value;
  const season = document.getElementById("seasonSelect").value;

  const baseURL = "https://api.jikan.moe/v4/anime?";
  let queryParams = [];

  if (animeName) queryParams.push(`q=${animeName}`);
  if (genre) queryParams.push(`genres=${genre}`);
  if (type) queryParams.push(`type=${type}`);
  if (year) queryParams.push(`year=${year}`);
  if (rating) queryParams.push(`rating=${rating}`);
  if (status) queryParams.push(`status=${status}`);
  if (country) queryParams.push(`country=${country}`);
  if (season) queryParams.push(`season=${season}`);

  const finalURL = baseURL + queryParams.join("&");

  fetch(finalURL)
    .then((res) => res.json())
    .then((data) => {
      displayResults(data);
    })
    .catch((error) => console.log(error));
});
