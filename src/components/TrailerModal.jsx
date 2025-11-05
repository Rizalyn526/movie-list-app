export default function TrailerModal({ title, onClose }) {
  if (!title) return null;

  const searchQuery = encodeURIComponent(`${title} trailer`);
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-4 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          ✕
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            width="100%"
            height="480"
            src={embedUrl}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
