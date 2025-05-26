import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';

export default function ShareNotification({ sharerName, sharer_profile_image, sharer_id, post, openPostModal }) {
  return (
    <>
      {/* Contenedor del usuario: todo es enlace al perfil */}
      <Link
        href={route('users.show', { user: sharer_id })}
        className="flex items-center justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        title={`Perfil de ${sharerName}`}
      >
        <div className="flex items-center space-x-3">
          {sharer_profile_image ? (
            <img
              src={sharer_profile_image}
              alt={`${sharerName} avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold">
              ?
            </div>
          )}
          <p className="text-white">
            <strong>{sharerName}</strong> compartió tu publicación.
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
