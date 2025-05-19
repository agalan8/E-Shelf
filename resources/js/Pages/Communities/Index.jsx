import React, { useState } from 'react';
import Community from '@/Components/Communities/Community';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Communities/Create';

export default function Index({ communities, auth }) {
  const [showModal, setShowModal] = useState(false);
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  return (
    <Layout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Comunidades
        </h2>
      }
    >
      {/* Botón fuera del layout, pero dentro del contenido de la página */}
      {auth.user && (
        <div className="flex justify-end px-4 mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Crear comunidad
          </button>
        </div>
      )}

      {/* Grid de comunidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {communities.length > 0 ? (
          communities.map((community) => (
            <Community key={community.id} community={community} />
          ))
        ) : (
          <div className="col-span-full text-center text-white">
            No hay comunidades disponibles.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <Create onClose={() => setShowModal(false)} />}
    </Layout>
  );
}
