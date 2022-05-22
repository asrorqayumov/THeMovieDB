

import configs from "../config.js";
const { API_KEY, BASE_URL, DEFAULT_IMG_URL, BASE_IMG_URL } = configs;

export async function getFavPerson(page = 1) {
  try {
    const url = `${BASE_URL}person/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export function displayFavPerson(data) {
  const { results } = data;
  const favpersons = document.querySelector(".fav_person");
  let html = "";
  results.forEach((person) => {
    const { name, profile_path,known_for_department, id } = person;
    const poster = profile_path
      ? `${BASE_IMG_URL}${profile_path}`
      : DEFAULT_IMG_URL;

      html += `
      <div class="col col-sm-6 col-md-4 col-lg-3">
          <div data-id=${id}
            class="card shadow p-3 mb-5 bg-white rounded"
            style="border: none"
          ><a href="">
            <img
              class="card-img-top"
              src="${poster}"
              alt="Card image cap"
            /></a>
            <div class="card-body">
              <h5 class="card-title">
                <a
                  style="
                    text-decoration: none;
                    margin-top: 0;
                    font-weight: 600;
                    font-size: 1.1em;
                    color: #000;
                  "
                  href="./"
                  >${name}</a
                >
              </h5>
              <p
                style="
                  font-size: 0.9em;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.6);
                  display: block;
                  margin-top: 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  padding: 0;
                  width: 100%;
                  line-height: 1.2em;
                "
                class="card-text"
              >
               ${known_for_department}
              </p>
            </div>
          </div>
        </div>
      `

      favpersons.innerHTML = html;
  });
}      
