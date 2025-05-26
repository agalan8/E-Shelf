import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

export default function FollowNotification({ follower }) {
  return (
    <Link
      href={route('users.show', { user: follower.id })}
      className="flex items-start justify-between hover:bg-gray-700 p-2 rounded transition-colors"
    >
      <div className="flex items-start space-x-3 overflow-hidden">
        <div className="flex-shrink-0">
          {follower.profile_image ? (
            <img
              src={follower.profile_image.path_small}
              alt={`${follower.name} perfil`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-base font-bold leading-none font-mono">
              ?
            </div>
          )}
        </div>
        <div className="text-white text-sm leading-snug">
          <strong>{follower.name}</strong> empezó a seguirte.
        </div>
      </div>
      <FontAwesomeIcon
        icon={faUserCheck}
        className="text-purple-300 w-7 h-7 flex-shrink-0 ml-2 mt-1"
      />
    </Link>
  );
}
