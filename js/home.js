import configs from "../config.js";
import moment from "../node_modules/moment/dist/moment.js";
const { API_KEY, SESSION_ID, BASE_URL, DEFAULT_IMG_URL, BASE_IMG_URL } =
  configs;
import { fetchSearchMovie } from "./search.js";

export function searchMovieHandler(location, history) {
  const input = document.querySelector(".search__form");
  input.addEventListener("submit", (e) => {
    e.preventDefault();
    history.pushState({ query: input.query.value }, "search", "/search.html");
    location.assign("/search.html");
  });
}

export async function getAccaountTvState(page = 1) {
  let favUrl = `${BASE_URL}account/{account_id}/favorite/tv?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let watchUrl = `${BASE_URL}account/{account_id}/watchlist/tv?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let ratedUrl = `${BASE_URL}account/{account_id}/rated/tv?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let favRes = await fetch(favUrl);
  let watchRes = await fetch(watchUrl);
  let ratedRes = await fetch(ratedUrl);
  let favData = await favRes.json();
  let watchData = await watchRes.json();
  let ratedData = await ratedRes.json();
  let allData = { favData, watchData, ratedData };
  return allData;
}

export async function getAccountMovieState(page = 1) {
  let favUrl = `${BASE_URL}account/{account_id}/favorite/movie?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let watchUrl = `${BASE_URL}account/{account_id}/watchlist/movie?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let ratedUrl = `${BASE_URL}account/{account_id}/rated/movie?api_key=${API_KEY}&session_id=${SESSION_ID}&language=en-US&sort_by=created_at.asc&page=${page}`;
  let favRes = await fetch(favUrl);
  let watchRes = await fetch(watchUrl);
  let ratedRes = await fetch(ratedUrl);
  let favData = await favRes.json();
  let watchData = await watchRes.json();
  let ratedData = await ratedRes.json();
  let allData = { favData, watchData, ratedData };
  return allData;
}

export async function getPopularTVMovies(page = 1) {
  try {
    const url = `${BASE_URL}tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPopularTheatres(page = 2) {
  try {
    const url = `${BASE_URL}tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTopRated(page = 1) {
  try {
    const url = `${BASE_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPopularMovies(page = 1) {
  try {
    const url = `${BASE_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export function displayPopularTVMovies(data, allData) {
  let { favData, watchData, ratedData } = allData;
  let favDatas = favData.results;
  let watchDatas = watchData.results;
  let ratedDatas = ratedData.results;
  let isfav = function(data,id){
    for(let i=0;i<data.length;i++){
      if(data[i].id == id){
        return true;
      }
      else{
        return false;
      }
    }
  }
  const { results } = data;
  const popularONTvMovies = document.querySelector(".popular-ontv-movies");
  let html = "";
  results.forEach((OnTVmovie) => {
    const { name, poster_path, release_date, vote_average, id } = OnTVmovie;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;
    const fav = isfav(favDatas,id);
    const watch = isfav(watchDatas,id);
    console.log(fav);
    html += `
    <div class="col" data-category="tv">
                <card  data-id=${id} class="card">
                  <a href="movie.html" data-click="true" class="card-img-btn">
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
                    <div class="card-click" onclick="this.classList.toggle('on')">
                      <ul>
                        <li>
                          <button class="addlistbtn" data-addlist="false">
                            <i class="fa-solid fa-list"></i>
                            Add to list</button>
                        </li>
                        <li>
                          <button class="favbtn" data-favlist=${isfav}>
                            <i class="fa-solid fa-heart"></i>
                            Favourite</button>
                        </li>
                        <li>
                          <button  class="watchbtn" data-watchlist=${watch}>
                            <i class="fa-solid fa-clipboard-list"></i>
                            Watchlist
                          </button>
                        </li>
                        <li  class="Rating">
                          <button class="ratebtn" title="Rate It">
                          <i class="fa-solid fa-star"></i>
                          Rate
                          </button>
                          <div class="star-rating star-rating-card mt-1 px-1">
                                  <input type="radio" id="5-stars" name="rating" value="5" />
                                  <label for="5-stars" class="star">&#9733;</label>
                                  <input type="radio" id="4-stars" name="rating" value="4" />
                                  <label for="4-stars" class="star">&#9733;</label>
                                  <input type="radio" id="3-stars" name="rating" value="3" />
                                  <label for="3-stars" class="star">&#9733;</label>
                                  <input type="radio" id="2-stars" name="rating" value="2" />
                                  <label for="2-stars" class="star">&#9733;</label>
                                  <input type="radio" id="1-star" name="rating" value="1" />
                                  <label for="1-star" class="star">&#9733;</label>
                                  <i class="fa-solid fa-circle-minus removebtn my-2 px-1"></i>
                                </div>
                          </li>
                      </ul>
                    </div>
                    <div class="circle-progressbar">
                      <div
                        role="progressbar"
                        aria-valuenow="88"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="--value: ${vote_average * 10}"
                      ></div>
                    </div>
                    <a href="movie.html" data-click="true" class="card-title"> ${name} </a>
                    <p class="card-text">${moment(release_date).format(
                      "ll"
                    )}</p>
                  </div>
                </card>
              </div>
    `;
    popularONTvMovies.innerHTML = html;
  });
}

export function displayPopularTheatres(data) {
  const { results } = data;
  const popularONTvMovies = document.querySelector(".popular-intheatres");
  let html = "";
  results.forEach((OnTVmovie) => {
    const { name, poster_path, release_date, vote_average, id } = OnTVmovie;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;

    html += `
    <div class="col" data-category="tv">
    <card  data-id=${id} class="card">
      <a href="movie.html" data-click="true" class="card-img-btn">
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
        <div class="card-click" onclick="this.classList.toggle('on')">
          <ul>
            <li>
              <button class="addlistbtn" data-addlist="false">
                <i class="fa-solid fa-list"></i>
                Add to list</button>
            </li>
            <li>
              <button class="favbtn" data-favlist="false">
                <i class="fa-solid fa-heart"></i>
                Favourite</button>
            </li>
            <li>
              <button  class="watchbtn" data-watchlist="false">
                <i class="fa-solid fa-clipboard-list"></i>
                Watchlist
              </button>
            </li>
            <li  class="Rating">
              <button class="ratebtn" title="Rate It">
              <i class="fa-solid fa-star"></i>
              Rate
              </button>
              <div class="star-rating star-rating-card mt-1 px-1">
                      <input type="radio" id="5-stars" name="rating" value="5" />
                      <label for="5-stars" class="star">&#9733;</label>
                      <input type="radio" id="4-stars" name="rating" value="4" />
                      <label for="4-stars" class="star">&#9733;</label>
                      <input type="radio" id="3-stars" name="rating" value="3" />
                      <label for="3-stars" class="star">&#9733;</label>
                      <input type="radio" id="2-stars" name="rating" value="2" />
                      <label for="2-stars" class="star">&#9733;</label>
                      <input type="radio" id="1-star" name="rating" value="1" />
                      <label for="1-star" class="star">&#9733;</label>
                      <i class="fa-solid fa-circle-minus removebtn my-2 px-1"></i>
                    </div>
              </li>
          </ul>
        </div>
        <div class="circle-progressbar">
          <div
            role="progressbar"
            aria-valuenow="88"
            aria-valuemin="0"
            aria-valuemax="100"
            style="--value: ${vote_average * 10}"
          ></div>
        </div>
        <a href="movie.html" data-click="true" class="card-title"> ${name} </a>
        <p class="card-text">${moment(release_date).format("ll")}</p>
      </div>
    </card>
  </div>
    `;
    popularONTvMovies.innerHTML = html;
  });
}

export function displayTopRated(data) {
  const { results } = data;
  const topRated = document.querySelector(".top-rated");
  let html = "";
  results.forEach((LatestTrailer) => {
    const { title, poster_path, release_date, vote_average, id } =
      LatestTrailer;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;

    html += `
    <div class="col" data-category="movie">
    <card  data-id=${id} class="card">
      <a href="movie.html" data-click="true" class="card-img-btn">
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
        <div class="card-click" onclick="this.classList.toggle('on')">
          <ul>
            <li>
              <button class="addlistbtn" data-addlist="false">
                <i class="fa-solid fa-list"></i>
                Add to list</button>
            </li>
            <li>
              <button class="favbtn" data-favlist="false">
                <i class="fa-solid fa-heart"></i>
                Favourite</button>
            </li>
            <li>
              <button  class="watchbtn" data-watchlist="false">
                <i class="fa-solid fa-clipboard-list"></i>
                Watchlist
              </button>
            </li>
            <li  class="Rating">
              <button class="ratebtn" title="Rate It">
              <i class="fa-solid fa-star"></i>
              Rate
              </button>
              <div class="star-rating star-rating-card mt-1 px-1">
                      <input type="radio" id="5-stars" name="rating" value="5" />
                      <label for="5-stars" class="star">&#9733;</label>
                      <input type="radio" id="4-stars" name="rating" value="4" />
                      <label for="4-stars" class="star">&#9733;</label>
                      <input type="radio" id="3-stars" name="rating" value="3" />
                      <label for="3-stars" class="star">&#9733;</label>
                      <input type="radio" id="2-stars" name="rating" value="2" />
                      <label for="2-stars" class="star">&#9733;</label>
                      <input type="radio" id="1-star" name="rating" value="1" />
                      <label for="1-star" class="star">&#9733;</label>
                      <i class="fa-solid fa-circle-minus removebtn my-2 px-1"></i>
                    </div>
              </li>
          </ul>
        </div>
        <div class="circle-progressbar">
          <div
            role="progressbar"
            aria-valuenow="88"
            aria-valuemin="0"
            aria-valuemax="100"
            style="--value: ${vote_average * 10}"
          ></div>
        </div>
        <a href="movie.html" data-click="true" class="card-title"> ${title} </a>
        <p class="card-text">${moment(release_date).format("ll")}</p>
      </div>
    </card>
  </div>
    `;
    topRated.innerHTML = html;
  });
}

export function displayPopularMovies(data) {
  const { results } = data;
  const popularTvMovies = document.querySelector(".popular-tv-movies");
  let html = "";
  results.forEach((movie) => {
    const { title, poster_path, release_date, vote_average, id } = movie;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;

    html += `
    <div class="col" data-category="movie">
                <card  data-id=${id} class="card">
                  <a href="movie.html" data-click="true" class="card-img-btn">
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
                    <div class="card-click" onclick="this.classList.toggle('on')">
                      <ul>
                        <li>
                          <button class="addlistbtn" data-addlist="false">
                            <i class="fa-solid fa-list"></i>
                            Add to list</button>
                        </li>
                        <li>
                          <button class="favbtn" data-favlist="false">
                            <i class="fa-solid fa-heart"></i>
                            Favourite</button>
                        </li>
                        <li>
                          <button  class="watchbtn" data-watchlist="false">
                            <i class="fa-solid fa-clipboard-list"></i>
                            Watchlist
                          </button>
                        </li>
                        <li  class="Rating">
                          <button class="ratebtn" title="Rate It">
                          <i class="fa-solid fa-star"></i>
                          Rate
                          </button>
                          <div class="star-rating star-rating-card mt-1 px-1">
                                  <input type="radio" id="5-stars" name="rating" value="5" />
                                  <label for="5-stars" class="star">&#9733;</label>
                                  <input type="radio" id="4-stars" name="rating" value="4" />
                                  <label for="4-stars" class="star">&#9733;</label>
                                  <input type="radio" id="3-stars" name="rating" value="3" />
                                  <label for="3-stars" class="star">&#9733;</label>
                                  <input type="radio" id="2-stars" name="rating" value="2" />
                                  <label for="2-stars" class="star">&#9733;</label>
                                  <input type="radio" id="1-star" name="rating" value="1" />
                                  <label for="1-star" class="star">&#9733;</label>
                                  <i class="fa-solid fa-circle-minus removebtn my-2 px-1"></i>
                                </div>
                          </li>
                      </ul>
                    </div>
                    <div class="circle-progressbar">
                      <div
                        role="progressbar"
                        aria-valuenow="88"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="--value: ${vote_average * 10}"
                      ></div>
                    </div>
                    <a href="movie.html" data-click="true" class="card-title"> ${title} </a>
                    <p class="card-text">${moment(release_date).format(
                      "ll"
                    )}</p>
                  </div>
                </card>
              </div>
    `;
    popularTvMovies.innerHTML = html;
  });
}
