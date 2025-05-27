import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faImage, faPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import Image from '@/Components/Image';
import Post from '@/Components/Posts/Post';

const Show = ({ community, auth, posts, tags }) => {
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  const isMemberInitial =  community.memberships.some(membership => membership.user_id === auth.user.id && membership.community_role_id === 3);

  const [isMember, setIsMember] = useState(isMemberInitial);
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);

  const canEdit = auth.user && (auth.user.is_admin || auth.user.id === community.user_id);

  const handleJoinLeave = () => {
    if (!auth.user) return;
    setLoading(true);

    const url = isMember
      ? route('communities.leave', community.id)
      : route('communities.join', community.id);

    router.post(url, {}, {
      preserveScroll: true,
      onSuccess: () => setIsMember(!isMember),
      onFinish: () => setLoading(false),
    });
  };

  const renderJoinButton = () => {
    if (!auth.user || canEdit) return null;

    return (
      <button
        onClick={handleJoinLeave}
        disabled={loading}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`w-24 flex items-center justify-center space-x-1 px-1 py-1.5 rounded border-2 text-base whitespace-nowrap transition-all duration-200
          ${isMember
            ? 'bg-white text-[#9C7FB3] font-extrabold border-[#876aa0] hover:bg-[#FDECEA] hover:text-red-600 hover:border-red-500'
            : 'bg-[#9C7FB3] text-white font-extrabold hover:bg-[#876aa0] border-transparent'}
          `}
        title={isMember ? (hovering ? 'Salir de la comunidad' : 'Unido') : 'Unirse a la comunidad'}
      >
        {loading ? (
          '...'
        ) : isMember ? (
          <>
            <FontAwesomeIcon
              icon={hovering ? faXmark : faCheck}
              className="w-4 h-4 transition-all duration-200"
            />
            <span>{hovering ? 'Salir' : 'Unido'}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            <span>Unirse</span>
          </>
        )}
      </button>
    );
  };

  return (
    <Layout>
      <div className="community-profile">
        {/* Fondo de portada */}
        <div className="w-full h-[350px] overflow-hidden flex items-center justify-center relative">
          {community.background_image?.path_original ? (
            <Image
              src={`${community.background_image.path_original}?t=${Date.now()}`}
              alt="Fondo de comunidad"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#7A27BC]" />
          )}

          {/* Franja con efecto blur */}
          <div className={`absolute bottom-0 left-0 w-full py-3 px-6 flex items-center gap-6
            ${community.background_image ? 'bg-black/50 backdrop-blur-sm' : 'bg-[#2d2e38]'}`}
          >
            {/* Imagen de perfil */}
            {community.profile_image?.path_small ? (
              <Image
                src={`${community.profile_image.path_small}?t=${Date.now()}`}
                alt={community.nombre}
                className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div
                className="w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-400 flex items-center justify-center text-white text-4xl"
                title="Sin imagen"
              >
                ?
              </div>
            )}

            {/* Contadores */}
            <div className="flex gap-8">
              <div className="text-center text-white">
                <p className="font-semibold">{community.getTotalMembers}</p>
                <p className="text-base">Miembros</p>
              </div>
              <div className="text-center text-white">
                <p className="font-semibold">{community.getTotalPosts}</p>
                <p className="text-base">Publicaciones</p>
              </div>
            </div>

            {/* Botón de unirse/salir */}
            {renderJoinButton()}
          </div>
        </div>
      </div>

      {/* Publicaciones de la comunidad */}
      <div className="mt-1">
        {posts.length === 0 ? (
          <p className="text-gray-500">Esta comunidad no tiene publicaciones aún.</p>
        ) : (
          <div className="flex gap-1">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1 flex-1">
                {posts
                  .filter((_, index) => index % 3 === colIndex)
                  .map((post) => (
                    <Post
                      key={post.id}
                      isLikedByUser={post.isLikedByUser}
                      getTotalLikes={post.getTotalLikes}
                      isSharedByUser={post.isSharedByUser}
                      getTotalShares={post.getTotalShares}
                      post={post}
                      tags={tags}
                    />
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
