import * as home from "./home.js";
import * as movie from "./movie.js";
import * as person from "./person.js";
import * as favpersons from "./people.js";
import * as topmovies from "./popularmovie.js";
import { displaySearchResults, fetchSearchMovie } from "./search.js";
import * as profile from "./profile.js";
import configs from "../config.js";
const { BASE_URL, API_KEY } = configs;

window.addEventListener("popstate", (e) => {
  location.reload();
});
document.addEventListener("DOMContentLoaded", function (e) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 10000,
    background: "#5FB662",
    iconColor: "#ffffff",
    color: "#ffffff",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  if (location.pathname === "/people.html" || location.pathname === "/people") {
    favpersons
      .getFavPerson()
      .then((data) => {
        favpersons.displayFavPerson(data);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        const cardPersons = document.querySelectorAll(".card");
        cardPersons.forEach((card) => {
          card.addEventListener("click", (e) => {
            const personid = card.dataset.id;
            history.pushState({ personid }, null, `/person.html`);
            location.reload();
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (location.pathname === "/person.html" || location.pathname === "/person") {
    const personid = history.state.personid;
    const actorId = history.state.actorId;
    person
      .getPerson(personid || actorId)
      .then((data) => {
        person.displayPerson(data);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
      })
      .catch((err) => {
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        Toast.fire({
          icon: "error",
          title: `${err.message}`,
        });
      });
    // get Person of movies
    person.getPersonOfMovies(personid || actorId).then((data) => {
      person.displayPersonOfMovies(data);
    });
  }
  if (location.pathname === "/index.html" || location.pathname === "/") {
    Promise.all([
      home.getPopularTVMovies(),
      home.getPopularTheatres(),
      home.getPopularMovies(),
      home.getTopRated(),
      home.getAccaountTvState(),
      home.getAccountMovieState(),
    ])
      .then((data) => {
        home.displayPopularTVMovies(data[0], data[4]);
        home.displayPopularTheatres(data[1]);
        home.displayPopularMovies(data[2]);
        home.displayTopRated(data[3]);
        home.searchMovieHandler(location, history);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        const movieList = document.querySelectorAll(`[data-click="true"]`);
        movieList.forEach((movieCard) => {
          movieCard.addEventListener("click", (e) => {
            e.preventDefault();
            const id = e.target.closest(".card").dataset.id;
            const category =e.target.closest("[data-category]").dataset.category;
            history.pushState({ id, category }, null, `/movie.html`);
            location.reload();
          });
        });
        let circleBtn = document.querySelectorAll(".threedot-btn");
        const CircleBtnArr = Array.from(circleBtn);
         CircleBtnArr.forEach((item)=>{
             item.addEventListener('click', function(e){
                 let CardClick = e.target.parentNode.parentNode.nextElementSibling.firstElementChild;
                 if (!CardClick.classList.contains("on")){
                     CardClick.classList.add("on");
                 }
             })
         })

      })
      .catch((err) => {
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        Toast.fire({
          icon: "error",
          title: `${err.message}`,
        });
      });
  }
  if (location.pathname === "/movie.html" || location.pathname === "/movie") {
    let id = history.state.id;
    let category = history.state.category;
    movie
      .getMovie(id, category)
      .then((data) => {
        movie.displayMovie(data);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        const favBtn = document.querySelector(".favbtn");
        const watchBtn = document.querySelector(".watchbtn");
        const rateBtn = document.querySelector(".ratebtn");
        const starRating = document.querySelector(".star-rating");
        let Stars = document.querySelectorAll(".star");
        const removeBtn = document.querySelector(".removebtn");
        // favourite, watchlist and rating
        // favourite
        favBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const favoriteBtn = e.target.closest(".favbtn").dataset.favlist;
          const favorite = favoriteBtn == "true" ? true : false;
          movie.AddFavourite(id, category,favorite).then((data) => {
            if (data.success) {
              e.target.closest(".favbtn").dataset.favlist = !favorite;
            }
          });
        });
        // Watchlist
        watchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const watchlistBtn = e.target.closest(".watchbtn").dataset.watchlist;
          const watchlist = watchlistBtn == "true" ? true : false;
          movie.AddWatchlist(id, category,watchlist).then((data) => {
            if (data.success) {
              e.target.closest(".watchbtn").dataset.watchlist = !watchlist;
            }
          });
        });
        // Rating
        let {
          rated: { value },
        } = data;
        let StarsArr = Array.from(Stars);
        let StarsArrSort = StarsArr.reverse();
        for (let i = 0; i < value; i++) {
          StarsArrSort[i].classList.add("checked");
        }
        rateBtn.addEventListener("click", (e) => {
          starRating.classList.toggle("onRating");
          if (starRating.classList.contains("onRating")) {
            starRating.addEventListener("change", (e) => {
              const rating = e.target.value;
              Toast.fire({
                icon: "success",
                title: `SUCCESS!
              Your rating is ${rating} has been saved `,
              });
              movie.AddRate(id,category ,rating).then((data) => {
                if (data.success) {
                  value = rating;
                }
              });
            });
            removeBtn.addEventListener("click", function (e) {
              starRating.querySelector(
                "input[type=radio]:checked"
              ).checked = false;
            });
          }
        });
      })
      .catch((err) => {
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        Toast.fire({
          icon: "error",
          title: `${err.message}`,
        });
      });
    movie.getMovieActors(id,category).then((data) => {
      movie.displayMovieActors(data);
      const cardListActors = document.querySelectorAll(".card-actor");
      cardListActors.forEach((card) => {
        card.addEventListener("click", (e) => {
          const actorId = card.dataset.id;
          history.pushState({ actorId }, null, `/person.html`);
          location.reload();
        });
      });
    });
    movie.getMovieRecommendations(id,category).then((data) => {
      movie.displayMovieRecommendations(data);
    });
  }
  if (
    location.pathname === "/profile.html" ||
    location.pathname === "profile"
  ) {
    profile
      .getDetailAccount()
      .then((data) => {
        profile.displayDetailAccount(data);
        //   const cardList = document.querySelectorAll(".card");
        // cardList.forEach((card) => {
        //   card.addEventListener("click", (e) => {
        //     const id = card.dataset.id;
        //     history.pushState({ id }, null, `/movie.html`);
        //     location.reload();
        //   });
        // });
      })
      .catch((err) => {
        console.log(err);
      });
    profile
      .getFavMovieAccount()
      .then((data) => {
        profile.displayFavMovieAccount(data);
        const cardList = document.querySelectorAll(".card");
        cardList.forEach((card) => {
          card.addEventListener("click", (e) => {
            const id = card.dataset.id;
            history.pushState({ id }, null, `/movie.html`);
            location.reload();
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
    profile
      .getRating()
      .then((data) => {
        profile.displayRating(data);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        const cardList = document.querySelectorAll(".card");
        cardList.forEach((card) => {
          card.addEventListener("click", (e) => {
            const id = card.dataset.id;
            history.pushState({ id }, null, `/movie.html`);
            location.reload();
          });
        });
        const favBtn = document.querySelector(".favbtn");
        const watchBtn = document.querySelector(".watchbtn");
        const rateBtn = document.querySelector(".ratebtn");
        const starRating = document.querySelector(".star-rating");
        let Stars = document.querySelectorAll(".star");
        const removeBtn = document.querySelector(".removebtn");
        // favourite, watchlist and rating
        // favourite
        favBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const favoriteBtn = e.target.closest(".favbtn").dataset.favlist;
          const favorite = favoriteBtn == "true" ? true : false;
          movie.AddFavourite(id, favorite).then((data) => {
            if (data.success) {
              e.target.closest(".favbtn").dataset.favlist = !favorite;
            }
          });
        });
        // Watchlist
        watchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const watchlistBtn = e.target.closest(".watchbtn").dataset.watchlist;
          const watchlist = watchlistBtn == "true" ? true : false;
          movie.AddWatchlist(id, watchlist).then((data) => {
            if (data.success) {
              e.target.closest(".watchbtn").dataset.watchlist = !watchlist;
            }
          });
        });
        // Rating
        let {
          rated: { value },
        } = data;
        let StarsArr = Array.from(Stars);
        let StarsArrSort = StarsArr.reverse();
        for (let i = 0; i < value; i++) {
          StarsArrSort[i].classList.add("checked");
        }
        rateBtn.addEventListener("click", (e) => {
          starRating.classList.toggle("onRating");
          if (starRating.classList.contains("onRating")) {
            starRating.addEventListener("change", (e) => {
              const rating = e.target.value;
              Toast.fire({
                icon: "success",
                title: `SUCCESS!
              Your rating is ${rating} has been saved `,
              });
              movie.AddRate(id, rating).then((data) => {
                if (data.success) {
                  value = rating;
                }
              });
            });
            removeBtn.addEventListener("click", function (e) {
              starRating.querySelector(
                "input[type=radio]:checked"
              ).checked = false;
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (
    location.pathname === "/popularmovie.html" ||
    location.pathname === "/popularmovie"
  ) {
    topmovies.getGenres().then((data) => {
      topmovies.displayGenres(data, document);
      const popMovForm = document.querySelector(".popularMovieSort");
      const genres = document.querySelectorAll(`[name="with_genres"]`);
      const keywords = document.querySelector(`#flex0`);
      const handleKeywordInput = async () => {
        if (!keywords.value) {
          return;
        }
        const keywordRespone = await fetch(
          `${BASE_URL}/search/keyword?api_key=${API_KEY}&query=${keywords.value}&page=1`
        );
        const keywordData = await keywordRespone.json();
        console.log(keywordData, "keyword");
        const optionsWrapper = document.querySelector("#languages");
        let optionContent = "";
        keywordData?.results.forEach((keyword) => {
          optionContent += `<option id=${keyword.id} value="${keyword.id}">${keyword.name}</option>`;
        });
        optionsWrapper.innerHTML = optionContent;
        // displayKeywords(keywordData);
      };
      keywords.addEventListener("keyup", _.debounce(handleKeywordInput, [500]));

      popMovForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log($(".with_key").flexdatalist('value'), "sjdbhjshdjhs");
        // const keywordInputList = document.querySelectorAll("#languages option");
        const formData = new FormData(popMovForm);
        // keywordInputList.forEach((keyword) => {
        //   if (keyword.selected) {
        //     console.log(keyword.value);
        //   }
        // });
        const with_genres = [];
        const with_key = [];
        genres.forEach((genre) => {
          if (genre.checked) {
            with_genres.push(genre.value);
          }
        });
        formData.append("with_genres", with_genres);
        const query = Object.fromEntries(formData);

        topmovies
          .discoverPopularMovie(query)
          .then((data) => {
            topmovies.sortMovies(data);
            const cardList = document.querySelectorAll(".card");
            cardList.forEach((card) => {
              card.addEventListener("click", (e) => {
                const popid = card.dataset.id;
                history.pushState({ popid }, null, `/movie.html`);
                location.reload();
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });

    // topmovies
    //   .getTopMovies()
    //   .then((data) => {
    //     topmovies.displayTopMovies(data);
    //     const cardList = document.querySelectorAll(".card");
    //     cardList.forEach((card) => {
    //       card.addEventListener("click", (e) => {
    //         const popid = card.dataset.id;
    //         history.pushState({ popid }, null, `/movie.html`);
    //         location.reload();
    //       });
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    topmovies
      .getPopularFavMovies()
      .then((data) => {
        topmovies.searchHandler();

        topmovies.displayPopularFavMovies(data);
        const loading = document.querySelector(".lds-dual-ring");
        document.body.removeChild(loading);
        const cardList = document.querySelectorAll(".card");
        cardList.forEach((card) => {
          card.addEventListener("click", (e) => {
            const id = card.dataset.id;
            history.pushState({ id }, null, `/movie.html`);
            location.reload();
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (location.pathname === "/search.html") {
    const loading = document.querySelector(".lds-dual-ring");
    document.body.removeChild(loading);
    fetchSearchMovie(history.state.query, history.state?.page).then((data) => {
      displaySearchResults(data);
    });
  }
});