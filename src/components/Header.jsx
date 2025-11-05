function Header() {
  return (
    <header className="w-full bg-gray-800 text-white py-4 sm:py-5 px-4 flex items-center justify-between shadow-md">
      {/* 🔹 Logo on the left */}
      <div className="flex items-center gap-3">
        <img
          src="icon-192.png" // 👉 Place your logo image inside the "public" folder
          alt="App Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide">
          Riza Noir
        </h1>
      </div>

      {/* 🔹 Optional: Right-side icon or text (like Favorites, Menu, etc.) */}
      {/* <button className="bg-white text-blue-600 font-semibold px-3 py-1 rounded-md hover:bg-gray-100 transition">
        Favorites
      </button> */}
    </header>
  );
}

export default Header;
