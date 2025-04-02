import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CategoriaIndex() {
    const { categorias } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);
    const [nombre, setNombre] = useState('');
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('nombre');
    const [sortField, setSortField] = useState('nombre');
    const [sortDirection, setSortDirection] = useState('asc');

    // Función para abrir el modal en modo edición o creación
    const openModal = (categoria = null) => {
        setEditingCategoria(categoria);
        setNombre(categoria ? categoria.nombre : ''); // Cargar nombre si se edita
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setEditingCategoria(null);
        setNombre('');
    };

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { nombre };

        if (editingCategoria) {
            router.put(route('categorias.update', editingCategoria.id), formData, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post(route('categorias.store'), formData, {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Función para eliminar categoría
    const deleteCategoria = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
            router.delete(route('categorias.destroy', id));
        }
    };

    // Ordenar categorías
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Filtrar categorías
    const filteredCategorias = categorias
        .filter((categoria) => {
            if (searchField === 'nombre') {
                return categoria.nombre.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        })
        .sort((a, b) => {
            if (sortField === 'nombre') {
                return sortDirection === 'asc'
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre);
            }
            return 0;
        });

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Gestión de Categorías</h2>}
        >
            <Head title="Gestión de Categorías" />

            <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lista de Categorías</h1>
                    <button onClick={() => openModal()} className="px-4 py-2 rounded bg-blue-600 text-white">
                        Crear Categoría
                    </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            className="px-4 py-2 border rounded"
                        />
                    </div>
                </div>

                {/* Tabla de categorías */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 cursor-pointer" onClick={() => handleSort('nombre')}>
                                Nombre {sortField === 'nombre' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.map((categoria) => (
                            <tr key={categoria.id} className="text-center">
                                <td className="border p-2">{categoria.nombre}</td>
                                <td className="border p-2 space-x-2">
                                    <button
                                        onClick={() => openModal(categoria)}
                                        className="px-4 py-2 rounded bg-yellow-600 text-white"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteCategoria(categoria.id)}
                                        className="px-4 py-2 rounded bg-red-600 text-white"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de creación/edición */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{editingCategoria ? 'Editar Categoría' : 'Crear Categoría'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                                    {editingCategoria ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
