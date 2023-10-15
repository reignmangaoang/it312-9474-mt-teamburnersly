class AnimeSearcher {
  constructor() {
    this.elements = {
        animeInput: document.getElementById("animeInput"),
        genreSelect: document.getElementById("genreSelect"),
        typeSelect: document.getElementById("typeSelect"),
        yearInput: document.getElementById("yearInput"),
        ratingSelect: document.getElementById("ratingSelect"),
        statusSelect: document.getElementById("statusSelect"),
        countrySelect: document.getElementById("countrySelect"),
        seasonSelect: document.getElementById("seasonSelect"),
        resultsDiv: document.getElementById("results"),
        searchBtn: document.getElementById("searchBtn"),
        trendingDiv :document.getElementById("trendingAnime"),
        updatedDiv: document.getElementById("recentlyUpdatedAnime"),
        trendingHeader: document.getElementById("trendingHeader"),
        updatedHeader: document.getElementById("updatedHeader")
    };
    this.elements.trendingHeader = document.querySelector(".trendingHeader");
    this.elements.updatedHeader = document.querySelector(".updatedHeader");
    console.log("Trending Header:", this.elements.trendingHeader);
    console.log("Updated Header:", this.elements.updatedHeader);
    this.currentPage = 1;
    this.updatePageDisplay();
    this.elements.prevBtn = document.getElementById("prevBtn");
    this.elements.nextBtn = document.getElementById("nextBtn");
    this.elements.prevBtn.addEventListener("click", this.prevPage.bind(this));
    this.elements.nextBtn.addEventListener("click", this.nextPage.bind(this));
    this.elements.searchBtn.addEventListener('click', () => {
      console.log("Inside event listener - Trending Header:", this.elements.trendingHeader);
      console.log("Inside event listener - Updated Header:", this.elements.updatedHeader);
      this.elements.resultsDiv.innerHTML = ''; // Clear previous results
      if (this.elements.animeInput.value.trim() !== '') {
          this.elements.trendingDiv.style.display = 'none';
          this.elements.updatedDiv.style.display = 'none';
          this.elements.trendingHeader.style.display = 'none'; 
          this.elements.updatedHeader.style.display = 'none';
          this.search();
      } else {
          // If search input is cleared, display trending and updated sections again
          this.elements.trendingDiv.style.display = 'block';
          this.elements.updatedDiv.style.display = 'block';
          this.elements.h2.trendingHeader.style.display = 'block'; 
          this.elements.h2.updatedHeader.style.display = 'block'; 
      }
  });
    }
  displayError(message) {
      this.elements.resultsDiv.innerHTML = `<div class="error-message">${message}</div>`;
  }

  prevPage() {
      if (this.currentPage > 1) {
          this.currentPage--;
          this.search();
      }
  }

  nextPage() {
      this.currentPage++;
      this.search();
  }

  updatePageDisplay() {
      const displayElem = document.getElementById("currentPageDisplay");
      if (displayElem) {
          displayElem.textContent = this.currentPage;
      }
  }

  appendResults(data) {
      if (!data.data || data.data.length === 0) {
          this.elements.resultsDiv.innerHTML = "No Result";
          this.elements.prevBtn.style.display = "none";
          this.elements.nextBtn.style.display = "none";
          return;
      }
      data.data.forEach((anime) => {
          const animeCard = this.createAnimeCard(anime);
          this.elements.resultsDiv.appendChild(animeCard);
      });
  }

  search(appendMode = false) {
      this.appendMode = appendMode;
      if (appendMode) {
          this.currentPage = 1;
          this.updatePageDisplay();
      }

      fetch(this.getSearchURL())
          .then((res) => {
              if (!res.ok) {
                  throw new Error("Failed to fetch anime data.");
              }
              return res.json();
          })
          .then((data) => {
              this.displayResults(data);
          })
          .catch((error) => {
              this.displayError("Failed to fetch anime data. Please try again later.");
              console.error("Error in search:", error);
          });
  }

  openModal(anime) {
      const modal = document.getElementById("animeModal");
      const animeImage = document.getElementById("animeImage");
      const animeTitle = document.getElementById("animeTitle");
      const animeDescription = document.getElementById("animeDescription");
      const animeType = document.getElementById("animeType");
      const animeGenre = document.getElementById("animeGenre");
      const animeReleaseYear = document.getElementById("animeReleaseYear");
      const animeStatus = document.getElementById("animeStatus");
      const animeInfoBtn = document.getElementById("animeInfoBtn");
      const trailerBtn = document.getElementById("trailerBtn");
      console.log("Opening modal for anime:", anime.mal_id);
      animeImage.src = anime.images.jpg.large_image_url || "";
      animeTitle.textContent = anime.title || "Unknown Title";
      animeDescription.textContent = anime.synopsis || "Description not available.";
      animeType.textContent = `Type: ${anime.type || "Unknown"}`;
      animeGenre.textContent = `Genre: ${anime.genres.map((genre) => genre.name).join(", ") || "Unknown"}`;
      animeReleaseYear.textContent = `Released: ${new Date(anime.aired.from).getFullYear() || "Unknown"}`;
      animeStatus.textContent = `Status: ${anime.status || "Unknown"}`;

      fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/statistics`)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then((statsData) => {
              console.log("Received statsData:", statsData);
              this.updateModalWithStatistics(statsData);
          })
          .catch((error) => {
              console.error("Error fetching statistics:", error);
              if (error.message.includes("429")) {
                  console.warn("You've hit the rate limit for the Jikan API.");
              }
          });

      modal.style.display = "block";

      animeInfoBtn.onclick = () => {
          window.open(`https://myanimelist.net/anime/${anime.mal_id}`, "_blank");
      };

      trailerBtn.onclick = () => {
          fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/videos`)
              .then((response) => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
              })
              .then((data) => {
                  if (data && data.data && data.data.promo) {
                      const trailer = data.data.promo[0]?.trailer;
                      if (trailer && trailer.url) {
                          this.openTrailerModal(trailer.url);
                      } else {
                          alert("This anime doesn't have a recorded Official Trailer.");
                      }
                  } else {
                      alert("No videos available for this anime.");
                  }
              })
              .catch((error) => {
                  console.error("Error fetching trailer:", error);
              });
      };

      const closeModal = document.getElementsByClassName("close-btn")[0];
      closeModal.onclick = () => {
          modal.style.display = "none";
      };
      window.onclick = (event) => {
          if (event.target === modal) {
              modal.style.display = "none";
          }
      };
      const closeAnimeModal = document.getElementById("closeAnimeModal");
      closeAnimeModal.onclick = () => {
          document.getElementById("animeModal").style.display = "none";
      };

      window.onclick = (event) => {
          if (event.target === document.getElementById("animeModal")) {
              document.getElementById("animeModal").style.display = "none";
          } else if (event.target === document.getElementById("trailerModal")) {
              document.getElementById("trailerModal").style.display = "none";
          }
      };
  }

  updateModalWithStatistics(statsData) {
      const watching = document.getElementById("animeWatching");
      const completed = document.getElementById("animeCompleted");
      const onHold = document.getElementById("animeOnHold");
      const dropped = document.getElementById("animeDropped");
      const planToWatch = document.getElementById("animePlanToWatch");

      const stats = statsData.data || {};

      watching.textContent = `Watching: ${stats.watching || "N/A"}`;
      completed.textContent = `Completed: ${stats.completed || "N/A"}`;
      onHold.textContent = `On Hold: ${stats.on_hold || "N/A"}`;
      dropped.textContent = `Dropped: ${stats.dropped || "N/A"}`;
      planToWatch.textContent = `Plan to Watch: ${stats.plan_to_watch || "N/A"}`;
  }

  openTrailerModal(url) {
      const trailerModal = document.getElementById("trailerModal");
      const trailerFrame = document.getElementById("trailerFrame");

      if (url.includes("youtube.com/watch?v=")) {
          url = url.replace("youtube.com/watch?v=", "youtube.com/embed/");
      }

      trailerFrame.src = url;
      trailerModal.style.display = "block";

      const closeTrailerModal = document.getElementById("closeTrailerModal");
      closeTrailerModal.onclick = () => {
          trailerModal.style.display = "none";
      };
      window.onclick = (event) => {
          if (event.target === trailerModal) {
              trailerModal.style.display = "none";
          }
      };
  }

  displayResults(data) {
      if (!this.appendMode) {
          this.elements.resultsDiv.innerHTML = "";
      }

      if (!data.data || data.data.length === 0) {
          this.elements.resultsDiv.innerHTML = "No Result";
          this.elements.prevBtn.style.display = "none";
          this.elements.nextBtn.style.display = "none";
          return;
      }

      if (this.currentPage === 1) {
          this.elements.prevBtn.style.display = "none";
      } else {
          this.elements.prevBtn.style.display = "block";
      }

      if (data.data.length < 10) {
          this.elements.nextBtn.style.display = "none";
      } else {
          this.elements.nextBtn.style.display = "block";
      }

      this.updatePageDisplay();
      data.data.forEach((anime) => {
          const animeCard = this.createAnimeCard(anime);
          this.elements.resultsDiv.appendChild(animeCard);
      });
  }

  getSearchURL() {
      const paramsList = [
          this.elements.animeInput.value.trim() && `q=${this.elements.animeInput.value.trim()}`,
          this.elements.genreSelect.value && `genres=${this.elements.genreSelect.value}`,
          this.elements.typeSelect.value && `type=${this.elements.typeSelect.value}`,
          this.elements.yearInput.value && `year=${this.elements.yearInput.value}`,
          this.elements.ratingSelect.value && `rating=${this.elements.ratingSelect.value}`,
          this.elements.statusSelect.value && `status=${this.elements.statusSelect.value}`,
          this.elements.countrySelect.value && `country=${this.elements.countrySelect.value}`,
      ];

      const validParams = paramsList.filter(Boolean);
      validParams.push(`page=${this.currentPage}`);
      return `https://api.jikan.moe/v4/anime?${validParams.join("&")}`;
  }

  createAnimeCard(anime) {
      const animeDiv = document.createElement("div");
      animeDiv.classList.add("anime-card");
      const img = document.createElement("img");
      img.src = anime.images && anime.images.jpg && anime.images.jpg.image_url
          ? anime.images.jpg.image_url : "path_to_fallback_image.jpg";
      img.alt = `Image of ${anime.title}`;
      img.onerror = function () {
          this.onerror = null;
          this.src = "path_to_fallback_image.jpg";
      };
      animeDiv.appendChild(img);
      const title = document.createElement("div");
      title.classList.add("anime-title");
      title.innerText = anime.title || "Unknown Title";
      animeDiv.appendChild(title);
      animeDiv.addEventListener("click", () => {
          this.openModal(anime);
      });
      return animeDiv;
      
  }
}

const animeSearcher = new AnimeSearcher();

function openModal (anime) {
  const modal = document.getElementById("animeModal");
  const animeImage = document.getElementById("animeImage");
  const animeTitle = document.getElementById("animeTitle");
  const animeDescription = document.getElementById("animeDescription");
  const animeType = document.getElementById("animeType");
  const animeGenre = document.getElementById("animeGenre");
  const animeReleaseYear = document.getElementById("animeReleaseYear");
  const animeStatus = document.getElementById("animeStatus");
  const animeInfoBtn = document.getElementById("animeInfoBtn");
  const trailerBtn = document.getElementById("trailerBtn");
  console.log("Opening modal for anime:", anime.mal_id);
  animeImage.src = anime.images.jpg.large_image_url || "";
  animeTitle.textContent = anime.title || "Unknown Title";
  animeDescription.textContent = anime.synopsis || "Description not available.";
  animeType.textContent = `Type: ${anime.type || "Unknown"}`;
  animeGenre.textContent = `Genre: ${anime.genres.map((genre) => genre.name).join(", ") || "Unknown"}`;
  animeReleaseYear.textContent = `Released: ${new Date(anime.aired.from).getFullYear() || "Unknown"}`;
  animeStatus.textContent = `Status: ${anime.status || "Unknown"}`;

  fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/statistics`)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then((statsData) => {
          console.log("Received statsData:", statsData);
          this.updateModalWithStatistics(statsData);
      })
      .catch((error) => {
          console.error("Error fetching statistics:", error);
          if (error.message.includes("429")) {
              console.warn("You've hit the rate limit for the Jikan API.");
          }
      });

  modal.style.display = "block";

  animeInfoBtn.onclick = () => {
      window.open(`https://myanimelist.net/anime/${anime.mal_id}`, "_blank");
  };

  trailerBtn.onclick = () => {
      fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/videos`)
          .then((response) => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then((data) => {
              if (data && data.data && data.data.promo) {
                  const trailer = data.data.promo[0]?.trailer;
                  if (trailer && trailer.url) {
                      this.openTrailerModal(trailer.url);
                  } else {
                      alert("This anime doesn't have a recorded Official Trailer.");
                  }
              } else {
                  alert("No videos available for this anime.");
              }
          })
          .catch((error) => {
              console.error("Error fetching trailer:", error);
          });
  };

  const closeModal = document.getElementsByClassName("close-btn")[0];
  closeModal.onclick = () => {
      modal.style.display = "none";
  };
  window.onclick = (event) => {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  };
  const closeAnimeModal = document.getElementById("closeAnimeModal");
  closeAnimeModal.onclick = () => {
      document.getElementById("animeModal").style.display = "none";
  };

  window.onclick = (event) => {
      if (event.target === document.getElementById("animeModal")) {
          document.getElementById("animeModal").style.display = "none";
      } else if (event.target === document.getElementById("trailerModal")) {
          document.getElementById("trailerModal").style.display = "none";
      }
  };
}

function updateModalWithStatistics(statsData) {
  const watching = document.getElementById("animeWatching");
  const completed = document.getElementById("animeCompleted");
  const onHold = document.getElementById("animeOnHold");
  const dropped = document.getElementById("animeDropped");
  const planToWatch = document.getElementById("animePlanToWatch");

  const stats = statsData.data || {};

  watching.textContent = `Watching: ${stats.watching || "N/A"}`;
  completed.textContent = `Completed: ${stats.completed || "N/A"}`;
  onHold.textContent = `On Hold: ${stats.on_hold || "N/A"}`;
  dropped.textContent = `Dropped: ${stats.dropped || "N/A"}`;
  planToWatch.textContent = `Plan to Watch: ${stats.plan_to_watch || "N/A"}`;
}

function openTrailerModal(url) {
  const trailerModal = document.getElementById("trailerModal");
  const trailerFrame = document.getElementById("trailerFrame");

  if (url.includes("youtube.com/watch?v=")) {
      url = url.replace("youtube.com/watch?v=", "youtube.com/embed/");
  }

  trailerFrame.src = url;
  trailerModal.style.display = "block";

  const closeTrailerModal = document.getElementById("closeTrailerModal");
  closeTrailerModal.onclick = () => {
      trailerModal.style.display = "none";
  };
  window.onclick = (event) => {
      if (event.target === trailerModal) {
          trailerModal.style.display = "none";
      }
  };
}

function displayResults(data) {
  if (!this.appendMode) {
      this.elements.resultsDiv.innerHTML = "";
  }

  if (!data.data || data.data.length === 0) {
      this.elements.resultsDiv.innerHTML = "No Result";
      this.elements.prevBtn.style.display = "none";
      this.elements.nextBtn.style.display = "none";
      return;
  }

  if (this.currentPage === 1) {
      this.elements.prevBtn.style.display = "none";
  } else {
      this.elements.prevBtn.style.display = "block";
  }

  if (data.data.length < 10) {
      this.elements.nextBtn.style.display = "none";
  } else {
      this.elements.nextBtn.style.display = "block";
  }

  this.updatePageDisplay();
  data.data.forEach((anime) => {
      const animeCard = this.createAnimeCard(anime);
      this.elements.resultsDiv.appendChild(animeCard);
  });
}
function createCard(anime) {
  const animeDiv = document.createElement("div");
  animeDiv.classList.add("anime-card");
  const img = document.createElement("img");
  img.src = anime.images && anime.images.jpg && anime.images.jpg.image_url
      ? anime.images.jpg.image_url : "path_to_fallback_image.jpg";
  img.alt = `Image of ${anime.title}`;
  img.onerror = function () {
      this.onerror = null;
      this.src = "path_to_fallback_image.jpg";
  };
  animeDiv.appendChild(img);
  const title = document.createElement("div");
  title.classList.add("anime-title");
  title.innerText = anime.title || "Unknown Title";
  animeDiv.appendChild(title);
  animeDiv.addEventListener("click", () => {
      this.openModal(anime);
  });
  return animeDiv;
}

function fetchTrending() {
  fetch('https://api.jikan.moe/v4/top/anime?page=1')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch trending anime.');
          }
          return response.json();
      })
      .then(data => {
          addAnimeToDom(data.data, trendingAnime);
      })
      .catch(error => {
          trendingAnime.innerHTML = `<p class="error-message">${error.message}</p>`;
      });
}

function fetchRecentlyUpdated() {
  fetch('https://api.jikan.moe/v4/seasons/now')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch recently updated anime.');
          }
          return response.json();
      })
      .then(data => {
          addAnimeToDom(data.data, recentlyUpdatedAnime);
      })
      .catch(error => {
          recentlyUpdatedAnime.innerHTML = `<p class="error-message">${error.message}</p>`;
      });
}
const trendingAnime = document.getElementById('trendingAnime');
const recentlyUpdatedAnime = document.getElementById('recentlyUpdatedAnime');

// Define the addAnimeToDom function
function addAnimeToDom(animeData, domElement) {
    animeData.forEach(anime => {
        const animeCard = createCard(anime, 'anime-card-class'); // Adjust the class name as needed
        domElement.appendChild(animeCard);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  fetchTrending();
  fetchRecentlyUpdated();
  document.getElementById("filterIcon").addEventListener("click", function () {
      let filters = document.getElementById("filterSection");
      if (filters.style.display === "none" || filters.style.display === "") {
          filters.style.display = "block";
      } else {
          filters.style.display = "none";
      }
  });
});
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateFooter() {
    if (isElementInViewport(document.querySelector('footer'))) {
        document.querySelector('.footer-logo').style.opacity = '1';
        document.querySelector('.footer-logo').style.transform = 'translateY(0)';
      
        document.querySelector('.footer-disclaimer').style.opacity = '1';
        document.querySelector('.footer-disclaimer').style.transform = 'translateX(0)';
      
        document.querySelector('.footer-manga-btn').style.opacity = '1';
        document.querySelector('.footer-manga-btn').style.transform = 'translateX(0)';
      
        document.querySelector('.footer-copyright').style.opacity = '1';
        document.querySelector('.footer-copyright').style.transform = 'translateY(0)';
        
        // Remove the scroll event listener once the animation is triggered
        window.removeEventListener('scroll', animateFooter);
    }
}

// Add scroll event listener
window.addEventListener('scroll', animateFooter);