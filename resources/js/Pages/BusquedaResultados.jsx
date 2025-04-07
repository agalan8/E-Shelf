import React from 'react';
import User from '@/Components/Users/User';  // Importa el componente User
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BusquedaResultados({ results, filter, auth }) {

  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  return (
    <Layout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Resultado de la búsqueda
        </h2>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {results.length > 0 ? (
          filter === "Usuarios" ? (
            results
              .map((user) => (
                <User key={user.id} user={user} /> // Renderizamos el componente User para cada usuario válido
              ))
          ) : (
            // Aquí puedes agregar otras condiciones si el filtro no es "Usuarios"
            <div className="col-span-full text-center text-gray-600">No se encontraron resultados para {filter}.</div>
          )
        ) : (
          <div className="col-span-full text-center text-gray-600">No se encontraron resultados.</div>
        )}
      </div>
    </Layout>
  );
}
