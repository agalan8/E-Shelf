import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "../Image";

const AddPosts = ({ shop, userPosts, onClose }) => {
  const [selectedPosts, setSelectedPosts] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePostSelection = (postId) => {
    setSelectedPosts((prevSelected) => {
      if (prevSelected.hasOwnProperty(postId)) {
        const newSelected = { ...prevSelected };
        delete newSelected[postId];
        return newSelected;
      } else {
        return { ...prevSelected, [postId]: "" };
      }
    });
  };

  const handlePriceChange = (postId, price) => {
    setSelectedPosts((prevSelected) => ({
      ...prevSelected,
      [postId]: price,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedIds = Object.keys(selectedPosts);
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un post para agregar.");
      return;
    }

    for (const id of selectedIds) {
      if (!selectedPosts[id] || Number(selectedPosts[id]) <= 0) {
        alert("Introduce un precio válido para todos los posts seleccionados.");
        return;
      }
    }

    const postsData = selectedIds.map((id) => ({
      id,
      precio: selectedPosts[id],
    }));

    router.post(
      route("shop-posts.store"),
      { posts: postsData },
      {
        onSuccess: () => handleClose(),
        preserveScroll: true,
      }
    );
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#292B2F] rounded-lg shadow-lg w-11/12 max-w-7xl h-[90vh] flex flex-col overflow-hidden relative transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow relative">
          <div className="p-6 text-white overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Añadir Publicaciones a la Tienda</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-4">
              {userPosts.length === 0 ? (
                <p>No tienes posts disponibles.</p>
              ) : (
                userPosts.map((post) => {
                  const postId = post.posteable.id;
                  const isSelected = selectedPosts.hasOwnProperty(postId);

                  return (
                    <div
                      key={postId}
                      onClick={() => togglePostSelection(postId)}
                      className={`relative rounded cursor-pointer transition-all p-2 flex flex-col ${
                        isSelected
                          ? "border-4 border-purple-500 bg-purple-100 bg-opacity-10"
                          : "border border-gray-600"
                      }`}
                    >
                      <div className="relative">
                        <Image
                          src={post.posteable.image.path_medium}
                          alt={post.posteable.titulo}
                          className="object-cover w-full h-48 rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm p-1 pointer-events-none rounded-b">
                          {post.posteable.titulo}
                        </div>
                      </div>

                      {isSelected && (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={selectedPosts[postId]}
                          onChange={(e) => handlePriceChange(postId, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          placeholder="Precio (€)"
                          className="mt-2 px-3 py-2 rounded bg-[#1f1f22] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-500"
            >
              Añadir Publicaciones
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPosts;
