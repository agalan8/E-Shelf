import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Album from '@/Components/Albums/Album';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Create from '@/Components/Albums/Create';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPanorama, faCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';

const MisAlbums = ({ albums, posts, user }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [order, setOrder] = useState('recent');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // Extraer años únicos desde albums
  const albumYears = useMemo(() => {
    const yearSet = new Set();
    albums.forEach(album => {
      const year = new Date(album.created_at).getFullYear();
      yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [albums]);

  const months = [
    { value: '', label: 'Todos' },
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const filteredAndSortedAlbums = albums
    .filter((album) => {
      const date = new Date(album.created_at);
      const albumYear = String(date.getFullYear());
      const albumMonth = String(date.getMonth() + 1).padStart(2, '0');
      const matchesYear = filterYear ? albumYear === filterYear : true;
      const matchesMonth = filterMonth ? albumMonth === filterMonth : true;
      return matchesYear && matchesMonth;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === 'recent' ? dateB - dateA : dateA - dateB;
    });

  return (
    <AuthenticatedLayout
      header={<h2 className="font-base leading-tight text-white">Mis Álbumes</h2>}
      subnav={<UsersSubnav currentUser={user} />}
    >
      <Head title="Mis Álbumes" />
      <div className="container mx-auto p-4">
        {albums.length > 0 && (
          <div className="flex justify-between items-center my-5">
            {/* Filtros */}
            <div className="flex space-x-4 items-center">
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="bg-[#292B2F] text-white rounded-md px-3 py-2 border border-gray-600"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-[#292B2F] text-white rounded-md px-3 py-2 border border-gray-600"
              >
                <option value="">Todos los años</option>
                {albumYears.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-[#292B2F] text-white rounded-md px-3 py-2 border border-gray-600"
              >
                {months.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Botón de crear */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Álbum
            </button>
          </div>
        )}

        {/* Si no hay álbumes */}
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
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-20 max-w-[1400px] mx-auto justify-items-center">
            {filteredAndSortedAlbums.map((album) => (
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
