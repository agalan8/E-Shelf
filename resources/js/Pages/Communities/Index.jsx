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

  // Estados para ordenar
  const [sortPrice, setSortPrice] = useState('none'); // no aplica aquí, pero puedes adaptar si quieres
  const [sortDate, setSortDate] = useState('none');   // idem
  const [sortUsers, setSortUsers] = useState('none'); // 'asc' | 'desc' | 'none'
  const [sortPosts, setSortPosts] = useState('none'); // 'asc' | 'desc' | 'none'

  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  // Ordenar comunidades según los select
  const sortedCommunities = useMemo(() => {
    let sorted = [...communities];

    // Ordenar por usuarios
    if (sortUsers !== 'none') {
      sorted.sort((a, b) => {
        const diff = a.getTotalMembers - b.getTotalMembers;
        return sortUsers === 'asc' ? diff : -diff;
      });
    }

    // Ordenar por posts
    if (sortPosts !== 'none') {
      sorted.sort((a, b) => {
        const diff = a.getTotalPosts - b.getTotalPosts;
        return sortPosts === 'asc' ? diff : -diff;
      });
    }

    return sorted;
  }, [communities, sortUsers, sortPosts]);

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
        <div className="flex justify-between items-center px-4 mb-4">

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
            className="bg-purple-600 text-white px-4 py-2 my-5 rounded hover:bg-purple-500 transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Crear Comunidad
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 px-4 justify-items-center">
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
