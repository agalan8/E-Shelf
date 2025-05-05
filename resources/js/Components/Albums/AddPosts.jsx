import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Image from '@/Components/Image';

const AddPosts = ({ album, userPosts, onClose }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);

  const togglePostSelection = (postId) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(postId)
        ? prevSelected.filter((id) => id !== postId)
        : [...prevSelected, postId]
    );
  };

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90%] overflow-hidden flex flex-col">
        <h3 className="text-xl font-semibold mb-4">Seleccionar Posts</h3>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {/* Contenedor de posts con scroll */}
          <div className="flex-grow overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh]">
            {userPosts.length === 0 ? (
              <p className="text-gray-500">No tienes posts disponibles.</p>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className={`relative cursor-pointer rounded-md transition-all transform ${
                    selectedPosts.includes(post.id)
                      ? 'border-4 border-blue-500 shadow-lg bg-blue-100'
                      : 'bg-white'
                  }`}
                  onClick={() => togglePostSelection(post.id)}
                >
                  <Image
                    path={`${post.photo.url}`}
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

          {/* Botones de acción fijos debajo del listado de posts */}
          <div className="bg-white py-4 flex justify-between border-t border-gray-300 sticky bottom-0 left-0 right-0 z-10">
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
