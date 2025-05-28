import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersSlash } from '@fortawesome/free-solid-svg-icons';

export default function CommunityDeniedNotification({ community }) {
  return (
    <div className="flex items-start justify-between bg-gray-700 p-2 rounded transition-colors">
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
          Tu solicitud para unirte a <strong>{community.nombre}</strong> fue rechazada.
        </div>
      </div>
      <FontAwesomeIcon
        icon={faUsersSlash}
        className="text-red-400 w-7 h-7 flex-shrink-0 ml-2 mt-1"
      />
    </div>
  );
}
