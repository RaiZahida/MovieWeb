// random movie display on Dom load
let allMovies = []
document.addEventListener('DOMContentLoaded', () => {
    fetchmovies();
})
function fetchmovies() {
    randomMovieLoad();
}
async function randomMovieLoad() {
    const randomSearchItem = ['action', 'comedy', 'drama', 'love', 'hate', 'war','adventure']
    const randomItem = randomSearchItem[
        Math.floor(Math.random() * randomSearchItem.length)
    ]
    try {
        const data = await fetch(`https://www.omdbapi.com/?apikey=d1fcce51&s=${randomItem}`)
        let result = await data.json()
        allMovies = result.Search;
        console.log(result.Search)
        showmovies(result.Search)
    }
    catch (error) {
        console.log("Error in fetching", error)
        document.getElementById("movie-grid").innerHTML = 'Please try again after some time'
    }
}
// Movie dispaly based on user search
async function loadmovies(event) {
    event.preventDefault();
    const searchItem = document.getElementById("input").value
    try {
        if(searchItem!==''){
        const data = await fetch(`https://www.omdbapi.com/?apikey=d1fcce51&s=${searchItem}`)
        let result = await data.json()
        allMovies = result.Search;
        if(result.Search==''){
            alert("This is not found")
        }
        console.log(result.Search)
        showmovies(result.Search)}
        else{
            alert('Please enter Movie name')

        }
    }
    catch (error) {
        console.log("Error in fetching", error)
        document.getElementById("movie-grid").innerHTML = 'Please try again '
        setTimeout(()=>{
            fetchmovies()
        },2000)
    }
}
function showmovies(movies) {
    const movieGrid = document.getElementById('movie-grid')
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div')
        movieCard.classList.add("movieCard")
        movieCard.onclick = () => fetchMovieDetails(movie.imdbID);
       const poster= `${movie.Poster}`
        movieCard.innerHTML = `<img src='${movie.Poster}' onerror="this.onerror=null;this.src='./images/movie.jpeg';" /> <h5>${movie.Title}</h5><p>${movie.Year}</p>`
        movieGrid.appendChild(movieCard)
    });
}
// movie search based on filter
document.getElementById("option").addEventListener('change', () => {
    filtermovie();
})
function filtermovie() {
    let filter = document.getElementById('option').value
    let filteredmovie = [...allMovies]
    if (filter === 'Rating') {
        filteredmovie.sort((a, b) =>  b.vote_average - a.vote_average)
    }
    else if (filter === 'Year') {
       filteredmovie.sort((a,b)=> parseInt(b.Year)-parseInt(a.Year))
    }
    else{
        filteredmovie.sort((a,b)=>b.popularity-a.popularity)
    }
    showmovies(filteredmovie)
}
async function fetchMovieDetails(imdbID) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=d1fcce51&i=${imdbID}&plot=full`);
      const data = await res.json();
      document.getElementById("movieDetailLabel").textContent = `${data.Title} (${data.Year})`;
      document.getElementById("modal-body").innerHTML = `
      <img src="${data.Poster !== "N/A" ? data.Poster : './images/movie.jpeg'}" class="img-fluid mb-3" />
      <p><span class="fw-bold">Genre:</span> ${data.Genre}</p>
      <p><span class="fw-bold">Actors:</span> ${data.Actors}</p>
      <p><span class="fw-bold">Plot:</span> ${data.Plot}</p>
      <p><span class="fw-bold">IMDB Rating:</span> ${data.imdbRating}</p>
    `;
    
      // Show the modal using Bootstrap's JavaScript API
      const myModal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
      myModal.show();
    } catch (error) {
      console.error("Error loading movie details", error);
    }
  }
  