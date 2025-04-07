import { useState } from "react";
import { router } from "@inertiajs/react";

export default function Busqueda() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState(null);

  const toggleModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const selectFilter = (type) => {
    setFilter(type);
  };
  const clearFilter = () => {
    setFilter(null);
  };
  const handleSearch = () => {
    router.get("/buscar", { q: searchText, filter });
    setIsOpen(false);
  };

  return (
    <div className="relative w-72">
      <div className="flex items-center border border-gray-300 bg-white rounded-full px-4 py-2 w-full">
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-grow focus:outline-none"
          onFocus={toggleModal}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch} className="ml-2 text-blue-500">🔍</button>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg p-4 z-50">
          {filter ? (
            <div className="flex items-center bg-gray-200 px-2 py-1 rounded-full mb-2">
              <span className="text-sm font-medium">{filter}</span>
              <button className="ml-2 text-red-500" onClick={clearFilter}>×</button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold mb-2">Buscar por:</p>
              <button
                className="w-full text-left p-2 hover:bg-gray-200 rounded-lg"
                onClick={() => selectFilter("Usuarios")}
              >
                Usuarios
              </button>
            </>
          )}
          <button className="mt-2 w-full bg-gray-100 text-gray-600 py-2 rounded-lg" onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
