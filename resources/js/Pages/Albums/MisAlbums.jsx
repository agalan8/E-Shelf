import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Album from '@/Components/Albums/Album';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Albums/Create';

const MisAlbums = ({ albums }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Mis Álbumes</h2>}
    >
      <Head title="Mis Álbumes" />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mis Álbumes</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Crear Álbum
          </button>
        </div>

        {albums.length === 0 ? (
          <p>No tienes álbumes aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && <Create onClose={() => setIsCreateModalOpen(false)} />}
    </AuthenticatedLayout>
  );
};

export default MisAlbums;
