import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import TrailerModal from "./components/TrailerModal";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=ff4a0350";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");
  const [activeTab, setActiveTab] = useState("search");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}&s=${searchTerm}`);
      const data = await response.json();
      
      if (data.Search) {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const detailResponse = await fetch(`${API_URL}&i=${movie.imdbID}&plot=short`);
              const detailData = await detailResponse.json();
              return { 
                ...movie, 
                Plot: detailData.Plot,
                Genre: detailData.Genre,
                Runtime: detailData.Runtime,
                imdbRating: detailData.imdbRating,
                Actors: detailData.Actors,
                Director: detailData.Director,
                Year: detailData.Year || movie.Year
              };
            } catch (error) {
              return movie;
            }
          })
        );
        setMovies(detailedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.imdbID === movie.imdbID);
      if (isFavorite) {
        return prev.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        return [...prev, movie];
      }
    });
  };

  const openTrailer = (movie) => {
    setSelectedMovie(movie);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <Header />
      
      <div className="w-full max-w-7xl px-4 pt-4">
        <div className="flex gap-2 sm:gap-4 border-b">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base transition ${
              activeTab === "search"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Search Results
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base transition ${
              activeTab === "favorites"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {activeTab === "search" && (
        <>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={fetchMovies} />
          <MovieList 
            movies={movies} 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite}
            onOpenTrailer={openTrailer}
          />
        </>
      )}

      {activeTab === "favorites" && (
        <div className="w-full flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">No favorite movies yet.</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Click the heart icon to add movies to favorites!</p>
            </div>
          ) : (
            <MovieList 
              movies={favorites} 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite}
              onOpenTrailer={openTrailer}
            />
          )}
        </div>
      )}

      <Footer />
      
      {selectedMovie && (
        <TrailerModal movie={selectedMovie} onClose={closeTrailer} />
      )}
    </div>
  );
}

export default App;