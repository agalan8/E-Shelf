import React, { useState } from "react";
import { router, Link, Head } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserMinus,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestPageLayout from "@/Layouts/GuestPageLayout";
import UsersSubnav from "@/Components/Subnavs/UsersSubnav";
import Image from "@/Components/Image";
import Post from "@/Components/Posts/Post";
import FollowersModal from "@/Components/Users/FollowersModal";
import FollowingModal from "@/Components/Users/FollowingModal";

const Show = ({ user, auth, totalFollowing, totalFollowers, posts, tags }) => {
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  const isFollowingInitial = auth.user?.following?.some(
    (f) => f.id === user.id
  );
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
      router.post(
        "/follow",
        { followed_user_id: user.id },
        {
          onSuccess: () => setFollowing(true),
          preserveScroll: true,
        }
      );
    }
  };

  const renderIcon = () => {
    if (!auth.user || auth.user.id === user.id) return null;

    let icon = faUserPlus;
    let color = "text-blue-500";
    let title = "Seguir";

    if (followingState) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? "text-red-500" : "text-green-500";
      title = hovering ? "Dejar de seguir" : "Siguiendo";
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

  // URLs de iconos para redes sociales (puedes cambiar por otros enlaces si quieres)
  const socialIconUrls = {
    instagram:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png",
    twitter:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg",
    facebook:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg",
    linkedin:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
  };

  return (
    <Layout subnav={<UsersSubnav currentUser={user} />}>
      <Head title={user.name} />
      <div className="user-profile">
        {/* Fondo de portada */}
        <div
          className={`w-full overflow-hidden flex items-center justify-center bg-white relative ${
            user.background_image?.path_original ? "h-[500px]" : "h-[198px]"
          }`}
        >
          {user.background_image?.path_original ? (
            <Image
              src={`${user.background_image.path_original}?t=${new Date().getTime()}`}
              alt="Fondo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}

          {/* Franja inferior con imagen, datos y redes sociales */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center py-6 px-6">
            <div className="flex items-center gap-6">
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
              <div className="flex items-center gap-8 ml-8">
                {/* Seguidores */}
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <p className="font-semibold text-white">{totalFollowers}</p>
                  <p className="text-base text-white">Seguidores</p>
                </div>

                {/* Siguiendo */}
                <div
                  className="text-center cursor-pointer"
                  onClick={() => setShowFollowingModal(true)}
                >
                  <p className="font-semibold text-white">{totalFollowing}</p>
                  <p className="text-base text-white">Seguidos</p>
                </div>
              </div>

              {/* Botón seguir */}
              <div className="flex items-center">{renderIcon()}</div>
            </div>

            {/* Separador flexible */}
            <div className="flex-grow" />

            {/* Redes sociales */}
            <div className="flex flex-col items-start gap-2 mr-24">
              {user.socials?.map((social) => {
                const iconUrl = socialIconUrls[social.nombre.toLowerCase()] || null;
                let url = "#";

                switch (social.nombre.toLowerCase()) {
                  case "instagram":
                    url = `https://instagram.com/${social.pivot.perfil}`;
                    break;
                  case "twitter":
                    url = `https://twitter.com/${social.pivot.perfil}`;
                    break;
                  case "facebook":
                    url = `https://facebook.com/${social.pivot.perfil}`;
                    break;
                  case "linkedin":
                    url = `https://linkedin.com/in/${social.pivot.perfil}`;
                    break;
                  default:
                    url = social.pivot.perfil; // fallback
                }

                return (
                  <a
                    key={social.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline text-lg font-semibold flex items-center gap-2"
                    title={social.nombre}
                  >
                    {iconUrl && (
                      <img
                        src={iconUrl}
                        alt={`${social.nombre} icon`}
                        className="w-5 h-5"
                      />
                    )}
                    {social.nombre}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Publicaciones */}
      <div className="mt-1">
        {posts.length === 0 ? (
          <p className="text-white my-8 ml-5">
            Este usuario no tiene publicaciones aún.
          </p>
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
