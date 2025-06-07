import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Busqueda() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const toggleModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const selectFilter = (type) => setFilter(type);
  const clearFilter = () => setFilter(null);

const handleSearch = () => {
  if (!filter && searchText.trim() === "") return; // Solo evita búsqueda si NO hay filtro ni texto

  router.get("/buscar", { q: searchText, filter });
  setIsOpen(false);
};


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        inputRef.current &&
        event.target !== inputRef.current
      ) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Para evitar un submit de formulario o comportamiento por defecto
      handleSearch();
    }
  };

  return (
    <div className="relative w-60" ref={containerRef}>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          className="w-full pl-4 pr-10 py-1.5 text-sm rounded-md bg-[#292B2F] border border-purple-700 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          onFocus={toggleModal}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 right-2 flex items-center text-purple-400 hover:text-purple-600"
          aria-label="Buscar"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-[#272729] border border-purple-700 rounded-lg shadow-lg p-4 z-50 text-white">
          {filter ? (
            <div className="flex items-center bg-purple-700 bg-opacity-30 px-3 py-1 rounded-full mb-2">
              <span className="text-sm font-medium">{filter}</span>
              <button
                className="ml-2 text-purple-400 hover:text-purple-600 font-bold"
                onClick={clearFilter}
                aria-label="Quitar filtro"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold mb-2 text-purple-300">Buscar por:</p>
              <button
                className="w-full text-left p-2 hover:bg-purple-700 rounded-lg transition"
                onClick={() => selectFilter("Usuarios")}
              >
                Usuarios
              </button>
              <button
                className="w-full text-left p-2 hover:bg-purple-700 rounded-lg transition"
                onClick={() => selectFilter("Publicaciones")}
              >
                Publicaciones
              </button>
              <button
                className="w-full text-left p-2 hover:bg-purple-700 rounded-lg transition"
                onClick={() => selectFilter("Comunidades")}
              >
                Comunidades
              </button>
            </>
          )}
          <button
            className="mt-2 w-full bg-purple-700 bg-opacity-40 text-purple-200 py-2 rounded-lg hover:bg-purple-600 transition"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
