// resources/js/Components/Posts/Show.jsx
import React, { useEffect, useState } from 'react';

const Show = ({ post, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Al montar el componente, activamos la visibilidad con la transición
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!post) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative transition-transform duration-500 transform ${isVisible ? 'scale-100' : 'scale-90'}`}
      >
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 absolute top-2 right-2"
        >
          X
        </button>

        {/* Imagen de la publicación */}
        <img
          src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
          alt={post.titulo}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        {/* Título, descripción y localización */}
        <h2 className="text-2xl font-semibold">{post.titulo}</h2>
        <p className="text-sm text-gray-500 mb-2">{post.localizacion}</p>
        <p className="text-lg">{post.descripcion}</p>
        <div>
            <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
            {post.tags.map((tag) => (
                <p key={tag.id}>{tag.nombre}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Show;
