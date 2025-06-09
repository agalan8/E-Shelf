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
  const [searchName, setSearchName] = useState('');

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
      const matchesName = searchName.trim() === ''
        ? true
        : album.nombre?.toLowerCase().includes(searchName.trim().toLowerCase());
      return matchesYear && matchesMonth && matchesName;
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
      <div className="container mx-auto p-2 sm:p-4">
        {albums.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-3 sm:my-5 gap-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
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

              {/* Campo de búsqueda por título */}
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Buscar por nombre"
                className="bg-[#292B2F] text-white rounded-md px-3 py-2 border border-gray-600 w-full sm:w-64"
              />
            </div>

            {/* Botón de crear */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Álbum
            </button>
          </div>
        )}

        {/* Si no hay álbumes */}
        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 sm:h-96 text-white mt-12 sm:mt-24">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative text-gray-400 transition-colors"
              title="Crear Álbum"
            >
              <FontAwesomeIcon
                icon={faPanorama}
                className="w-40 h-40 sm:w-80 sm:h-80 transition-transform duration-200 group-hover:scale-105"
              />
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="absolute bottom-2 -right-2 sm:bottom-9 sm:-right-4 w-10 h-10 sm:w-20 sm:h-20 border-4 border-[#373841] rounded-full bg-[#373841] text-[#E0B0FF] text-opacity-60 transition-transform duration-200 group-hover:scale-110"
              />
            </button>
            <p className="mt-4 text-base sm:text-lg text-center">No tienes álbumes aún. ¡Haz clic en el icono para crear uno!</p>
          </div>
        ) : (
          <div className="mt-6 sm:mt-12 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10 sm:gap-2 sm:gap-y-20 max-w-full sm:max-w-[1400px] mx-auto justify-items-center">
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
