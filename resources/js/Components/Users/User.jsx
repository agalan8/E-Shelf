import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import Image from '../Image';

export default function User({ user }) {
  const { auth } = usePage().props;
  const [following, setFollowing] = useState(auth.user?.following?.some(f => f.id === user.id));
  const [hovering, setHovering] = useState(false);

  const handleFollowToggle = (e) => {
    e.stopPropagation();

    if (!auth.user) return;

    if (following) {
      router.delete(`/unfollow/${user.id}`, {
        onSuccess: () => setFollowing(false),
        preserveScroll: true
      });
    } else {
      router.post('/follow', { followed_user_id: user.id }, {
        onSuccess: () => setFollowing(true),
        preserveScroll: true
      });
    }
  };

  const renderFollowIcon = () => {
    if (!auth.user || auth.user.id === user.id) return null;

    let icon = faUserPlus;
    let color = 'text-white';
    let title = 'Seguir';

    if (following) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? 'text-red-500' : 'text-purple-500';
      title = hovering ? 'Dejar de seguir' : 'Siguiendo';
    }

    return (
      <button
        onClick={handleFollowToggle}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`text-3xl cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
        type="button"
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  };

  return (
    <Link
      href={route('users.show', { user: user.id })}
      className="max-w-sm rounded overflow-hidden shadow-2xl shadow-black bg-[#1A1D1F] cursor-pointer block"
    >
      <div className="relative">
        {user.background_image && user.background_image.path_original ? (
          <Image
            className="w-full h-32 object-cover"
            src={`${user.background_image.path_original}?t=${new Date().getTime()}`}
            alt="Background"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200" />
        )}

        <div className="absolute top-16 left-4">
          {user.profile_image && user.profile_image.path_small ? (
            <Image
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
              alt="Profile Image"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-gray-500 text-2xl">
              ?
            </div>
          )}
        </div>
      </div>

      <div className="pt-10 pl-5 pb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{user.name}</h2>

        <div className="ml-4 flex-shrink-0 mr-10 mb-1">
          {renderFollowIcon()}
        </div>
      </div>
    </Link>
  );
}
