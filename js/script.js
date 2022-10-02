const JAPFLIX =  "https://japceibal.github.io/japflix_api/movies-data.json"
let buscador = document.getElementById("inputBuscar");
let moviesInfoArray = [];
let movieInfo = [];
let idMovie = localStorage.getItem("movieID"); // obtiene el id de la pelicula
// funciones -----------------------------------------------------------------------------------
function setMovieID(id) { // guarda el id para mostrar info de una pelicula en especifico
  localStorage.setItem("movieID", id);
}

function movieGenre(genres){ // obtener el genero + un guion
  let genre = ""
  genre += genres[0].name;
  for (let i = 1; i < genres.length; i++){
    genre += (" - " + genres[i].name);
  }
  return genre
}

function showMovies(){ // muestra las peliculas
    let buscarInput = document.getElementById("inputBuscar").value;
    let htmlContentToAppend = "";
    for(let i = 0; i < moviesInfoArray.length; i++){
      
        let movie = moviesInfoArray[i];
        if ((movie.title.toLowerCase() ||
             movie.genre.toLowerCase() ||
             movie.tagline.toLowerCase() ||
             movie.overview.toLowerCase()).includes(buscarInput.toLowerCase())){
            htmlContentToAppend += `
            <button class="btn btn-dark" type="button" data-bs-toggle="offcanvas" 
            data-bs-target="#movie${movie.id}" aria-controls="offcanvasTop" onClick="setMovieID(${movie.id})">
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-start" style="background:none;color:#fff;">
              <div>
              <div class="fw-bold d-flex justify-content-between align-items-start">${movie.title}</div> 
              <small class="text-muted d-flex justify-content-between align-items-start">${movie.tagline}</small>
              </div>
              <span>${starRating(movie.vote_average/2)}</span>
            </li>
            </ul>
            </div>
            </button>

            <div class="offcanvas offcanvas-top" id="movie${movie.id}" tabindex="-1" aria-labelledby="offcanvasTopLabel">
              <div class="offcanvas-header">
               <h3 class="offcanvas-title" id="offcanvasTopLabel">${movie.title}</h3>
               <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style="margin-right: 15px;"></button>
               </div>
               
               <div class="offcanvas-body">
              <p>${movie.overview}</p>
              <hr>
              <p>${movieGenre(movie.genres)}</p>
              </div>

          <div class="dropdown" style="text-align: right; padding-bottom: 10px;">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="margin-right: 15px;">
          More
          </button>
          <ul class="dropdown-menu dropdown-menu-dark ">
          <li><a class="dropdown-item" href="#">Year: ${(movie.release_date).substring(0, 4)}</a></li>
          <li><a class="dropdown-item" href="#">Runtime: ${movie.runtime} minutos</a></li>
          <li><a class="dropdown-item" href="#">Budget: $ ${movie.budget}</a></li>
          <li><a class="dropdown-item" href="#">Revenue: $ ${movie.revenue}</a></li>
          </ul>
          
          </div>
          </div>
      </div>
            `    
        } document.getElementById("lista").innerHTML = htmlContentToAppend;

    }; 
}; 
// muestra puntuacion con estrellas --------------------------------------------------------
let starRating = (score) => {
	let estrellas = "";
	for (let i = 1; i <= 5; i ++) {
        if (i<=score){
            estrellas += `<i class="fas fa-star" style="color: orange;"></i>`;
        } else {
            estrellas += '<i class="far fa-star"></i>';
        }
	} return estrellas; 
};
// DOM -------------------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function(){
      getJSONData(JAPFLIX).then(function(resultObj){
          if (resultObj.status === "ok"){
              moviesInfoArray = resultObj.data
              movieInfo = moviesInfoArray.filter(x=>x.id == localStorage.getItem("movieSelectedID"))
          }
          document.getElementById("btnBuscar").addEventListener("click", function(){
            showMovies();
        });

      });
          
    });
// getJSONData -----------------------------------------------------------------------------
let getJSONData = function(url){
    let result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

// --------------------------------------------------------------------------------------------