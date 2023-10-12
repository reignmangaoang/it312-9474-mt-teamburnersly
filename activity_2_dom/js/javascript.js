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
    this.elements.loadMoreBtn = document.getElementById("loadMoreBtn");
    this.elements.loadMoreBtn.addEventListener(
      "click",
      this.loadMore.bind(this)
    );

    this.elements.searchBtn.addEventListener("click", this.search.bind(this));
  }
  loadMore() {
    // Store a reference to the last anime card before new data is loaded
    const lastAnimeCard = this.elements.resultsDiv.lastElementChild;

    this.currentPage++;
    this.search(true);

    // Once new data is loaded, scroll to the last anime card from before
    this.elements.resultsDiv.addEventListener(
      "DOMNodeInserted",
      (event) => {
        window.scrollTo({
          top: lastAnimeCard.getBoundingClientRect().bottom + window.scrollY,
          behavior: "smooth",
        });
      },
      { once: true }
    );
  }
  appendResults(data) {
    if (!data.data || data.data.length === 0) {
      this.elements.loadMoreBtn.style.display = "none"; // If no data, hide the "Load More" button
      return;
    }

    data.data.forEach((anime) => {
      const animeCard = this.createAnimeCard(anime);
      this.elements.resultsDiv.appendChild(animeCard);
    });
  }

  search(appendMode = false) {
    this.appendMode = appendMode;

    fetch(this.getSearchURL())
      .then((res) => res.json())
      .then((data) => {
        this.displayResults(data);
      })
      .catch((error) => console.log(error));
  }

  createAnimeCard(anime) {
    const animeDiv = document.createElement("div");
    animeDiv.classList.add("anime-container");

    // Displaying the title
    const title = document.createElement("h2");
    title.innerText = anime.title || "Unknown Title";
    animeDiv.appendChild(title);

    // Displaying the image
    const img = document.createElement("img");
    img.src = anime.images.jpg.large_image_url;
    img.alt = `Image of ${anime.title}`;
    img.onerror = function () {
      this.onerror = null;
      this.src = "path_to_fallback_image.jpg";
    };
    animeDiv.appendChild(img);

    // Displaying all other details (as an example, add more as required)
    const synopsis = document.createElement("p");
    synopsis.innerText = anime.synopsis || "No synopsis available.";
    animeDiv.appendChild(synopsis);

    return animeDiv;
  }

  displayResults(data) {
    // If the 'appendMode' is not set, then clear the results div.
    if (!this.appendMode) {
      this.elements.resultsDiv.innerHTML = "";
    }

    // Check if there are results
    if (!data.data || data.data.length === 0) {
      this.elements.resultsDiv.innerHTML = "No Result";
      this.elements.loadMoreBtn.style.display = "none";
      return;
    } else {
      // If there are results, show the "Load More" button
      this.elements.loadMoreBtn.style.display = "block";
    }

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
  setupInfiniteScroll() {
    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        // 50 is a threshold, adjust if needed
        this.currentPage++;
        this.search();
      }
    });
  }
  search() {
    fetch(this.getSearchURL())
      .then((res) => res.json())
      .then((data) => {
        this.displayResults(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }
}

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
