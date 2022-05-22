import configs from "../config.js";
import moment from "../node_modules/moment/dist/moment.js";

const { API_KEY, SESSION_ID, BASE_URL, DEFAULT_IMG_URL, BASE_IMG_URL } = configs;

export async function getMovie(movie_id,category) {
  try {
    const url = `${BASE_URL}${category}/${movie_id}?api_key=${API_KEY}&language=en-US`;
    const accountStateUrl = `${BASE_URL}${category}/${movie_id}/account_states?api_key=${API_KEY}&session_id=${SESSION_ID}`;
    const res = await fetch(url);
    const resAccountState = await fetch(accountStateUrl);
    const data = await res.json();
    const accountStateData = await resAccountState.json();
    const allData = { ...data, ...accountStateData };
    if (allData.success === false) {
      throw new Error(allData.status_message);
    }
    return allData;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMovieActors(movie_id,category) {
  try {
    const url = `${BASE_URL}${category}/${movie_id}/credits?api_key=${API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMovieRecommendations(movie_id,category) {
  try {
    const url = `${BASE_URL}${category}/${movie_id}/recommendations?api_key=${API_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function displayMovie(data) {
  const movieContent = document.querySelector(".main-movie");
  let html = "";
  let {
    title,
    poster_path,
    backdrop_path,
    overview,
    runtime,
    tagline,
    favorite,
    rated,
    watchlist,
    genres,
    release_date,
    vote_average,
  } = data;
    let {
      name,
      episode_run_time,
      first_air_date,
    }= data
  const poster = poster_path
    ? `${BASE_IMG_URL}${poster_path}`
    : DEFAULT_IMG_URL;
  const backdrop = backdrop_path
    ? `${BASE_IMG_URL}${backdrop_path}`
    : DEFAULT_IMG_URL;

  html += `
  <div class="header-movie" style="background-image: url(${backdrop});">
   <div class="custom-bg">
     <div class="container">
        <div class="row movie-item">
  <div class="col-12 col-md-4">
  <a href="" class="movie-posterimg">
  <img class="img-fluid "
  src="${poster}" alt="brand" />
  </a>
  </div>
  <div class="col-12 col-md-8">
  <a href="" class="movie-title my-2">
  <h1>
  ${title||name}(${release_date||first_air_date.split("-")[0]})
              </h1>
              </a>
              <p class="my-2">
               ${moment(release_date || first_air_date).format("L")}
              ${genres.map((genre) => genre.name).join(", ")}
              ${Math.floor(runtime || episode_run_time / 60)}h ${runtime || episode_run_time % 60}min
              
              </p>
              <div class="rating mt-5">
              <div class="circle-progressbar">
              <div role="progressbar" style="--value: ${vote_average * 10}">
              </div>
              </div>
              <h6 class="pb-4 mx-2">User Score</h6>
              <ul>
              <li>
              <button class="addlistbtn"  data-addlist="false" title="Add to list">
              <i class="fa-solid fa-list"></i>
              </button>
              </li>
              <li>
              <button class="favbtn" data-favlist=${favorite} title="Mark as favorite">
              <i class="fa-solid fa-heart"></i>
              </button>
              </li>
              <li>
              <button  class="watchbtn"  data-watchlist=${watchlist} title="Add to your wathclist">
              <i class="fa-solid fa-clipboard-list"></i>
              </button>
              </li>
              <li  class="Rating">
              <button  class="ratebtn" title="Rate It">
              <i class="fa-solid fa-star"></i>
              </button>
              <div class="star-rating mt-1 px-1">
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
              <div class="movie-overview my-2">
              <p class="tagline-text">
              ${tagline}
            
            </p>
            <h3 class="py-2">
            Overview
            </h3>
            <p> ${overview}
            </p>
            </div>
            <div class="row">
            <div class="col-4">
            <a href="" class="movie-character">
            steve ditko
            </a>
            <p>
            characters
            </p>
            </div>
            <div class="col-4">
            <a href="" class="movie-character ">
            stan lee
            </a>
            <p>
            characters
            </div>
            <div class="col-4">
            <a href="" class="movie-character">
            jon watts
            </a>
            <p>
            directors
            </div>
            <div class="col-4">
            <a href="" class="movie-character">
            erik sommers
            </a>
            <p>
            writer
            </div>
            <div class="col-4">
            <a href="" class="movie-character">
            chris mckenna
            </a>
            <p>
            writer
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            
            </div>
            `;

  movieContent.innerHTML = html;
}

export function displayMovieActors(data) {
  const { cast } = data;
  const personOfMovies = document.querySelector(".movie-actors");
  let html = "";
  cast.forEach((actors) => {
    const { profile_path, name, id, character } = actors;
    const poster = profile_path
      ? `${BASE_IMG_URL}${profile_path}`
      : DEFAULT_IMG_URL;
    html += `
    <div class="col">
    <div class="card card-actor"  data-id=${id}>
    <a href="" class="card-img">
    <img class="card-img-top"
      src="${poster}" alt="${name}" />
  </a>
  <div class="card-body py-3">
    <h5 class="card-title text-black"> ${name} </h5>
    <p class="card-text text-capitalize">${character}</p>
  </div>
    </div>
  </div>   
    `;
  });
  personOfMovies.innerHTML = html;
}

export function displayMovieRecommendations(data) {
  const { results } = data;
  const personOfMovies = document.querySelector(".movie-recommendations");
  let html = "";
  results.forEach((actors) => {
    const { poster_path, title, id, vote_average, release_date } = actors;
    const poster = poster_path
      ? `${BASE_IMG_URL}${poster_path}`
      : DEFAULT_IMG_URL;
    html += `
        <div class="col">
        <div class="card" data-id="${id}" >
          <a href="" class="card-img">
            <img class="card-img-top"
              src="${poster}" alt="${title}" />
          </a>
          <div class="card-img-overlay">
            <div class="card-overlay">
              <div class="movie-data">
                <i class="fa-solid fa-calendar-days"></i>  ${moment(
                  release_date
                ).format("l")}
              </div>
              <div class="lists">
                <a href="#" class="text-decoration-none pe-2">
                  <i class="fa-solid fa-heart"></i>
                </a>
                <a href="#" class="text-decoration-none pe-2">
                  <i class="fa-solid fa-list-ol"></i>
                </a>
                <a href="#" class="text-decoration-none">
                  <i class="fa-solid fa-star"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title text-black text-capitalize">${title}</h5>
            <p class="card-text">${Math.floor(vote_average * 10)} %</p>
          </div>
        </div>
      </div>
    `;
  });
  personOfMovies.innerHTML = html;
}

// Favorite List

export async function AddFavourite(id, category,favorite) {
  const FavouriteUrl = `${BASE_URL}account/${id}/favorite?api_key=${API_KEY}&session_id=${SESSION_ID}`;
  const bodyData = {
    media_type: `${category}`,
    media_id: id,
    favorite: !favorite,
  };
  const response = await fetch(FavouriteUrl, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();
  return data;
}

export async function AddWatchlist(id,category,watchlist) {
  const addToWatchlistUrl = `${BASE_URL}account/${id}/watchlist?api_key=${API_KEY}&session_id=${SESSION_ID}`;
  const bodyData = {
    media_type: `${category}`,
    media_id: id,
    watchlist: !watchlist,
  };
  const response = await fetch(addToWatchlistUrl, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();
  return data;
}

export async function AddRate(id, category ,value) {
  const addToRatedUrl = `${BASE_URL}${category}/${id}/rating?api_key=${API_KEY}&session_id=${SESSION_ID}`;
  const bodyData = {
    value,
  };
  const response = await fetch(addToRatedUrl, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();
  return data;
}
