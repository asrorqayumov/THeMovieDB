import configs from "../config.js";
import moment from "../node_modules/moment/dist/moment.js";

const { API_KEY, BASE_URL, DEFAULT_IMG_URL, BASE_IMG_URL } = configs;

export async function getPopularFavMovies(page = 1) {
  try {
    const url = `${BASE_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchHandler() {
  const form = document.querySelector(".popularMovieSort");
  const formData = new FormData(form);
  const params = new URLSearchParams();
  for (let pair of formData.entries()) {
    params.append(pair[0], pair[1]);
  }
  // searchPopularMovieReq(params.toString()).then((data) => {
  //   displaySearchResult(data);
  // });
}
export async function displaySearchResult(data) {}

export function displayPopularFavMovies(data) {
  const { results } = data;
  const popularTvMovies = document.querySelector(".popular-tv-movies");
  let html = "";
  results.forEach((movie) => {
    const { title, poster_path, release_date, vote_average, id } = movie;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;

    html += `
    <div class="col">
      <card data-id=${id} class="card">
      <a href="#" class="card-img-btn">
        <img
          class="card-img img-fluid"
          src="${poster}"
          alt="something movie"
        />
      </a>
      <div class="card-img-overlay">
        <a class="threedot-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </a>
      </div>
      <div class="card-body">
        <div class="card-click">
          <ul>
            <li>
              <a href="#">
                <i class="fa-solid fa-list"></i>
                Add to list</a
              >
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-heart"></i>
                Favourite</a
              >
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-clipboard-list"></i>
                Watchlist
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-star"></i>
                Your rating</a
              >
            </li>
          </ul>
        </div>
        <div class="circle-progressbar">
          <div
            role="progressbar"
            style="--value: ${vote_average * 10}"
          ></div>
        </div>
        <a href="/detailsmovie.html?id=${id}" class="card-title">${title}</a>
        <p class="card-text">${moment(release_date).format("ll")}</p>
      </div>
      </card>
    </div>
    `;
    popularTvMovies.innerHTML = html;
  });
}

export function discoveryFilterHandler(query) {
  let url = `${BASE_URL}discover/movie?api_key=${API_KEY}`;
  for (const key in query) {
    if (query[key]) {
      url += `&${key}=${query[key]}`;
    }
  }
  return url;
}
export async function discoverPopularMovie(query) {
  const url = this.discoveryFilterHandler(query);
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export function sortMovies(data) {
  const { results } = data;
  const topMovies = document.querySelector(".top__movies");
  let html = "";
  results.forEach((movie) => {
    const { title, poster_path, release_date, vote_average, id } = movie;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;

    html += `
    <div class="col col-md-6 col-lg-4 col-xl-3">
      <card data-id=${id} class="card ">
      <a href="movie.html" class="card-img-btn">
        <img
          class="card-img img-fluid"
          src="${poster}"
          alt="something movie"
        />
      </a>
      <div class="card-img-overlay">
        <a class="threedot-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </a>
      </div>
      <div class="card-body">
        <div class="card-click">
          <ul>
            <li>
              <a href="#">
                <i class="fa-solid fa-list"></i>
                Add to list</a
              >
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-heart"></i>
                Favourite</a
              >
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-clipboard-list"></i>
                Watchlist
              </a>
            </li>
            <li>
              <a href="#">
                <i class="fa-solid fa-star"></i>
                Your rating</a
              >
            </li>
          </ul>
        </div>
        <div class="circle-progressbar">
          <div
            role="progressbar"
            style="--value: ${vote_average * 10}"
          ></div>
        </div>
        <a href="movie.html" class="card-title">${title}</a>
        <p class="card-text">${moment(release_date).format("ll")}</p>
      </div>
      </card>
      
      </div>
    `;
    topMovies.innerHTML = html;
  });
}

// **********************************    FILTER     ************************************//

export async function getGenres() {
  try {
    const url = `${BASE_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    const { genres } = data;
    return genres;
  } catch (error) {
    throw new Error(error);
  }
}

export function displayGenres(genres = [], document) {
  const genreWrapper = document.querySelector("#tags");
  let genreContents = "";
  genres.forEach((genre) => {
    const { id, name } = genre;
    genreContents += `<div class="form-check">
    <input
      type="checkbox"
      name="with_genres"
      value="${id}"
      class="btn-check"
      id="${id}"
      autocomplete="off"
    />
    <label class="btn btn-outline-primary btn-sm" for="${id}">${name}</label>
  </div>`;
    genreWrapper.innerHTML = genreContents;
  });
}

// **********************************    FILTER     ************************************//

export async function getFavMovie(movie_id) {
  try {
    const url = `${BASE_URL}movie/${movie_id}?api_key=${API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
