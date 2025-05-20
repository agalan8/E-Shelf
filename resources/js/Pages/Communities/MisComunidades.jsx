import React, { useState } from 'react';
import Community from '@/Components/Communities/Community';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Communities/Create';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';

export default function MisComunidades({ communities, user }) {
  const [showModal, setShowModal] = useState(false);

  // Separar comunidades en dos grupos
  const administradas = communities.filter(c => c.user.id === user.id);
  const miembro = communities.filter(c => c.user.id !== user.id);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Mis Comunidades
        </h2>
      }
      subnav={<UsersSubnav currentUser={user} />}
    >
      {/* Botón para crear comunidad */}
      <div className="flex justify-end px-4 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Crear comunidad
        </button>
      </div>

      {/* Grupos que administras */}
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Grupos que administras
        </h3>
        {administradas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {administradas.map((community) => (
              <Community key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-white text-sm">No administras ningún grupo.</p>
        )}
      </div>

      {/* Grupos a los que perteneces */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Grupos a los que perteneces
        </h3>
        {miembro.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {miembro.map((community) => (
              <Community key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-white text-sm">No perteneces a ningún grupo.</p>
        )}
      </div>

      {/* Modal para crear nueva comunidad */}
      {showModal && <Create onClose={() => setShowModal(false)} />}
    </AuthenticatedLayout>
  );
}
