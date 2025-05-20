import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Album from '@/Components/Albums/Album';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Albums/Create';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPanorama, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const MisAlbums = ({ albums, posts, user }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  console.log('posts:', posts);

  return (
    <AuthenticatedLayout
      header={<h2 className="font-base leading-tight text-white">Mis Álbumes</h2>}
      subnav={<UsersSubnav currentUser={user} />}
    >
      <Head title="Mis Álbumes" />
      <div className="container mx-auto p-4">
        {albums.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Crear Álbum
            </button>
          </div>
        )}

        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-white mt-24">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative text-gray-400 transition-colors"
              title="Crear Álbum"
            >
              <FontAwesomeIcon
                icon={faPanorama}
                className="w-80 h-80 transition-transform duration-200 group-hover:scale-105"
              />
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="absolute bottom-9 -right-4 w-20 h-20 border-4 border-[#373841] rounded-full bg-[#373841] text-[#E0B0FF] text-opacity-60 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
            <p className="mt-4 text-lg">No tienes álbumes aún. ¡Haz clic en el icono para crear uno!</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-20 max-w-[1400px] mx-auto justify-items-center">
            {albums.map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && <Create onClose={() => setIsCreateModalOpen(false)} posts={posts} />}
    </AuthenticatedLayout>
  );
};

export default MisAlbums;
