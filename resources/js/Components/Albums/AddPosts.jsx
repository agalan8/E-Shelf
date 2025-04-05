import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const AddPosts = ({ album, userPosts, onClose }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);

  // Maneja la selección de posts
  const togglePostSelection = (postId) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(postId)
        ? prevSelected.filter((id) => id !== postId) // Quitar si ya está seleccionado
        : [...prevSelected, postId] // Agregar si no está seleccionado
    );
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedPosts.length === 0) {
      alert('Selecciona al menos un post para agregar.');
      return;
    }

    router.post(route('albums.posts.store', album.id), { posts: selectedPosts }, {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  // Efecto para prevenir el scroll en el body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Deshabilitar scroll en el body cuando el modal está abierto
    return () => {
      document.body.style.overflow = 'auto'; // Restaurar el scroll al cerrar el modal
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal con tamaño similar al paso 2 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90%] overflow-hidden flex flex-col">
        <h3 className="text-xl font-semibold mb-4">Seleccionar Posts</h3>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {/* Contenedor de los posts con scroll */}
          <div className="max-h-[80%] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {userPosts.length === 0 ? (
              <p className="text-gray-500">No tienes posts disponibles.</p>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className={`relative cursor-pointer rounded-md transition-all transform ${
                    selectedPosts.includes(post.id)
                      ? 'border-4 border-blue-500 shadow-lg bg-blue-100' // Estilo cuando está seleccionado
                      : 'bg-white'
                  }`}
                  onClick={() => togglePostSelection(post.id)} // Alternar selección de post
                >
                  <img
                    src={`/storage/${post.photo.url}`}
                    alt={post.titulo}
                    className="object-cover w-full h-64 rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 text-white w-full text-center">
                    {post.titulo}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Agregar Posts
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPosts;
