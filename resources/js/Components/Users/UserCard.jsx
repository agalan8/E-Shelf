// resources/js/Components/Users/UserCard.jsx
import React from 'react';
import Image from '@/Components/Image';
import { Link } from '@inertiajs/react';

const UserCard = ({ user }) => {
  const hasProfileImage = Boolean(user.profile_image?.path_small);
  const hasBackgroundImage = Boolean(user.background_image?.path_original);

  return (
    <Link
      href={`/users/${user.id}`}
      className="relative flex items-center gap-4 p-4 rounded-lg overflow-hidden transition duration-200 hover:brightness-110"
      style={{
        backgroundImage: hasBackgroundImage ? `url(${user.background_image.path_original})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro para legibilidad */}
      {hasBackgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-60 pointer-events-none rounded-lg" />
      )}

      {/* Contenido encima */}
      <div className="relative flex items-center gap-4 z-10">
        {hasProfileImage ? (
          <Image
            src={user.profile_image.path_small}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl border-2 border-white">
            ?
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{user.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
