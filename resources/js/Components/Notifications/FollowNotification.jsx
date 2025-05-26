import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

export default function FollowNotification({ followerName, follower_profile_image, follower_id }) {
    return (
        <Link
            href={route('users.show', { user: follower_id })}
            className="flex items-center justify-between hover:bg-gray-700 p-2 rounded transition-colors"
        >
            <div className="flex items-center space-x-3">
                {follower_profile_image ? (
                    <img
                        src={follower_profile_image}
                        alt={`${followerName} perfil`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                        ?
                    </div>
                )}
                <p className="text-white">
                    <strong>{followerName}</strong> empezó a seguirte.
                </p>
            </div>
            <FontAwesomeIcon icon={faUserCheck} className="text-purple-300 w-8 h-8" />
        </Link>
    );
}
