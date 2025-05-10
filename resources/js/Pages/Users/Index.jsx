import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UserIndex() {
    const { users } = usePage().props;
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('name');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Función para eliminar usuario
    const deleteUser = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            router.delete(route('users.destroy', id));
        }
    };

    // Función para cambiar el orden al hacer clic en el título de la columna
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Filtrar usuarios según la búsqueda
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Usuarios
                </h2>
            }
        >
            <Head title="Gestión de Usuarios" />

            <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        Crear Usuario
                    </button>
                </div>

                {/* Barra de búsqueda y selector */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            className="px-4 py-2 border rounded"
                        />
                        <select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="name">Nombre</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Imagen</th>
                            <th
                                className="border p-2 cursor-pointer"
                                onClick={() => handleSort('name')}
                            >
                                Nombre {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="border p-2 cursor-pointer"
                                onClick={() => handleSort('email')}
                            >
                                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="border p-2">Rol</th>
                            <th
                                className="border p-2 cursor-pointer"
                                onClick={() => handleSort('created_at')}
                            >
                                Fecha creación {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">
                                    <img
                                        src={`${user.profile_image.path_small}?t=${new Date().getTime()}`}
                                        alt="Perfil"
                                        className="w-10 h-10 rounded-full mx-auto"
                                    />
                                </td>
                                <td className="border p-2">
                                    <Link href={route('users.show', user.id)} className="text-blue-600 hover:underline">
                                        {user.name}
                                    </Link>
                                </td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    {user.is_admin ? <span className="text-green-600 font-bold">Admin</span> : 'Usuario'}
                                </td>
                                <td className="border p-2">
                                    {new Date(user.created_at).toLocaleString('es-ES', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </td>
                                <td className="border p-2 space-x-2">
                                    {auth.user.id !== user.id && (
                                        <>
                                            <Link
                                                href={route('users.update', user)}
                                                method="put"
                                                className={`inline-block px-4 py-2 rounded ${
                                                    user.is_admin ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                                }`}
                                            >
                                                {user.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                                            </Link>

                                            <Link
                                                href={route('users.destroy', user.id)}
                                                method="delete"
                                                as="button"
                                                className="inline-block px-4 py-2 rounded bg-gray-600 text-white"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteUser(user.id);
                                                }}
                                            >
                                                Eliminar
                                            </Link>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de creación de usuario */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                router.post(route('users.store'), formData, {
                                    onSuccess: () => setShowModal(false)
                                });
                            }}
                        >
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nombre</label>
                                <input type="text" name="name" required className="w-full border p-2 rounded" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" name="email" required className="w-full border p-2 rounded" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Contraseña</label>
                                <input type="password" name="password" required className="w-full border p-2 rounded" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Admin</label>
                                <select name="is_admin" id="is_admin">
                                    <option value="false" selected disabled>Sleccione una opción...</option>
                                    <option value="true">Sí</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
