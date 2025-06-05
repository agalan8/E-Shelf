import React, { useState } from 'react';
import { router, Link, Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import Image from '@/Components/Image';
import Post from '@/Components/Posts/Post';
import FollowersModal from '@/Components/Users/FollowersModal';
import FollowingModal from '@/Components/Users/FollowingModal';

const Show = ({ user, auth, totalFollowing, totalFollowers, posts, tags }) => {
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  const isFollowingInitial = auth.user?.following?.some(f => f.id === user.id);
  const [followingState, setFollowing] = useState(isFollowingInitial);
  const [hovering, setHovering] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);


  const handleFollowToggle = () => {
    if (!auth.user) return;

    if (followingState) {
      router.delete(`/unfollow/${user.id}`, {
        onSuccess: () => setFollowing(false),
        preserveScroll: true,
      });
    } else {
      router.post('/follow', { followed_user_id: user.id }, {
        onSuccess: () => setFollowing(true),
        preserveScroll: true,
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
      <Head title={user.name} />
      <div className="user-profile">
        {/* Fondo de portada */}
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

          {/* Franja inferior con imagen y datos */}
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

              {/* Contadores */}
              <div className="flex items-center gap-8">
                {/* Seguidores */}
                <div className="text-center cursor-pointer" onClick={() => setShowFollowersModal(true)}>
                  <p className="font-semibold text-white">{totalFollowers}</p>
                  <p className="text-base text-white">Seguidores</p>
                </div>

                {/* Siguiendo */}
                <div className="text-center cursor-pointer" onClick={() => setShowFollowingModal(true)}>
                  <p className="font-semibold text-white">{totalFollowing}</p>
                  <p className="text-base text-white">Siguiendo</p>
                </div>
              </div>

              {/* Botón seguir */}
              <div className="flex items-center">
                {renderIcon()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publicaciones */}
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
                    <Post
                      key={post.posteable.id}
                      isLikedByUser={post.isLikedByUser}
                      getTotalLikes={post.getTotalLikes}
                      isSharedByUser={post.isSharedByUser}
                      getTotalShares={post.getTotalShares}
                      post={post.posteable}
                      tags={tags}
                    />
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de seguidores */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        followers={user.followers}
      />

      {/* Modal de siguiendo */}
      <FollowingModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        following={user.following}
      />
    </Layout>
  );
};

export default Show;
