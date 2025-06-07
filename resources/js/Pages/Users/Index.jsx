import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Image from '@/Components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function UserIndex() {
  const { users, auth } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // controla opacidad para animación

  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    }
  }, [showModal]);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowModal(false), 300); // duración igual a la transición CSS
  };

  const deleteUser = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      router.delete(route('users.destroy', id));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (searchField === 'name') {
        return user.name.toLowerCase().includes(search.toLowerCase());
      } else if (searchField === 'email') {
        return user.email.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'email') {
        return sortDirection === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else if (sortField === 'created_at') {
        return sortDirection === 'asc'
          ? a.created_at.localeCompare(b.created_at)
          : b.created_at.localeCompare(a.created_at);
      }
      return 0;
    });

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white tracking-wide">
          Gestión de Usuarios
        </h2>
      }
    >
      <Head title="Gestión de Usuarios" />

      <div className="max-w-5xl mt-5 mx-auto p-6 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Lista de Usuarios</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md transition flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Crear Usuario</span>
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center space-x-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="flex-grow px-4 py-3 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="px-4 py-3 rounded-md bg-gray-800 text-gray-200 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="name">Nombre</option>
            <option value="email">Email</option>
          </select>
        </div>

        <table className="w-full border-collapse text-gray-200">
          <thead>
            <tr className="bg-gray-800 border-b border-purple-600">
              <th className="border border-purple-700 p-3 text-left">Imagen</th>
              <th
                className="border border-purple-700 p-3 cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                Nombre {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="border border-purple-700 p-3 cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="border border-purple-700 p-3">Rol</th>
              <th
                className="border border-purple-700 p-3 cursor-pointer select-none"
                onClick={() => handleSort('created_at')}
              >
                Fecha creación {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="border border-purple-700 p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                className="text-center hover:bg-gray-800 border-b border-purple-700 transition"
              >
                <td className="border border-purple-700 p-3">
                  {user.profile_image?.path_small ? (
                    <Image
                      src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white mx-auto font-bold">
                      ?
                    </div>
                  )}
                </td>
                <td className="border border-purple-700 p-3 text-purple-300 font-semibold">
                  <Link href={route('users.show', user.id)} className="hover:underline text-purple-400">
                    {user.name}
                  </Link>
                </td>
                <td className="border border-purple-700 p-3">{user.email}</td>
                <td className="border border-purple-700 p-3">
                  {user.is_admin ? (
                    <span className="text-green-400 font-bold bg-green-900 bg-opacity-20 px-2 rounded">Admin</span>
                  ) : (
                    'Usuario'
                  )}
                </td>
                <td className="border border-purple-700 p-3 text-sm">
                  {new Date(user.created_at).toLocaleString('es-ES', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="border border-purple-700 p-3 space-x-2">
                  {auth.user.id !== user.id && (
                    <>
                      <Link
                        href={route('users.update', user)}
                        method="put"
                        className={`inline-block px-3 py-1 rounded-md text-sm font-semibold shadow-sm transition ${
                          user.is_admin
                            ? 'bg-red-700 hover:bg-red-800 text-white'
                            : 'bg-purple-700 hover:bg-purple-800 text-white'
                        }`}
                      >
                        {user.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                      </Link>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="inline-block px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm shadow-sm transition"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showModal || isVisible) && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6 ring-2 ring-purple-600">
            <h2 className="text-2xl font-bold mb-5 text-white text-center tracking-wide">
              Crear Usuario
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                router.post(route('users.store'), formData, {
                  onSuccess: () => closeModal(),
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Admin</label>
                <select
                  name="is_admin"
                  defaultValue=""
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="">No</option>
                  <option value="1">Sí</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md transition"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
