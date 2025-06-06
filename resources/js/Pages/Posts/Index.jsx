import { Link, Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Show from "@/Components/Posts/Show";
import Image from "@/Components/Image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PostIndex() {
    const { posts, tags } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("titulo");
    const [sortField, setSortField] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const deletePost = (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este post?")) {
            router.delete(route("regular-posts.destroy", id));
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
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
        if (!selectedTags.some((t) => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tagId) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
    };

    const filteredPosts = posts
        .filter((post) => {
            if (searchField === "titulo") {
                return post.titulo.toLowerCase().includes(search.toLowerCase());
            } else if (searchField === "user_name") {
                return post.user.name
                    .toLowerCase()
                    .includes(search.toLowerCase());
            }
            return true;
        })
        .filter((post) => {
            if (selectedTags.length === 0) return true;
            return selectedTags.every((tag) =>
                post.tags.some((postTag) => postTag.id === tag.id)
            );
        })
        .sort((a, b) => {
            if (sortField === "titulo") {
                return sortDirection === "asc"
                    ? a.titulo.localeCompare(b.titulo)
                    : b.titulo.localeCompare(a.titulo);
            } else if (sortField === "created_at") {
                return sortDirection === "asc"
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            } else if (sortField === "user_name") {
                return sortDirection === "asc"
                    ? a.post.user.name.localeCompare(b.post.user.name)
                    : b.post.user.name.localeCompare(a.post.user.name);
            }
            return 0;
        });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold leading-tight text-white">
                    Gestión de Publicaciones
                </h2>
            }
        >
            <Head title="Gestión de Publicaciones" />
            <div className="max-w-7xl my-5 mx-auto p-4 bg-gray-900 rounded-lg shadow-lg text-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-white">
                        Lista de Publicaciones
                    </h1>
                </div>

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar..."
                        className="px-4 py-2 rounded border border-purple-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="px-4 py-2 rounded border border-purple-600 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="titulo">Título</option>
                        <option value="user_name">Usuario</option>
                    </select>

                    {/* Dropdown etiquetas */}
                    <div className="relative w-60" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-2 rounded border border-purple-600 bg-gray-800 text-left text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Seleccionar etiquetas
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute w-full mt-1 border border-purple-600 rounded bg-gray-800 shadow-lg max-h-48 overflow-auto z-20">
                                <input
                                    type="text"
                                    placeholder="Buscar etiqueta..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-3 py-2 mb-1 border-b border-purple-600 bg-gray-700 text-gray-200 focus:outline-none"
                                />
                                {tags
                                    .filter((tag) =>
                                        tag.nombre
                                            .toLowerCase()
                                            .includes(searchTerm.toLowerCase())
                                    )
                                    .map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="cursor-pointer px-4 py-2 hover:bg-purple-700"
                                            onClick={() => {
                                                handleTagSelect(tag);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {tag.nombre}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Etiquetas seleccionadas */}
                {selectedTags.length > 0 && (
                    <div className="mb-6 text-sm text-gray-300">
                        <strong className="text-white">
                            Etiquetas seleccionadas:{" "}
                        </strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="bg-purple-700 text-gray-100 px-3 py-1 rounded flex items-center space-x-2"
                                >
                                    <span>{tag.nombre}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleTagRemove(tag.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabla */}
                <table className="w-full border-collapse text-gray-200 shadow-lg rounded-md overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 border-b border-purple-600">
                            <th
                                className="border border-purple-700 p-3 cursor-pointer select-none"
                                onClick={() => handleSort("user_name")}
                            >
                                Usuario{" "}
                                {sortField === "user_name" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th
                                className="border border-purple-700 p-3 cursor-pointer select-none"
                                onClick={() => handleSort("titulo")}
                            >
                                Título{" "}
                                {sortField === "titulo" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="border border-purple-700 p-3">
                                Descripción
                            </th>
                            <th className="border border-purple-700 p-3">
                                Foto
                            </th>
                            <th className="border border-purple-700 p-3">
                                Etiquetas
                            </th>
                            <th
                                className="border border-purple-700 p-3 cursor-pointer select-none"
                                onClick={() => handleSort("created_at")}
                            >
                                Fecha creación{" "}
                                {sortField === "created_at" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="border border-purple-700 p-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr
                                key={post.id}
                                className="text-center hover:bg-gray-800 border-b border-purple-700 transition"
                            >
                                <td className="border border-purple-700 p-3">
                                    {post.post.user.name}
                                </td>
                                <td className="border border-purple-700 p-3">
                                    {post.titulo}
                                </td>
                                <td className="border border-purple-700 p-3 truncate max-w-xs">
                                    {post.descripcion}
                                </td>
                                <td className="border border-purple-700 p-3">
                                    {post.image && (
                                        <Image
                                            src={`${
                                                post.image.path_medium
                                            }?t=${new Date().getTime()}`}
                                            alt="Post Photo"
                                            className="w-32 h-32 object-contain mx-auto rounded"
                                        />
                                    )}
                                </td>
                                <td className="border border-purple-700 p-3">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="bg-purple-700 text-gray-300 px-2 py-1 rounded mr-1 inline-block"
                                        >
                                            {tag.nombre}
                                        </span>
                                    ))}
                                </td>
                                <td className="border border-purple-700 p-3 whitespace-nowrap">
                                    {new Date(post.created_at).toLocaleString(
                                        "es-ES",
                                        {
                                            month: "2-digit",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </td>
                                <td className="border border-purple-700 p-3 space-x-2">
                                    <button
                                        onClick={() => openShowModal(post)}
                                        className="inline-flex items-center justify-center p-2 text-white bg-purple-700 hover:bg-purple-800 rounded transition text-base"
                                        title="Ver publicación"
                                    >
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            size="lg"
                                        />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="inline-flex items-center justify-center p-2 text-white bg-red-700 hover:bg-red-800 rounded transition text-base"
                                        title="Eliminar publicación"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            size="lg"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && selectedPost && (
                <Show post={selectedPost} onClose={closeShowModal} />
            )}
        </AuthenticatedLayout>
    );
}
