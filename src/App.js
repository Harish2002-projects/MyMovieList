import { useEffect, useState } from "react";
import Starrating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "56388382";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState("");
  const [query, setQuery] = useState("");
  const [selectedid, setselectedid] = useState(null);

  function handleselectedid(id) {
    setselectedid((selectedid) => (id === selectedid ? null : id));
  }
  function handleclose() {
    setselectedid(null);
  }
  function handleaddwatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handledeletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchdata() {
        try {
          setisloading(true);
          seterror("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found");
          }
          setMovies(data.Search);
          seterror("");
        } catch (err) {
          if (err.name !== "AbortError") seterror(err.message);
        } finally {
          setisloading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        seterror("");
        return;
      }
      handleclose();
      fetchdata();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Searchbar query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isloading && <Loading />}
          {!isloading && !error && (
            <Movielist movies={movies} handleselectid={handleselectedid} />
          )}
          {error && <Errormessage message={error} />}
        </Box>
        <Box>
          {selectedid ? (
            <Selectedmovie
              selectedid={selectedid}
              onclosemovie={handleclose}
              onaddwatched={handleaddwatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieslist
                watched={watched}
                handledeletewatched={handledeletewatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Errormessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>MyMovieList</h1>
    </div>
  );
}

function Searchbar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Loading() {
  return <p className="loader">Loading...</p>;
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Movielist({ movies, handleselectid }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleselectid={handleselectid}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleselectid }) {
  return (
    <li onClick={() => handleselectid(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Selectedmovie({ selectedid, onclosemovie, onaddwatched, watched }) {
  const [movie, setmovie] = useState({});
  const [isloading, setisloading] = useState(false);
  const [userRating, setuserrating] = useState("");

  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedid);
  const watcheduserrating = watched.find(
    (movie) => movie.imdbID === selectedid
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleadd() {
    const newWatchedMovie = {
      imdbID: selectedid,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
    };
    onaddwatched(newWatchedMovie);
  }
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onclosemovie();
          console.log("closing");
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onclosemovie]
  );

  useEffect(
    function () {
      async function getmoviedetails() {
        setisloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`
        );
        const data = await res.json();
        setmovie(data);
        setisloading(false);
      }
      getmoviedetails();
    },
    [selectedid]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "MyMovieList";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isloading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => onclosemovie()}>
              &larr;
            </button>
            <img src={poster} alt="poster"></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>&#11088;</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  <Starrating
                    maxstars={10}
                    size="24"
                    setuserrating={setuserrating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        handleadd();
                        onclosemovie();
                      }}
                    >
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  {" "}
                  You rated this movie {watcheduserrating}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toPrecision(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toPrecision(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toPrecision(
    3
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieslist({ watched, handledeletewatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          handledeletewatched={handledeletewatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handledeletewatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handledeletewatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
