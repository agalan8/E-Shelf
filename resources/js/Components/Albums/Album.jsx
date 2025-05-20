import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Edit from '@/Components/Albums/Edit';
import FlipBook from '@/Components/Albums/FlipBook';
import Image from '../Image';

const Album = ({ album }) => {
  const { auth } = usePage().props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFlipBookOpen, setIsFlipBookOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null);

  useEffect(() => {
    let photoUrl = album.cover_image ? album.cover_image.path_medium : null;
    if (!photoUrl && album.posts.length > 0) {
      photoUrl = album.posts[0].image ? album.posts[0].image.path_medium : null;
    }
    setCoverPhotoUrl(photoUrl);
  }, [album]);

  const canEditOrDelete = auth.user.id === album.user.id || auth.user.is_admin;

  const handleDeleteAlbum = async (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este álbum?')) {
      setIsDeleting(true);
      try {
        await router.delete(route('albums.destroy', album.id), {
          preserveScroll: true,
        });
      } catch (error) {
        console.error('Error al eliminar el álbum:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCardClick = () => {
    router.visit(route('albums.show', album.id));
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleFlipBookClick = (e) => {
    e.stopPropagation();
    setIsFlipBookOpen(true);
  };

  return (
    <>
      <div
        className="relative w-[260px] h-[260px] cursor-pointer select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCardClick}
      >
        {/* Capas para efecto pila de fotos con animación */}
        <div
          className="absolute top-4 left-4 w-full h-full bg-gray-300 shadow-lg transition-transform duration-300"
          style={{
            transform: hovered ? 'rotate(-8deg) translateX(-6px) translateY(4px)' : 'rotate(-3deg)',
            zIndex: 1,
            border: '1px solid #ccc',
          }}
        />
        <div
          className="absolute top-2 left-2 w-full h-full bg-gray-400 shadow-lg transition-transform duration-300"
          style={{
            transform: hovered ? 'rotate(-4deg) translateX(-3px) translateY(2px)' : 'rotate(-1deg)',
            zIndex: 2,
            border: '1px solid #bbb',
          }}
        />

        {/* Tarjeta principal con portada */}
        <div
          className={`relative w-full h-full bg-white shadow-xl border border-gray-300`}
          style={{ zIndex: 3 }}
        >
          {coverPhotoUrl ? (
            <Image
              src={`${coverPhotoUrl}?t=${new Date().getTime()}`}
              alt={album.nombre}
              className="w-full h-full object-cover"
              draggable={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">Sin portada</span>
            </div>
          )}

          {/* Botones editar/eliminar */}
          {canEditOrDelete && (
            <div
              className={`absolute top-3 right-3 flex space-x-2 z-10 transition-opacity duration-300 ${
                hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                onClick={handleEditClick}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#7A27BC] hover:bg-opacity-90 transition transform hover:scale-110 shadow-md"
                aria-label="Editar álbum"
                title="Editar álbum"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="text-white w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteAlbum}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#7A27BC] hover:bg-opacity-90 transition transform hover:scale-110 shadow-md"
                aria-label="Eliminar álbum"
                title="Eliminar álbum"
                disabled={isDeleting}
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-400 w-5 h-5" />
              </button>
            </div>
          )}

          {/* Franja inferior con nombre y botón ver flipbook */}
          <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-md px-4 py-2 flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold truncate max-w-[75%]">{album.nombre}</h3>
            <button
              onClick={handleFlipBookClick}
              className="w-9 h-9 rounded-md bg-[#7A27BC] hover:bg-opacity-90 transition shadow-md transform hover:scale-105 flex items-center justify-center"
              title="Ver Flipbook"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isEditModalOpen && (
        <Edit
          album={album}
          onClose={() => setIsEditModalOpen(false)}
          onCoverImageUpdated={setCoverPhotoUrl}
        />
      )}

      {isFlipBookOpen && (
        <FlipBook
          isOpen={isFlipBookOpen}
          onClose={() => setIsFlipBookOpen(false)}
          album={album}
        />
      )}
    </>
  );
};

export default Album;
