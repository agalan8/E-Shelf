import { Link, Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Show from '@/Components/Posts/Show';
import Image from '@/Components/Image';

export default function PostIndex() {
    const { posts, tags } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('titulo');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const deletePost = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este post?")) {
            router.delete(route('regular-posts.destroy', id));
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

    const openShowModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const closeShowModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tagId) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    };

    const filteredPosts = posts
        .filter((post) => {
            if (searchField === 'titulo') {
                return post.titulo.toLowerCase().includes(search.toLowerCase());
            } else if (searchField === 'user_name') {
                return post.user.name.toLowerCase().includes(search.toLowerCase());
            }
            return true;
        })
        .filter((post) => {
            if (selectedTags.length === 0) return true;
            return selectedTags.every(tag => post.tags.some(postTag => postTag.id === tag.id));
        })
        .sort((a, b) => {
            if (sortField === 'titulo') {
                return sortDirection === 'asc' ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo);
            } else if (sortField === 'created_at') {
                return sortDirection === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
            } else if (sortField === 'user_name') {
                return sortDirection === 'asc' ? a.post.user.name.localeCompare(b.post.user.name) : b.post.user.name.localeCompare(a.post.user.name);
            }
            return 0;
        });

    return (
        <AuthenticatedLayout header={<h2 className=" font-semibold leading-tight text-gray-800">Gestión de Publicaciones</h2>}>
            <Head title="Gestión de Publicaciones" />
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Lista de Posts</h1>
                </div>

                {/* Filtros de búsqueda y selección de etiquetas */}
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
                            <option value="titulo">Título</option>
                            <option value="user_name">Usuario</option>
                        </select>

                        {/* Dropdown de selección de etiquetas */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full mt-2 p-2 border rounded bg-white text-left"
                            >
                                Seleccionar etiquetas
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute w-full mt-1 border rounded bg-white shadow-md z-10 max-h-40 overflow-y-auto">
                                    <input
                                        type="text"
                                        placeholder="Buscar etiqueta..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 border-b"
                                    />
                                    {tags
                                        .filter(tag =>
                                            tag.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map(tag => (
                                            <div
                                                key={tag.id}
                                                className="cursor-pointer p-2 hover:bg-gray-200"
                                                onClick={() => handleTagSelect(tag)}
                                            >
                                                {tag.nombre}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mostrar etiquetas seleccionadas entre la tabla y los filtros */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {selectedTags.length > 0 && (
                        <div className="text-sm text-gray-700">
                            <strong>Etiquetas seleccionadas: </strong>
                            <div className="flex gap-2">
                                {selectedTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center space-x-2"
                                    >
                                        <span>{tag.nombre}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleTagRemove(tag.id)}
                                            className="text-red-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th
                                className="border px-2 py-2 cursor-pointer"
                                onClick={() => handleSort('user_name')}
                            >
                                Usuario {sortField === 'user_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="border px-2 py-2 cursor-pointer"
                                onClick={() => handleSort('titulo')}
                            >
                                Título {sortField === 'titulo' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="border px-2 py-2">Descripción</th>
                            <th className="border px-2 py-2">Foto</th>
                            <th className="border px-2 py-2">Categorías</th>
                            <th
                                className="border px-2 py-2 cursor-pointer"
                                onClick={() => handleSort('created_at')}
                            >
                                Fecha creación {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="border px-2 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="text-center h-10">
                                <td className="border px-2 py-2">{post.post.user.name}</td>
                                <td className="border px-2 py-2">{post.titulo}</td>
                                <td className="border px-2 py-2">{post.descripcion}</td>
                                <td className="border px-2 py-2">
                                    {post.image && (
                                        <Image
                                            src={`${post.image.path_medium}?t=${new Date().getTime()}`}
                                            alt="Post Photo"
                                            className="w-40 h-40 object-contain mx-auto"
                                        />
                                    )}
                                </td>
                                <td className="border px-2 py-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-1"
                                        >
                                            {tag.nombre}
                                        </span>
                                    ))}
                                </td>
                                <td className="border px-2 py-2">
                                    {new Date(post.created_at).toLocaleString('es-ES', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td className="border px-2 py-2 space-x-2">
                                    <button
                                        onClick={() => openShowModal(post)}
                                        className="inline-block px-4 py-2 rounded bg-blue-600 text-white"
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="inline-block px-4 py-2 rounded bg-red-600 text-white"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && selectedPost && <Show post={selectedPost} onClose={closeShowModal} />}
        </AuthenticatedLayout>
    );
}
