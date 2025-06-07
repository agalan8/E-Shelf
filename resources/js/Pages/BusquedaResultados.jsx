import React from 'react';
import User from '@/Components/Users/User';
import Post from '@/Components/Posts/Post';
import Community from '@/Components/Communities/Community'; // Asegúrate de que esta ruta sea correcta
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function BusquedaResultados({ results, filter, auth, tags = [] }) {
  const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

  // Para distribuir en 3 columnas
  const columns = [0, 1, 2];

  return (
    <Layout
      header={
        <h2 className="font-semibold leading-tight text-white">
          Resultado de la búsqueda
        </h2>
      }
    >
      {results.length > 0 ? (
        filter === "Usuarios" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 p-4 ml-8">
            {results.map(user => <User key={user.id} user={user} />)}
          </div>
        ) : filter === "Publicaciones" ? (
          <div className="py-2">
            <div className="mx-auto max-w-8xl p-1">
              <div className="flex gap-2">
                {columns.map(colIndex => (
                  <div key={colIndex} className="flex flex-col gap-2 flex-1">
                    {results
                      .filter((_, index) => index % 3 === colIndex)
                      .map(post => (
                        <Post
                          key={post.id}
                          post={post}
                          postType={post.post_type || 'regular'}
                          isLikedByUser={post.isLikedByUser}
                          getTotalLikes={post.getTotalLikes}
                          isSharedByUser={post.isSharedByUser}
                          getTotalShares={post.getTotalShares}
                          tags={tags}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filter === "Comunidades" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-5">
            {results.map((community) => (
              <Community key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center text-white mt-5">
            No se encontraron resultados para {filter}.
          </div>
        )
      ) : (
        <div className="col-span-full text-center text-white mt-5">
          No se encontraron resultados.
        </div>
      )}
    </Layout>
  );
}
