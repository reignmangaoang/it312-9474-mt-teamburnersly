class AnimeSearcher {
  constructor() {
    this.config = {
      animeInput: "animeInput",
      genreSelect: "genreSelect",
      typeSelect: "typeSelect",
      yearInput: "yearInput",
      ratingSelect: "ratingSelect",
      statusSelect: "statusSelect",
      countrySelect: "countrySelect",
      seasonSelect: "seasonSelect",
      resultsDiv: "results",
      searchBtn: "searchBtn",
    };

    for (let key in this.config) {
      this[key] = document.getElementById(this.config[key]);
    }

    this.searchBtn.addEventListener("click", this.search.bind(this));
  }

  createAnimeEntry(anime) {
    const animeDiv = document.createElement("div");
    animeDiv.classList.add("anime-container");

    const animeTitle = document.createElement("h2");
    animeTitle.innerText = anime.title || "Unknown Title";
    animeDiv.appendChild(animeTitle);


    return animeDiv;
  }

  displayResults(data) {
    this.resultsDiv.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      this.resultsDiv.innerHTML = "No Result";
      return;
    }

    data.data.forEach((anime) => {
      this.resultsDiv.appendChild(this.createAnimeEntry(anime));
    });


    
  }

  getURL() {
    const baseURL = "https://api.jikan.moe/v4/anime?";
    let queryParams = [
      this.animeInput.value.trim() && `q=${this.animeInput.value.trim()}`,
      this.genreSelect.value && `genres=${this.genreSelect.value}`,
      this.typeSelect.value && `type=${this.typeSelect.value}`,
      this.yearInput.value && `year=${this.yearInput.value}`,
      this.ratingSelect.value && `rating=${this.ratingSelect.value}`,
      this.statusSelect.value && `status=${this.statusSelect.value}`,
      this.countrySelect.value && `country=${this.countrySelect.value}`,
      this.seasonSelect.value && `season=${this.seasonSelect.value}`,
    ].filter(Boolean);
    console.log(baseURL + queryParams.join("&"));
    return baseURL + queryParams.join("&");
  }

  search() {
    fetch(this.getURL())
      .then((res) => res.json())
      .then((data) => {
        this.displayResults(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }
}

const searcher = new AnimeSearcher();
