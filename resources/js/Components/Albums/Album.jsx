import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Edit from '@/Components/Albums/Edit'; // Importamos el modal de edición

const Album = ({ album }) => {
  const { auth } = usePage().props; // Obtener el usuario autenticado desde Inertia

  // Estado para controlar la apertura del modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Si hay una imagen de portada, mostrarla */}
      {coverPhotoUrl !== 'Sin portada' ? (
        <img
          src={`/storage/${coverPhotoUrl}?t=${new Date().getTime()}`}
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

      {/* Botones solo visibles si el usuario tiene permiso */}
      {canEditOrDelete && (
        <div className="mt-4 flex space-x-4">
          {/* Botón de Editar que abre el modal */}
          <button onClick={() => setIsEditModalOpen(true)} className="text-green-500">
            Editar
          </button>
          <button className="text-red-500" onClick={() => alert('Eliminar álbum')}>
            Eliminar
          </button>
        </div>
      )}

      {/* Mostrar el modal de edición si isEditModalOpen es verdadero */}
      {isEditModalOpen && <Edit album={album} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default Album;
