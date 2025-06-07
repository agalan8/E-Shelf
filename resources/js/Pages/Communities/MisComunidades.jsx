import React, { useState, useMemo } from 'react';
import Community from '@/Components/Communities/Community';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Communities/Create';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function MisComunidades({ communities, user }) {
  const [showModal, setShowModal] = useState(false);

  // Estados para ordenar
  const [sortUsers, setSortUsers] = useState('none'); // 'asc' | 'desc' | 'none'
  const [sortPosts, setSortPosts] = useState('none'); // 'asc' | 'desc' | 'none'

  // Comunidades ordenadas según select
  const sortedCommunities = useMemo(() => {
    let sorted = [...communities];

    if (sortUsers !== 'none') {
      sorted.sort((a, b) => {
        const diff = a.getTotalMembers - b.getTotalMembers;
        return sortUsers === 'asc' ? diff : -diff;
      });
    }

    if (sortPosts !== 'none') {
      sorted.sort((a, b) => {
        const diff = a.getTotalPosts - b.getTotalPosts;
        return sortPosts === 'asc' ? diff : -diff;
      });
    }

    return sorted;
  }, [communities, sortUsers, sortPosts]);

  // Separar comunidades en dos grupos después de ordenar
  const administradas = sortedCommunities.filter(c => c.user.id === user.id);
  const miembro = sortedCommunities.filter(c => c.user.id !== user.id);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Mis Comunidades
        </h2>
      }
      subnav={<UsersSubnav currentUser={user} />}
    >
      {/* Controles de filtrado y botón crear comunidad */}
      <div className="flex justify-between items-center px-4 mb-4 my-5">
        <div className="flex space-x-4">
          <select
            value={sortUsers}
            onChange={(e) => setSortUsers(e.target.value)}
            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
          >
            <option value="none">Ordenar por usuarios</option>
            <option value="asc">Menos usuarios</option>
            <option value="desc">Más usuarios</option>
          </select>

          <select
            value={sortPosts}
            onChange={(e) => setSortPosts(e.target.value)}
            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
          >
            <option value="none">Ordenar por publicaciones</option>
            <option value="asc">Menos publicaciones</option>
            <option value="desc">Más publicaciones</option>
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Crear comunidad
        </button>
      </div>

      {/* Comunidades que administras */}
      <div className="px-4 mb-4 mt-10">
        <h3 className="text-lg font-semibold text-white mb-2">
          Comunidades que administras
        </h3>
        {administradas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {administradas.map((community) => (
              <Community key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-white text-sm">No administras ninguna comunidad.</p>
        )}
      </div>

      {/* Comunidades a las que perteneces */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Comunidades a las que perteneces
        </h3>
        {miembro.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {miembro.map((community) => (
              <Community key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-white text-sm">No perteneces a ninguna comunidad.</p>
        )}
      </div>

      {/* Modal para crear nueva comunidad */}
      {showModal && <Create onClose={() => setShowModal(false)} />}
    </AuthenticatedLayout>
  );
}
