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
    this.loadMoreBtn = document.getElementById("loadMoreBtn");
    this.loadMoreBtn.innerText = "Load More Result";
    this.loadMoreBtn.addEventListener("click", () => {
      this.currentPage++;
      this.search();
    });

    this.elements.searchBtn.addEventListener("click", this.search.bind(this));
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


    if (!data.data || data.data.length === 0) {
      if (this.currentPage === 1) {
        this.elements.resultsDiv.innerHTML = "No Result";
      }
      return;
    }

    data.data.forEach((anime) => {
      const animeCard = this.createAnimeCard(anime);
      this.elements.resultsDiv.appendChild(animeCard);
    });
    // Append the Load More button if it's not already there
    if (!this.elements.resultsDiv.contains(this.loadMoreBtn)) {
      this.elements.resultsDiv.appendChild(this.loadMoreBtn);
    }
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
