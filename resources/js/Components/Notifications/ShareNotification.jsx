import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';

export default function ShareNotification({ sharer, post, openPostModal }) {
  return (
    <>
      {/* Contenedor del usuario: todo es enlace al perfil */}
      <Link
        href={route('users.show', { user: sharer.id })}
        className="flex items-center justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        title={`Perfil de ${sharer.name}`}
      >
        <div className="flex items-center space-x-3">
          {sharer.profile_image ? (
            <img
              src={sharer.profile_image.path_small}
              alt={`${sharer.name} avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold">
              ?
            </div>
          )}
          <p className="text-white">
            <strong>{sharer.name}</strong> compartió tu publicación.
          </p>
        </div>
        <FontAwesomeIcon icon={faRetweet} className="text-purple-300 w-8 h-8" />
      </Link>

      {/* Contenedor del post: abre modal al hacer clic */}
      <div
        className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-700"
        onClick={() => openPostModal(post)}
        title="Ver post"
      >
        <img
          src={post.image.path_small}
          alt={post.titulo}
          className="w-16 h-16 object-cover rounded"
        />
        <span className="text-sm text-gray-300">{post.titulo}</span>
      </div>
    </>
  );
}
