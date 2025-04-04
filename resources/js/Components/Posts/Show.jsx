// resources/js/Components/Posts/Show.jsx
import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

const Show = ({ post, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false); // Estado para controlar si la imagen está ampliada

  // Al montar el componente, activamos la visibilidad con la transición
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!post) return null;

  // Función para abrir la imagen en pantalla completa
  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  // Función para cerrar la vista de la imagen
  const closeImageView = () => {
    setIsImageOpen(false);
  };

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

        {/* Foto de perfil y nombre del usuario */}
        <div className="flex items-center space-x-3 mb-4">
          <Link href={route('users.show', post.user.id)}>
            <img
              src={`/storage/${post.user.profile_image}`}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>
          <Link
            href={route('users.show', post.user.id)}
            className="font-semibold text-blue-500"
          >
            {post.user.name}
          </Link>
        </div>

        {/* Imagen de la publicación */}
        <div className="relative">
          <img
            src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
            alt={post.titulo}
            className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer"
            onClick={handleImageClick}
          />
        </div>

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

      {/* Vista en pantalla completa de la imagen */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          {/* Botón para cerrar la vista de imagen */}
          <button
            onClick={closeImageView}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            X
          </button>

          <img
            src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
            alt={post.titulo}
            className="max-w-full max-h-full object-contain cursor-pointer"
            onClick={closeImageView}
          />
        </div>
      )}
    </div>
  );
};

export default Show;
