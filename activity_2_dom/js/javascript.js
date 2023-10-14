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
    this.elements.searchBtn.addEventListener("click", this.search.bind(this));
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
      this.elements.prevBtn.style.display = "none"; // Hide prev button
      this.elements.nextBtn.style.display = "none"; // Hide next button
      return;
    }
    data.data.forEach((anime) => {
      const animeCard = this.createAnimeCard(anime);
      this.elements.resultsDiv.appendChild(animeCard);
    });
  }

  search(appendMode = false) {
    this.appendMode = appendMode;
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
    img.src = anime.images.jpg.large_image_url;
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

    animeDiv.addEventListener('click', () => {
      this.openModal(anime);
    });
    return animeDiv;
}
openModal(anime) {
  const modal = document.getElementById('animeModal');
  const animeInfoBtn = document.getElementById('animeInfoBtn');
  const trailerBtn = document.getElementById('trailerBtn');
  
  modal.style.display = "block";

  animeInfoBtn.onclick = () => {
    window.open(`https://myanimelist.net/anime/${anime.mal_id}`, "_blank");
  }

  trailerBtn.onclick = () => {
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/videos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data && data.data.promo) {
                // Get the first promo's trailer URL
                const trailer = data.data.promo[0]?.trailer;

                if (trailer && trailer.url) {
                    window.open(trailer.url, "_blank");
                } else {
                    alert("Trailer not available for this anime.");
                }
            } else {
                alert("No videos available for this anime.");
            }
        })
        .catch(error => {
            console.error("Error fetching trailer:", error);
        });
}
  const closeModal = document.getElementsByClassName("close-btn")[0];
  closeModal.onclick = () => {
    modal.style.display = "none";
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
}
    displayResults(data) {
        // Clear the results div if appendMode is not set.
        if (!this.appendMode) {
            this.elements.resultsDiv.innerHTML = "";
        }

        // Display "No Result" if no data is available.
        if (!data.data || data.data.length === 0) {
            this.elements.resultsDiv.innerHTML = "No Result";
            this.elements.prevBtn.style.display = "none"; // Hide prev button
            this.elements.nextBtn.style.display = "none"; // Hide next button
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
        // Clear the results div if appendMode is not set.
        if (!this.appendMode) {
            this.elements.resultsDiv.innerHTML = "";
        }
        this.updatePageDisplay();
        data.data.forEach((anime) => {
            const animeCard = this.createAnimeCard(anime);
            this.elements.resultsDiv.appendChild(animeCard);
        });
      }

  getSearchURL() {
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
      this.elements.seasonSelect.value &&
        `season=${this.elements.seasonSelect.value}`,
    ]
      .filter(Boolean)
      .concat(`page=${this.currentPage}`)
      .join("&");

    return `https://api.jikan.moe/v4/anime?${params}`;
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const animeSearcher = new AnimeSearcher();

  // Filter Script
  document.getElementById('filterIcon').addEventListener('click', function() {
      let filters = document.getElementById('filterSection'); 
      if (filters.style.display === 'none' || filters.style.display === '') {
          filters.style.display = 'block';
      } else {
          filters.style.display = 'none';
      }
  });
});
