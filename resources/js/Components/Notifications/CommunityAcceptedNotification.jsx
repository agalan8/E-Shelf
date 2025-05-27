import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default function CommunityAcceptedNotification({ community }) {
  return (
    <Link
      href={route('communities.show', { community: community.id })}
      className="flex items-start justify-between hover:bg-gray-700 p-2 rounded transition-colors"
    >
      <div className="flex items-start space-x-3 overflow-hidden">
        <div className="flex-shrink-0">
          {community.profile_image ? (
            <img
              src={community.profile_image.path_small}
              alt={`${community.nombre} imagen`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-base font-bold leading-none font-mono">
              C
            </div>
          )}
        </div>
        <div className="text-white text-sm leading-snug">
          Has sido aceptado en la comunidad <strong>{community.nombre}</strong>.
        </div>
      </div>
      <FontAwesomeIcon
        icon={faUsers}
        className="text-purple-300 w-7 h-7 flex-shrink-0 ml-2 mt-1"
      />
    </Link>
  );
}
