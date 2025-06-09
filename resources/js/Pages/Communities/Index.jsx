import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Community from '@/Components/Communities/Community';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Communities/Create';
import { Head } from '@inertiajs/react';

export default function Index({ communities, auth }) {
  const [showModal, setShowModal] = useState(false);

  const [sortUsers, setSortUsers] = useState('none');
  const [sortPosts, setSortPosts] = useState('none');
  const [searchName, setSearchName] = useState('');

  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

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

    if (searchName.trim() !== '') {
      sorted = sorted.filter(c =>
        c.nombre?.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    }

    return sorted;
  }, [communities, sortUsers, sortPosts, searchName]);

  return (
    <Layout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Comunidades
        </h2>
      }
    >
        <Head title="Comunidades" />
      {auth.user && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 sm:px-4 mb-4 gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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

            {/* Campo de búsqueda por nombre de comunidad */}
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Buscar por nombre"
              className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 my-2 sm:my-5 rounded hover:bg-purple-500 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FontAwesomeIcon icon={faPlus} />
            Crear Comunidad
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 sm:gap-x-6 gap-y-6 sm:gap-y-12 px-2 sm:px-4 justify-items-center">
        {sortedCommunities.length > 0 ? (
          sortedCommunities.map((community) => (
            <Community key={community.id} community={community} />
          ))
        ) : (
          <div className="col-span-full text-center text-white">
            No hay comunidades disponibles.
          </div>
        )}
      </div>

      {showModal && <Create onClose={() => setShowModal(false)} />}
    </Layout>
  );
}
