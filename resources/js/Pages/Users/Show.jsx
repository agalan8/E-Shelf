import React, { useState, useMemo } from "react";
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

  const [sortCreatedAt, setSortCreatedAt] = useState("none");
  const [sortFechaCaptura, setSortFechaCaptura] = useState("none");
  const [searchTitle, setSearchTitle] = useState("");

  function parseFechaHora(fechaStr) {
    if (!fechaStr) return new Date(0);
    // Convierte "2024:07:27 19:34:45" a "2024-07-27T19:34:45"
    const [fecha, hora] = fechaStr.split(' ');
    if (!fecha || !hora) return new Date(0);
    const partes = fecha.split(':');
    if (partes.length !== 3) return new Date(0);
    const isoString = `${partes[0]}-${partes[1]}-${partes[2]}T${hora}`;
    return new Date(isoString);
  }

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchTitle.trim() !== "") {
      filtered = filtered.filter((post) =>
        post.posteable.titulo
          ?.toLowerCase()
          .includes(searchTitle.trim().toLowerCase())
      );
    }

    if (sortCreatedAt !== "none") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.posteable.created_at);
        const dateB = new Date(b.posteable.created_at);
        return sortCreatedAt === "asc"
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    if (sortFechaCaptura !== "none") {
      filtered.sort((a, b) => {
        const fechaA = a.posteable.image?.fecha_hora
          ? parseFechaHora(a.posteable.image.fecha_hora)
          : new Date(0);
        const fechaB = b.posteable.image?.fecha_hora
          ? parseFechaHora(b.posteable.image.fecha_hora)
          : new Date(0);
        return sortFechaCaptura === "asc"
          ? fechaA - fechaB
          : fechaB - fechaA;
      });
    }

    return filtered;
  }, [posts, sortCreatedAt, sortFechaCaptura, searchTitle]);

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
    let color = "text-white";
    let title = "Seguir";

    if (followingState) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? "text-red-500" : "text-purple-500";
      title = hovering ? "Dejar de seguir" : "Siguiendo";
    }

    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`text-5xl ml-8 cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
      />
    );
  };

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
    <Layout
      subnav={<UsersSubnav currentUser={user} />}
      header={
        <h2 className=" font-semibold leading-tight text-white">
          Publicaciones
        </h2>
      }
    >
      <Head title="Publicaciones" />

      <div className="user-profile">
        {/* Fondo de portada */}
        <div
          className={`w-full overflow-hidden flex items-center justify-center bg-white relative ${
            user.background_image?.path_original ? "h-[300px] sm:h-[500px]" : "h-[120px] sm:h-[198px]"
          }`}
        >
          {user.background_image?.path_original ? (
            <Image
              src={`${user.background_image.path_original}?t=${new Date().getTime()}`}
              alt="Fondo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600" />
          )}

          {/* Franja inferior con imagen, datos y redes sociales */}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-sm flex flex-col sm:flex-row items-center py-4 sm:py-6 px-2 sm:px-6 gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Imagen de perfil */}
              {user.profile_image?.path_small ? (
                <Image
                  src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
                  alt={user.name}
                  className="w-[90px] h-[90px] sm:w-[150px] sm:h-[150px] rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div
                  className="w-[90px] h-[90px] sm:w-[150px] sm:h-[150px] rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 text-4xl"
                  title="Sin imagen"
                >
                  ?
                </div>
              )}

              {/* Contadores */}
              <div className="flex gap-6 sm:gap-8 ml-0 sm:ml-8 mt-2 sm:mt-0">
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
              <div className="flex items-center mt-2 sm:mt-0">{renderIcon()}</div>
            </div>

            {/* Separador flexible */}
            <div className="hidden sm:flex flex-grow" />

            {/* Redes sociales */}
            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:mr-24 mt-2 sm:mt-0">
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
                    url = social.pivot.perfil;
                }

                return (
                  <a
                    key={social.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline text-base sm:text-lg font-semibold flex items-center gap-2"
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

      {/* Controles de filtrado y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-4 mb-4 my-5">
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
          <select
            value={sortCreatedAt}
            onChange={(e) => setSortCreatedAt(e.target.value)}
            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
          >
            <option value="none">Ordenar por fecha de publicación</option>
            <option value="asc">Más antiguos primero</option>
            <option value="desc">Más recientes primero</option>
          </select>

          <select
            value={sortFechaCaptura}
            onChange={(e) => setSortFechaCaptura(e.target.value)}
            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
          >
            <option value="none">Ordenar por fecha de captura</option>
            <option value="asc">Más antiguos primero</option>
            <option value="desc">Más recientes primero</option>
          </select>
        </div>
        <input
          type="text"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Buscar por título"
          className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full sm:w-64"
        />
      </div>

      {/* Publicaciones */}
      <div className="mt-1">
        {filteredAndSortedPosts.length === 0 ? (
          <p className="text-white my-8 ml-2 sm:ml-5 text-center sm:text-left">
            Este usuario no tiene publicaciones aún.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-1">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-1 flex-1">
                {filteredAndSortedPosts
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
