import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const Album = ({ album }) => {
  const { auth } = usePage().props; // Obtener el usuario autenticado desde Inertia

  // Verificar si el usuario puede editar o eliminar el álbum
  const canEditOrDelete = auth.user.id === album.user.id || auth.user.is_admin;

  // Obtener la imagen del primer post o una imagen por defecto
  const coverPhotoUrl = album.posts.length > 0 ? album.posts[0].photo.url : 'default-placeholder.jpg';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Foto de perfil y nombre del usuario */}
      <div className="flex items-center space-x-3 mb-4">
        <Link href={route('users.show', album.user.id)}>
          <img
            src={`/storage/${album.user.profile_image}`}
            alt={album.user.name}
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <Link
          href={route('users.show', album.user.id)}
          className="font-semibold text-blue-500"
        >
          {album.user.name}
        </Link>
      </div>

      {/* Imagen de portada del álbum */}
      <img
        src={`/storage/${coverPhotoUrl}?t=${new Date().getTime()}`}
        alt={album.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold">{album.nombre}</h3>

      {/* Enlace para ver más detalles del álbum */}
      <Link href={route('albums.show', album.id)} className="text-blue-500 mt-2 block">
        Ver álbum completo
      </Link>

      {/* Botones solo visibles si el usuario tiene permiso */}
      {canEditOrDelete && (
        <div className="mt-4 flex space-x-4">
          <Link href={route('albums.edit', album.id)} className="text-green-500">
            Editar
          </Link>
          <button className="text-red-500" onClick={() => alert('Eliminar álbum')}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default Album;
