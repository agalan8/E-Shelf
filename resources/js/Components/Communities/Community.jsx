import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PencilIcon as PencilSolid } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGroup,
  faImage,
  faPlus,
  faCheck,
  faXmark,
  faTrash,
  faLock,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import Edit from './Edit';

export default function Community({ community }) {
  const { auth } = usePage().props;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // Para mostrar "Solicitud enviada"

  const canEdit = auth.user && (auth.user.is_admin || auth.user.id === community.user_id);
  const isMember = community.memberships.some(
    (membership) =>
      membership.user_id === auth.user.id &&
      (membership.community_role_id === 3 || membership.community_role_id === 2)
  );
  const isPending = community.memberships.some(
    (membership) => membership.user_id === auth.user.id && membership.community_role_id === 4
  );
  const isOwner = auth.user && auth.user.id === community.user_id;

  const isPrivate = community.visibilidad === 'privado';

  const showRequestSent = requestSent || isPending;

  const handleOpenEditModal = (e) => {
    e.stopPropagation();
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handleJoinOrRequest = (e) => {
    e.stopPropagation();
    setLoading(true);
    router.post(
      route('communities.join', community.id),
      {},
      {
        onFinish: () => {
          setLoading(false);
          if (isPrivate && !isMember) {
            setRequestSent(true);
          }
        },
        preserveScroll: true,
      }
    );
  };

  const handleLeave = (e) => {
    e.stopPropagation();
    setLoading(true);
    router.post(
      route('communities.leave', community.id),
      {},
      {
        onFinish: () => setLoading(false),
        preserveScroll: true,
      }
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar esta comunidad?')) {
      router.delete(route('communities.destroy', community.id), {
        preserveScroll: true,
      });
    }
  };

  const handleCardClick = () => {
    // Solo permitir clic si es pública o es miembro o dueño
    if (!isPrivate || isMember || isOwner) {
      router.visit(route('communities.show', community.id));
    }
  };

  return (
    <>
      <div
        className={`relative w-[500px] h-60 rounded-2xl overflow-hidden shadow-xl shadow-gray-900 group transition
          ${
            !isPrivate || isMember || isOwner
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-70'
          }
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCardClick}
      >
        {/* Fondo */}
        <div
          className={`w-full h-full bg-cover bg-center ${
            !community.background_image && 'bg-gray-200'
          }`}
          style={{
            backgroundImage: community.background_image
              ? `url(${community.background_image.path_medium})`
              : 'none',
          }}
        />

        {/* Botones de editar/eliminar */}
        {canEdit && (
          <div
            className={`absolute top-3 right-3 flex space-x-2 z-10 transition-all duration-300
              ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
            `}
          >
            <button
              onClick={handleOpenEditModal}
              className="w-9 h-9 flex items-center justify-center rounded-md bg-[#7A27BC] hover:bg-opacity-100 transition-all duration-200 backdrop-blur-md transform hover:scale-110"
              aria-label="Editar comunidad"
            >
              <PencilSolid className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDelete}
              className="w-9 h-9 flex items-center justify-center rounded-md bg-[#7A27BC] hover:bg-opacity-100 transition-all duration-200 backdrop-blur-md transform hover:scale-110"
              aria-label="Eliminar comunidad"
            >
              <FontAwesomeIcon icon={faTrash} className="text-red-400 w-5 h-5" />
            </button>
          </div>
        )}

        {/* Franja inferior */}
        <div
          className={`absolute bottom-0 w-full px-4 py-2 flex items-center justify-between ${
            community.background_image ? 'bg-black/30 backdrop-blur-md' : 'bg-[#2d2e38]'
          }`}
        >
          {/* Perfil + nombre */}
          <div className="flex items-center space-x-3">
            {community.profile_image ? (
              <img
                src={community.profile_image.path_small}
                alt={`${community.nombre} perfil`}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-500 text-white text-xl font-bold flex items-center justify-center border-2 border-white shadow-sm">
                ?
              </div>
            )}
            <h3 className="text-base font-semibold text-white truncate max-w-[120px]">
              {community.nombre}
            </h3>
          </div>

          {/* Contadores + botón */}
          <div className="flex items-center justify-end space-x-4 min-w-0">
            <div className="flex items-center space-x-4 min-w-max">
              <div className="flex items-center text-white space-x-1">
                <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4" />
                <span className="text-sm">{community.getTotalMembers}</span>
              </div>
              <div className="flex items-center text-white space-x-1">
                <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
                <span className="text-sm">{community.getTotalPosts}</span>
              </div>
            </div>

            {auth.user && !isOwner && (
              <>
                {isPrivate && !isMember ? (
                  <button
                    onClick={handleJoinOrRequest}
                    disabled={loading || showRequestSent}
                    className="flex items-center justify-center space-x-2 px-3 py-2 rounded border-2 bg-purple-400 text-white font-extrabold border-transparent hover:bg-purple-600 transition-all duration-200 max-w-[180px] min-w-[140px] whitespace-normal break-words text-center"
                  >
                    <FontAwesomeIcon
                      icon={showRequestSent ? faClock : faLock}
                      className="w-4 h-4"
                    />
                    <span>{showRequestSent ? 'Solicitud enviada' : 'Solicitar unirse'}</span>
                  </button>
                ) : (
                  <button
                    onClick={isMember ? handleLeave : handleJoinOrRequest}
                    disabled={loading}
                    onMouseEnter={() => setButtonHovered(true)}
                    onMouseLeave={() => setButtonHovered(false)}
                    className={`w-24 flex items-center justify-center space-x-1 px-1 py-1.5 rounded border-2 text-base whitespace-nowrap transition-all duration-200
                      ${
                        isMember
                          ? 'bg-white text-[#9C7FB3] font-extrabold border-[#876aa0] hover:bg-[#FDECEA] hover:text-red-600 hover:border-red-500'
                          : 'bg-[#9C7FB3] text-white font-extrabold hover:bg-[#876aa0] border-transparent'
                      }
                      `}
                  >
                    {loading ? (
                      '...'
                    ) : isMember ? (
                      <>
                        <FontAwesomeIcon
                          icon={buttonHovered ? faXmark : faCheck}
                          className="w-4 h-4 transition-all duration-200"
                        />
                        <span>{buttonHovered ? 'Salir' : 'Unido'}</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        <span>Unirse</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {editModalOpen && <Edit community={community} onClose={handleCloseEditModal} />}
    </>
  );
}
