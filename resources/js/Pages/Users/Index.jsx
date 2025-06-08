import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Image from '@/Components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/contexts/ToastProvider';

export default function UserIndex() {
  const { users, auth } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: '',
  });
  const [errors, setErrors] = useState({});

  const { showToast } = useToast();

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    }
  }, [showModal]);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };

  const deleteUser = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      router.delete(route('users.destroy', id), {
        onSuccess: () => {
          showToast("Usuario eliminado correctamente.", "success");
        },
      });
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

  const validate = (field, value) => {
    let newErrors = { ...errors };

    if (value === '' || value === null || value === undefined) {
      newErrors[field] = 'Este campo es obligatorio';
    } else {
      delete newErrors[field];
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = 'Formato de email inválido';
      }
      if (value === '') {
        newErrors.email = 'El email es obligatorio';
      }
    }

    if (field === 'password') {
      if (value.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (value === '') {
        newErrors.password = 'La contraseña es obligatoria';
      }
    }

    if (field === 'is_admin') {
      if (value === '') {
        newErrors.is_admin = 'Debe seleccionar una opción';
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold leading-tight text-white tracking-wide">
          Gestión de Usuarios
        </h2>
      }
    >
      <Head title="Gestión de Usuarios" />

      <div className="max-w-5xl mt-5 mx-auto p-2 sm:p-6 bg-gray-900 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg text-center sm:text-left">Lista de Usuarios</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md transition flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Crear Usuario</span>
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full sm:flex-grow px-4 py-3 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-md bg-gray-800 text-gray-200 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="name">Nombre</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Tabla solo visible en sm+ */}
        <div className="hidden sm:block w-full overflow-x-auto">
          <table className="min-w-[600px] w-full border-collapse text-gray-200">
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
                      <span className="text-white font-bold">Usuario</span>
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

        {/* Cards solo visibles en móvil */}
        <div className="block sm:hidden space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-gray-800 rounded-lg p-4 shadow border border-purple-700 flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                {user.profile_image?.path_small ? (
                  <Image
                    src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    ?
                  </div>
                )}
                <div>
                  <Link href={route('users.show', user.id)} className="text-lg font-semibold text-purple-300 hover:underline">
                    {user.name}
                  </Link>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between mt-2">
                <span className="text-xs">
                  <span className="font-semibold text-purple-400">Rol: </span>
                  {user.is_admin ? (
                    <span className="text-green-400 font-bold bg-green-900 bg-opacity-20 px-2 rounded">Admin</span>
                  ) : (
                    <span className="text-white font-bold">Usuario</span>
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleString('es-ES', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                {auth.user.id !== user.id && (
                  <>
                    <Link
                      href={route('users.update', user)}
                      method="put"
                      className={`flex-1 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition text-center ${
                        user.is_admin
                          ? 'bg-red-700 hover:bg-red-800 text-white'
                          : 'bg-purple-700 hover:bg-purple-800 text-white'
                      }`}
                    >
                      {user.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                    </Link>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="flex-1 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-xs shadow-sm transition"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
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
                validate('name', form.name);
                validate('email', form.email);
                validate('password', form.password);
                validate('is_admin', form.is_admin);
                if (
                  Object.keys(errors).length === 0 &&
                  form.name &&
                  form.email &&
                  form.password &&
                  form.is_admin
                ) {
                  const formData = new FormData();
                  Object.entries(form).forEach(([key, value]) => formData.append(key, value));
                  router.post(route('users.store'), formData, {
                    onSuccess: () => {
                      showToast("¡Usuario creado con éxito!", "success");
                      closeModal();
                    },
                  });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-gray-800 border border-purple-600 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md bg-gray-800 border px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${errors.email ? 'border-red-500' : 'border-purple-600'}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md bg-gray-800 border px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${errors.password ? 'border-red-500' : 'border-purple-600'}`}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Admin</label>
                <select
                  name="is_admin"
                  value={form.is_admin}
                  onChange={handleChange}
                  className={`w-full rounded-md bg-gray-800 border px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${errors.is_admin ? 'border-red-500' : 'border-purple-600'}`}
                  required
                >
                  <option value="">Seleccione una opción...</option>
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
                {errors.is_admin && <p className="text-red-400 text-xs mt-1">{errors.is_admin}</p>}
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
                  disabled={Object.keys(errors).length > 0 || !form.name || !form.email || !form.password || !form.is_admin}
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
