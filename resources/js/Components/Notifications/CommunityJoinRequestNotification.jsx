import { Link, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default function CommunityJoinRequestNotification({
  requester,
  community,
  notification_id,
  isHiding,
  startHide,
  onRemove,
}) {
  const handleAccept = () => {
    startHide();
    setTimeout(() => {
      router.post(
        route('communities.accept'),
        {
          community_id: community.id,
          user_id: requester.id,
          notification_id: notification_id,
        },
        {
          preserveScroll: true,
          onSuccess: onRemove,
        }
      );
    }, 300);
  };

  const handleReject = () => {
    startHide();
    setTimeout(() => {
      router.post(
        route('communities.deny'),
        {
          community_id: community.id,
          user_id: requester.id,
          notification_id: notification_id,
        },
        {
          preserveScroll: true,
          onSuccess: onRemove,
        }
      );
    }, 300);
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${isHiding ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <Link
        href={route('users.show', { user: requester.id })}
        className="flex items-start justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        title={`Perfil de ${requester.name}`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {requester.profile_image ? (
              <img
                src={requester.profile_image.path_small}
                alt={`${requester.name} avatar`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-base font-bold leading-none font-mono">
                ?
              </div>
            )}
          </div>
          <div className="text-white text-sm leading-snug">
            <strong>{requester.name}</strong> ha solicitado unirse a{" "}
            <strong>{community.nombre}</strong>.
          </div>
        </div>
        <FontAwesomeIcon
          icon={faUsers}
          className="text-purple-300 w-7 h-7 flex-shrink-0 ml-2 mt-1"
        />
      </Link>

      <div className="flex space-x-3 mt-2 px-2">
        <button
          onClick={handleAccept}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-3 py-1 rounded transition"
        >
          Aceptar
        </button>
        <button
          onClick={handleReject}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded transition"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
