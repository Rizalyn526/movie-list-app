import MovieCard from "../MovieCard";

function MovieList({ movies, favorites, onToggleFavorite, onOpenTrailer }) {
  if (movies.length === 0) {
    return <p className="text-center text-gray-600 py-8">No movies found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 w-full max-w-7xl">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onToggleFavorite={onToggleFavorite}
          onOpenTrailer={onOpenTrailer}
          isFavorite={favorites.some((fav) => fav.imdbID === movie.imdbID)}
        />
      ))}
    </div>
  );
}

export default MovieList;