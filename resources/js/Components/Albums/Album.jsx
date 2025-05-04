import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Edit from '@/Components/Albums/Edit'; // Importamos el modal de edición
import FlipBook from '@/Components/Albums/FlipBook'; // Importamos el modal FlipBook

const Album = ({ album }) => {
  const { auth } = usePage().props; // Obtener el usuario autenticado desde Inertia

  // Estado para controlar la apertura del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFlipBookOpen, setIsFlipBookOpen] = useState(false); // Estado para FlipBook
  const [isDeleting, setIsDeleting] = useState(false); // Estado para manejar el proceso de eliminación

  // Verificar si el usuario puede editar o eliminar el álbum
  const canEditOrDelete = auth.user.id === album.user.id || auth.user.is_admin;

  // Definir la URL de la imagen de portada del álbum
  let coverPhotoUrl = album.portada; // Si el álbum tiene una portada personalizada
  if (!coverPhotoUrl) {
    // Si no tiene portada, tomar la foto del primer post
    coverPhotoUrl = album.posts.length > 0 ? album.posts[0].photo.url : null;
  }

  // Si no hay portada ni posts, mostrar un texto alternativo
  if (!coverPhotoUrl) {
    coverPhotoUrl = 'Sin portada'; // Texto alternativo
  }

  const handleDeleteAlbum = async () => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este álbum?')) {
        setIsDeleting(true); // Activar el estado de "eliminando" mientras la solicitud se procesa

        try {
          // Enviar solicitud DELETE a posts.destroy utilizando Inertia.js
          await router.delete(route('albums.destroy', album.id), {
            preserveScroll: true, // Mantener el scroll de la página
          });
        } catch (error) {
          console.error('Error al eliminar el álbum:', error);
        } finally {
          setIsDeleting(false); // Desactivar el estado de "eliminando"
        }
      }
    };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Si hay una imagen de portada, mostrarla */}
      {coverPhotoUrl !== 'Sin portada' ? (
        <img
          src={`${coverPhotoUrl}?t=${new Date().getTime()}`}
          alt={album.nombre}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        // Si no hay imagen, mostrar el texto alternativo
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-500">Sin portada</span>
        </div>
      )}

      <h3 className="text-lg font-semibold">{album.nombre}</h3>

      {/* Enlace para ver más detalles del álbum */}
      <Link href={route('albums.show', album.id)} className="text-blue-500 mt-2 block">
        Ver álbum completo
      </Link>

      {/* Enlace para ver el FlipBook */}
      <button onClick={() => setIsFlipBookOpen(true)} className="text-blue-500 mt-2 block">
        Ver Flipbook
      </button>

      {/* Botones solo visibles si el usuario tiene permiso */}
      {canEditOrDelete && (
        <div className="mt-4 flex space-x-4">
          {/* Botón de Editar que abre el modal */}
          <button onClick={() => setIsEditModalOpen(true)} className="text-green-500">
            Editar
          </button>
          {/* Botón para eliminar la publicación */}
          <button
            onClick={handleDeleteAlbum}
            className="text-red-500 mt-2 ml-4"
            disabled={isDeleting} // Desactivar el botón mientras se está eliminando
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      )}

      {/* Mostrar el modal de edición si isEditModalOpen es verdadero */}
      {isEditModalOpen && <Edit album={album} onClose={() => setIsEditModalOpen(false)} />}

      {/* Mostrar el modal FlipBook si isFlipBookOpen es verdadero */}
      {isFlipBookOpen && <FlipBook isOpen={isFlipBookOpen} onClose={() => setIsFlipBookOpen(false)} album={album} />}
    </div>
  );
};

export default Album;
