import configs from "../config.js";
import moment from "../node_modules/moment/dist/moment.js";
const { API_KEY, BASE_URL, DEFAULT_IMG_URL, BASE_IMG_URL } = configs;



export async function fetchSearchMovie(query, page = 1) {
  const url = `${BASE_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}


export function displaySearchResults(data) {
  const { results } = data;
  const searchResult = document.querySelector(".searchResults");
  let html = "";
  

  results.forEach((movie) => {
    const { id, title, overview, release_date, poster_path } = movie;
    const poster = poster_path
    ? `${BASE_IMG_URL}${poster_path}`
    : DEFAULT_IMG_URL;
    html += `
    <div class="row shadow-sm p-1 mb-3 bg-white rounded">

        <div class="card mb-3 " data-id="${id}" >
          <div class="row ">
            <div class="col-2" data-id="${id}">
            <a href="">
            
            <img style="height: 200px;width: 100%;" src="${poster}" class="img-fluid rounded-start" >
            </a>
            </div>
            <div class="col-10">
              <div class="card-body">
              
                <h5 data-id="${id}" class="card-title">${title}</h5>
                <p class="card-text"><small class="text-muted">${release_date}</small></p>
                <p class="card-text">${overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  });
  searchResult.innerHTML = html;
  
}

