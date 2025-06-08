import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';

export default function MentionNotification({ mentioner, post, openPostModal }) {
  return (
    <>
      <Link
        href={route('users.show', { user: mentioner.id })}
        className="flex items-start justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        title={`Perfil de ${mentioner.name}`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {mentioner.profile_image ? (
              <img
                src={mentioner.profile_image.path_small}
                alt={`${mentioner.name} avatar`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-base font-bold leading-none font-mono">
                ?
              </div>
            )}
          </div>
          <div className="text-white text-sm leading-snug">
            <strong>{mentioner.name}</strong> te mencionó en una publicación.
          </div>
        </div>
        <FontAwesomeIcon icon={faAt} className="text-purple-300 w-7 h-7 flex-shrink-0 ml-2 mt-1" />
      </Link>

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
