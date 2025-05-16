import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import Image from '@/Components/Image';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post'; // Importamos el componente de Post

const Show = ({ user, auth, followers, following, posts, tags }) => {
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  const isFollowingInitial = auth.user?.following?.some(f => f.id === user.id);
  const [followingState, setFollowing] = useState(isFollowingInitial);
  const [hovering, setHovering] = useState(false);

  console.log('posts:',posts)

  const handleFollowToggle = () => {
    if (!auth.user) return;

    if (followingState) {
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

  const renderIcon = () => {
    if (!auth.user || auth.user.id === user.id) return null;

    let icon = faUserPlus;
    let color = 'text-blue-500';
    let title = 'Seguir';

    if (followingState) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? 'text-red-500' : 'text-green-500';
      title = hovering ? 'Dejar de seguir' : 'Siguiendo';
    }

    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`text-4xl cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
      />
    );
  };

  return (
    <Layout subnav={<UsersSubnav currentUser={user} />}>
      <div className="user-profile">
        {/* Fondo de portada - Se extiende hasta el contenedor de las publicaciones */}
        <div className="w-full h-[500px] overflow-hidden flex items-center justify-center bg-white relative">
          {user.background_image?.path_original ? (
            <Image
              src={`${user.background_image.path_original}?t=${new Date().getTime()}`}
              alt="Fondo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}

          {/* Franja con efecto blur */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center py-6">
            <div className="flex items-center gap-6 ml-6">
              {/* Imagen de perfil */}
              {user.profile_image?.path_small ? (
                <Image
                  src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
                  alt={user.name}
                  className="w-[150px] h-[150px] rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div
                  className="w-[150px] h-[150px] rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 text-4xl"
                  title="Sin imagen"
                >
                  ?
                </div>
              )}

              {/* Contadores de Seguidores y Seguidos */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="font-semibold text-white">{followers}</p>
                  <p className="text-base text-white">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">{following}</p>
                  <p className="text-base text-white">Siguiendo</p>
                </div>
              </div>

              {/* Icono de seguir */}
              <div className="flex items-center">
                {renderIcon()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mis publicaciones debajo de la biografía */}
      <div className="mt-1">
        {posts.length === 0 ? (
          <p>No tienes publicaciones aún.</p>
        ) : (
          <div className="flex gap-1">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1 flex-1">
                {posts
                  .filter((_, index) => index % 3 === colIndex)
                  .map((post) => (
                    <Post key={post.posteable.id} isLikedByUser={post.isLikedByUser} getTotalLikes={post.getTotalLikes} isSharedByUser={post.isSharedByUser} getTotalShares={post.getTotalShares} post={post.posteable} tags={tags} />
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Show;
