import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';

export default function ShareNotification({ sharer, post, openPostModal }) {
  return (
    <>
      {/* Contenedor del usuario que compartió */}
      <Link
        href={route('users.show', { user: sharer.id })}
        className="flex items-start justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        title={`Perfil de ${sharer.name}`}
      >
        <div className="flex items-start space-x-3 overflow-hidden">
          <div className="flex-shrink-0">
            {sharer.profile_image ? (
              <img
                src={sharer.profile_image.path_small}
                alt={`${sharer.name} avatar`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold leading-none font-mono">
                ?
              </div>
            )}
          </div>
          <div className="text-white text-sm leading-snug">
            <strong>{sharer.name}</strong> compartió tu publicación.
          </div>
        </div>
        <FontAwesomeIcon icon={faRetweet} className="text-purple-300 w-7 h-7 flex-shrink-0 ml-2 mt-1" />
      </Link>

      {/* Contenedor del post compartido */}
      <div
        className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-700"
        onClick={() => openPostModal(post)}
        title="Ver post"
      >
        <img
          src={post.image.path_small}
          alt={post.titulo}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
        />
        <span className="text-sm text-gray-300">{post.titulo}</span>
      </div>
    </>
  );
}
