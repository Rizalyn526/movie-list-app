import { useState, useEffect } from "react";
import { Heart, Play } from "lucide-react";

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  // Feedback states
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [savedFeedback, setSavedFeedback] = useState([]);

  const movieKey = movie.imdbID || movie.Title.replace(/\s+/g, "_");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`feedback_${movieKey}`);
      if (raw) setSavedFeedback(JSON.parse(raw));
      else setSavedFeedback([]);
    } catch {
      setSavedFeedback([]);
    }
  }, [movieKey]);

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim() && !userRating) return;

    const newFeedback = {
      id: Date.now(),
      rating: userRating,
      text: feedbackText.trim() || "No comment",
    };

    try {
      const updatedFeedbacks = [...savedFeedback, newFeedback];
      localStorage.setItem(`feedback_${movieKey}`, JSON.stringify(updatedFeedbacks));
      setSavedFeedback(updatedFeedbacks);
      setFeedbackText("");
      setUserRating(0);
      setShowFeedbackBox(false);
    } catch (e) {
      console.error("Failed to save feedback:", e);
    }
  };

  const handleDeleteFeedback = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    const updated = savedFeedback.filter((fb) => fb.id !== id);
    localStorage.setItem(`feedback_${movieKey}`, JSON.stringify(updated));
    setSavedFeedback(updated);
  };

  const fetchTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const searchQuery = `${movie.Title} ${movie.Year} official trailer`;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery
      )}`;
      const proxyUrl = "https://corsproxy.io/?";
      const targetUrl = encodeURIComponent(youtubeSearchUrl);

      const response = await fetch(proxyUrl + targetUrl);
      const html = await response.text();
      const videoIdMatch = html.match(/"videoId":"([^"]+)"/);

      if (videoIdMatch && videoIdMatch[1]) {
        setTrailerKey(videoIdMatch[1]);
        setShowTrailer(true);
        setIsLoadingTrailer(false);
        return;
      }

      const invidiousUrl = `https://yewtu.cafe/api/v1/search?q=${encodeURIComponent(
        searchQuery
      )}&type=video`;
      const invidiousResp = await fetch(invidiousUrl);
      const invidiousData = await invidiousResp.json();
      if (Array.isArray(invidiousData) && invidiousData.length > 0 && invidiousData[0].videoId) {
        setTrailerKey(invidiousData[0].videoId);
        setShowTrailer(true);
        setIsLoadingTrailer(false);
        return;
      }

      throw new Error("No trailer found programmatically");
    } catch (err) {
      console.error("Error fetching trailer:", err);
      const searchQuery = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank");
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const imdbRatingNum = parseFloat(movie.imdbRating) || 0;

  const getRatingBadgeColor = () => {
    if (imdbRatingNum >= 8.4) return "bg-green-500";
    if (imdbRatingNum >= 7.5) return "bg-yellow-400";
    return "bg-red-500";
  };

  const renderStars = (count, size = "text-sm") =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${size} ${i < count ? "text-yellow-400" : "text-gray-600"}`}>
        ★
      </span>
    ));

  return (
    <div
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.8)]
        hover:shadow-[0_10px_40px_rgba(212,175,55,0.12)] transform hover:scale-[1.03] transition-all duration-400 group"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Poster area */}
      <div className="relative w-full" style={{ paddingTop: "150%" }}>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
          alt={movie.Title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-3xl transition-all duration-500 group-hover:brightness-75 group-hover:scale-105"
        />

        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(movie)}
          className="absolute top-3 left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-all z-10"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-[#FFD700]"
            }`}
          />
        </button>

        {/* IMDb Rating Badge */}
        {movie.imdbRating && movie.imdbRating !== "N/A" && (
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full shadow-md flex items-center gap-2 ${getRatingBadgeColor()} text-black font-bold`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs">⭐</span>
              <span className="text-sm">{imdbRatingNum.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Overlay details */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-t-3xl
            transition-opacity duration-400 ${showDetails ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm">
            <h2 className="font-bold text-lg mb-2 tracking-wide text-[#D4AF37]">
              {movie.Title}
            </h2>

            <p className="text-gray-300 italic text-xs line-clamp-3 mb-3">
              {movie.Plot || "An unforgettable cinematic experience."}
            </p>

            <div className="text-xs space-y-1 mb-3">
              <p>
                <span className="text-yellow-300 font-semibold">🎭 Genre:</span> {movie.Genre || movie.Type}
              </p>
              <p>
                <span className="text-yellow-300 font-semibold">⏱ Duration:</span> {movie.Runtime || movie.Year}
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <button
                onClick={fetchTrailer}
                disabled={isLoadingTrailer}
                className="bg-[#D4AF37] hover:bg-[#ffd54a] text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 shadow"
              >
                <Play className="w-4 h-4" />
                {isLoadingTrailer ? "Loading..." : "Watch Trailer"}
              </button>

              <button
                onClick={() => setShowFeedbackBox((s) => !s)}
                className="w-full py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
              >
                {showFeedbackBox ? "Cancel Feedback" : "💬 Leave Feedback"}
              </button>
            </div>

            {/* Feedback box */}
            {showFeedbackBox && (
              <div className="mt-3 bg-gray-800/70 p-3 rounded-xl">
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setUserRating(s)}
                      className={`text-2xl ${userRating >= s ? "text-yellow-400" : "text-gray-600"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full border border-gray-600 rounded-lg p-2 text-sm text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleFeedbackSubmit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setFeedbackText("");
                      setUserRating(0);
                      setShowFeedbackBox(false);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Saved feedbacks list */}
            {savedFeedback && savedFeedback.length > 0 && (
              <div className="mt-3 bg-black/30 border-t border-gray-600 pt-2 rounded-b-2xl">
                <p className="text-sm text-yellow-300 font-semibold mb-2">Your feedbacks:</p>

                {savedFeedback.map((fb) => (
                  <div key={fb.id} className="mb-2 border-b border-gray-700 pb-2 flex flex-col gap-1">
                    <p className="text-gray-200 text-sm">{fb.text}</p>
                    <div className="flex items-center justify-between">
                      <div>{renderStars(fb.rating)}</div>
                      <button
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-all"
                      >
                         Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <h2 className="font-semibold text-base sm:text-lg line-clamp-2 text-[#D4AF37]">
          {movie.Title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">{movie.Year}</p>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseTrailer}
        >
          <div
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-10 right-0 text-white text-4xl hover:text-red-500 transition-colors"
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
