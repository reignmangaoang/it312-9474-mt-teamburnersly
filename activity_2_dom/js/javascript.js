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
    };
    this.currentPage = 1; // initialize with page 1
    this.updatePageDisplay();
    this.elements.prevBtn = document.getElementById("prevBtn");
    this.elements.nextBtn = document.getElementById("nextBtn");
    this.elements.prevBtn.addEventListener("click", this.prevPage.bind(this));
    this.elements.nextBtn.addEventListener("click", this.nextPage.bind(this));
    this.elements.searchBtn.addEventListener("click", () => {
      this.elements.resultsDiv.innerHTML = "";
  
      // Clear and hide the trendingAnime and recentlyUpdatedAnime sections
      const trendingDiv = document.getElementById("trendingAnime");
      const updatedDiv = document.getElementById("recentlyUpdatedAnime");
      const trendingHeader = document.querySelector(".trending-header");
      const recentlyUpdatedHeader = document.querySelector(".recently-updated-header");
    
      trendingDiv.innerHTML = "";
      updatedDiv.innerHTML = "";
      trendingDiv.style.display = "none";
      updatedDiv.style.display = "none";
      trendingHeader.style.display = "none";
      recentlyUpdatedHeader.style.display = "none";
      
      this.search();
  });
  
  }
  prevPage() {
    console.log("Current Page before decrement:", this.currentPage);
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log("Going to Page:", this.currentPage);
      this.search();
    }
    console.log("Current Page after decrement:", this.currentPage);
  }
  nextPage() {
    console.log("Current Page before increment:", this.currentPage);
    this.currentPage++;
    this.search();
    console.log("Current Page after increment:", this.currentPage);
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
    console.log("Fetching data from:", this.getSearchURL());

    fetch(this.getSearchURL())
      .then((res) => res.json())
      .then((data) => {
        this.displayResults(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }

  createAnimeCard(anime) {
    const animeDiv = document.createElement("div");
    animeDiv.classList.add("anime-card");

    // Displaying the image
    const img = document.createElement("img");
    img.src = anime.images && anime.images.jpg && anime.images.jpg.image_url
    ? anime.images.jpg.image_url: "path_to_fallback_image.jpg";
    img.alt = `Image of ${anime.title}`;
    img.onerror = function () {
      this.onerror = null;
      this.src = "path_to_fallback_image.jpg";
    };
    animeDiv.appendChild(img);

    // Displaying the title
    const title = document.createElement("div");
    title.classList.add("anime-title");
    title.innerText = anime.title || "Unknown Title";
    animeDiv.appendChild(title);

    animeDiv.addEventListener("click", () => {
      this.openModal(anime);
    });
    return animeDiv;
}
openModal(anime) {
    const modal = document.getElementById("animeModal");
    const animeImage = document.getElementById("animeImage");
    const animeTitle = document.getElementById("animeTitle");
    const animeDescription = document.getElementById("animeDescription");
    const animeInfoBtn = document.getElementById("animeInfoBtn");
    const trailerBtn = document.getElementById("trailerBtn");

    // Update modal content based on clicked anime
    animeImage.src = anime.images.jpg.large_image_url || "";
    animeTitle.textContent = anime.title || "Unknown Title";
    animeDescription.textContent = anime.synopsis || "Description not available.";

    // Display the modal
    modal.style.display = "block";

    // On clicking the "More Info on MAL" button
    animeInfoBtn.onclick = () => {
      window.open(`https://myanimelist.net/anime/${anime.mal_id}`, "_blank");
    };

    // On clicking the "Watch Trailer" button
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
              alert("This anime doesn't have a recorded Offcial Trailer.");
            }
          } else {
            alert("No videos available for this anime.");
          }
        })
        .catch((error) => {
          console.error("Error fetching trailer:", error);
        });
    };

    // Close modal functionality
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

openTrailerModal(url) {
  const trailerModal = document.getElementById("trailerModal");
  const trailerFrame = document.getElementById("trailerFrame");
  

  if(url.includes("youtube.com/watch?v=")) {
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
      this.elements.resultsDiv.innerHTML = "No Result. :(";
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
    let year = this.elements.yearInput.value;
    const season = this.elements.seasonSelect.value;

    if (season && !year) {
      year = new Date().getFullYear();
    } else if (year && !season) {
      season = "spring";
    }
    else if (year && season) {
      return `https://api.jikan.moe/v4/seasons/${year}/${season.toLowerCase()}`;
    }

    const params = [
      this.elements.animeInput.value.trim() &&
        `q=${this.elements.animeInput.value.trim()}`,
      this.elements.genreSelect.value &&
        `genres=${this.elements.genreSelect.value}`,
      this.elements.typeSelect.value &&
        `type=${this.elements.typeSelect.value}`,
      this.elements.yearInput.value && `year=${this.elements.yearInput.value}`,
      this.elements.ratingSelect.value &&
        `rating=${this.elements.ratingSelect.value}`,
      this.elements.statusSelect.value &&
        `status=${this.elements.statusSelect.value}`,
      this.elements.countrySelect.value &&
        `country=${this.elements.countrySelect.value}`,
    ]
      .filter(Boolean)
      .concat(`page=${this.currentPage}`)
      .join("&");

    return `https://api.jikan.moe/v4/anime?${params}`;
  }
}
  function fetchTrending() {
    fetch('https://api.jikan.moe/v4/top/anime')  
        .then((res) => res.json())
        .then((data) => {
            console.log("Trending Data:", data);
  
            const trendingDiv = document.getElementById("trendingAnime");
  
            if (data && data.top) {  
                data.top.slice(0, 5).forEach((anime) => {
                    const animeCard = createAnimeCard(anime);
                    trendingDiv.appendChild(animeCard);
                });
            }
        })
        .catch((error) => console.log("Error fetching trending anime:", error));
  }
  
  function fetchRecentlyUpdated() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const seasons = ["winter", "spring", "summer", "fall"];
    const currentMonth = currentDate.getMonth();
    const currentSeason = seasons[Math.floor(currentMonth / 3)];
  
    fetch(`https://api.jikan.moe/v4/seasons/${currentYear}/${currentSeason}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Recently Updated Data:", data);
  
            const updatedDiv = document.getElementById("recentlyUpdatedAnime");
  
            if (data && data.anime) {
                data.anime.slice(0, 5).forEach((anime) => {
                    const animeCard = createAnimeCard(anime);
                    updatedDiv.appendChild(animeCard);
                });
            }
        })
        .catch((error) => console.log("Error fetching recently updated anime:", error));
  }
document.addEventListener("DOMContentLoaded", function () {
  const animeSearcher = new AnimeSearcher();

  // Fetching the trending and recently updated anime;
  fetchTrending();
  fetchRecentlyUpdated();

  // Filter Script
  document.getElementById("filterIcon").addEventListener("click", function () {
    let filters = document.getElementById("filterSection");
    if (filters.style.display === "none" || filters.style.display === "") {
      filters.style.display = "block";
    } else {
      filters.style.display = "none";
    }
  });
});