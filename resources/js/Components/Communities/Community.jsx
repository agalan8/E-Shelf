import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PencilIcon as PencilOutline } from '@heroicons/react/24/outline';
import { PencilIcon as PencilSolid } from '@heroicons/react/24/solid';
import { TrashIcon as TrashOutline } from '@heroicons/react/24/outline';
import { TrashIcon as TrashSolid } from '@heroicons/react/24/solid';
import Edit from './Edit'; // modal para editar comunidad

export default function Community({ community }) {
  const { auth } = usePage().props;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  const canEdit = auth.user && (auth.user.is_admin || auth.user.id === community.user_id);

  // Verifica si el usuario está en miembros
  const isMember = community.members.some(member => member.id === auth.user.id);

  const handleJoin = () => {
    setLoading(true);
    router.post(route('communities.join', community.id), {}, {
      onFinish: () => setLoading(false),
      preserveScroll: true,
    });
  };

  const handleLeave = () => {
    setLoading(true);
    router.post(route('communities.leave', community.id), {}, {
      onFinish: () => setLoading(false),
      preserveScroll: true,
    });
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta comunidad?')) {
      router.delete(route('communities.destroy', community.id), {
        preserveScroll: true,
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-100 hover:shadow-md transition overflow-hidden relative">
        {community.background_image && (
          <div
            className="h-32 rounded-t-2xl bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${community.background_image.path_medium})` }}
          />
        )}

        <div className="flex items-center space-x-4">
          {community.profile_image && (
            <img
              src={community.profile_image.path_small}
              alt={`${community.nombre} perfil`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white -mt-12 shadow-md"
            />
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800">{community.nombre}</h3>
            <p className="text-sm text-gray-600 mt-1">{community.descripcion}</p>
          </div>

          {canEdit && (
            <>
              <button
                onClick={handleOpenEditModal}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="ml-auto p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Editar comunidad"
              >
                {hovered ? (
                  <PencilSolid className="w-6 h-6 text-gray-700" />
                ) : (
                  <PencilOutline className="w-6 h-6 text-gray-600" />
                )}
              </button>

              <button
                onClick={handleDelete}
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
                className="p-1 ml-2 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Eliminar comunidad"
              >
                {deleteHovered ? (
                  <TrashSolid className="w-6 h-6 text-red-600" />
                ) : (
                  <TrashOutline className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </>
          )}

          {auth.user && !canEdit && (
            <button
              onClick={isMember ? handleLeave : handleJoin}
              disabled={loading}
              className={`ml-auto px-4 py-2 rounded text-white ${
                isMember ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isMember ? 'focus:ring-red-400' : 'focus:ring-green-400'
              }`}
            >
              {loading ? 'Procesando...' : isMember ? 'Salir' : 'Unirse'}
            </button>
          )}
        </div>
      </div>

      {editModalOpen && (
        <Edit community={community} onClose={handleCloseEditModal} />
      )}
    </>
  );
}
