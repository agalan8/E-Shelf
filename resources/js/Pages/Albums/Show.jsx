import React, { useState, useEffect, useMemo } from "react";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Post from "@/Components/Posts/Post";
import Edit from "@/Components/Albums/Edit";
import AddPosts from "@/Components/Albums/AddPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/contexts/ToastProvider";

const Show = ({ album, userPosts, tags }) => {
    const [posts, setPosts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddPostsModalOpen, setIsAddPostsModalOpen] = useState(false);
    const { showToast } = useToast();

    const [sortCreatedAt, setSortCreatedAt] = useState("none");
    const [sortFechaCaptura, setSortFechaCaptura] = useState("none");
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        if (album && album.posts) {
            setPosts(album.posts);
        }
    }, [album]);

    function parseFechaHora(fechaStr) {
        if (!fechaStr) return new Date(0);
        const [fecha, hora] = fechaStr.split(' ');
        if (!fecha || !hora) return new Date(0);
        const partes = fecha.split(':');
        if (partes.length !== 3) return new Date(0);
        const isoString = `${partes[0]}-${partes[1]}-${partes[2]}T${hora}`;
        return new Date(isoString);
    }

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = [...posts];

        if (searchTitle.trim() !== "") {
            filtered = filtered.filter((post) =>
                post.titulo
                    ?.toLowerCase()
                    .includes(searchTitle.trim().toLowerCase())
            );
        }

        if (sortCreatedAt !== "none") {
            filtered.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return sortCreatedAt === "asc"
                    ? dateA - dateB
                    : dateB - dateA;
            });
        }

        if (sortFechaCaptura !== "none") {
            filtered.sort((a, b) => {
                const fechaA = a.image?.fecha_hora
                    ? parseFechaHora(a.image.fecha_hora)
                    : new Date(0);
                const fechaB = b.image?.fecha_hora
                    ? parseFechaHora(b.image.fecha_hora)
                    : new Date(0);
                return sortFechaCaptura === "asc"
                    ? fechaA - fechaB
                    : fechaB - fechaA;
            });
        }

        return filtered;
    }, [posts, sortCreatedAt, sortFechaCaptura, searchTitle]);

    const handleOpenAddPostsModal = () => setIsAddPostsModalOpen(true);
    const handleCloseAddPostsModal = () => setIsAddPostsModalOpen(false);
    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    const handleDeletePost = (postId) => {
        if (
            confirm(
                "¿Estás seguro de que deseas eliminar esta publicación del álbum?"
            )
        ) {
            router.delete(route("albums.posts.destroy"), {
                preserveScroll: true,
                data: {
                    album_id: album.id,
                    regular_post_id: postId,
                },
                onSuccess: () => {
                    setPosts(posts.filter((post) => post.id !== postId));
                    showToast("¡Publicación eliminada del álbum!", "success");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold leading-tight text-gray-800">
                    {album.titulo}
                </h2>
            }
        >
            <Head title="Mis Álbumes" />
            <div className="container mx-auto p-2 sm:p-4">
                {/* Enlace para volver */}
                <div className="mb-2 sm:mb-4">
                    <Link
                        href={route("mis-albums")}
                        className="text-purple-500 hover:text-purple-700 font-semibold"
                    >
                        &larr; Volver a Mis Álbumes
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-2">
                    <h1 className="text-white text-2xl sm:text-3xl font-semibold">
                        {album.nombre}
                    </h1>
                    <button
                        onClick={handleOpenAddPostsModal}
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md w-full sm:w-auto"
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        Añadir Publicaciones al Álbum
                    </button>
                </div>

                <div className="text-md text-white mb-2 sm:mb-4">
                    <strong>Descripción:</strong>
                    <p>{album.descripcion}</p>
                    {/* Fecha de creación del álbum */}
                    <p className="text-sm text-gray-400 mt-2">
                        Creado el: {new Date(album.created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>

                {/* Filtros y búsqueda */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-4 mb-4 my-5">
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
                        <select
                            value={sortCreatedAt}
                            onChange={(e) => setSortCreatedAt(e.target.value)}
                            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
                        >
                            <option value="none">Ordenar por publicación</option>
                            <option value="asc">Más antiguos primero</option>
                            <option value="desc">Más recientes primero</option>
                        </select>

                        <select
                            value={sortFechaCaptura}
                            onChange={(e) => setSortFechaCaptura(e.target.value)}
                            className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600"
                        >
                            <option value="none">Ordenar por fecha de captura</option>
                            <option value="asc">Más antiguos primero</option>
                            <option value="desc">Más recientes primero</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        placeholder="Buscar por título"
                        className="rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full sm:w-64"
                    />
                </div>

                {/* Mostrar publicaciones */}
                {filteredAndSortedPosts.length === 0 ? (
                    <p className="text-white">
                        No hay publicaciones en este álbum.
                    </p>
                ) : (
                    <div className="w-full py-2">
                        <div className="w-full p-0 sm:p-1">
                            <div className="flex flex-col sm:flex-row gap-2">
                                {[0, 1, 2].map((colIndex) => (
                                    <div key={colIndex} className="flex-1">
                                        {filteredAndSortedPosts
                                            .filter((_, index) => index % 3 === colIndex)
                                            .map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="relative group flex flex-col gap-2 flex-1 mt-2"
                                                >
                                                    {/* Ícono eliminar */}
                                                    <button
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="absolute top-2 right-2 z-10 text-red-500 opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 hover:scale-125"
                                                        aria-label="Eliminar publicación"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faXmark}
                                                            className="w-7 h-7"
                                                        />
                                                    </button>

                                                    <Post
                                                        getTotalLikes={
                                                            post.getTotalLikes
                                                        }
                                                        isLikedByUser={
                                                            post.isLikedByUser
                                                        }
                                                        isSharedByUser={post.isSharedByUser}
                                                        getTotalShares={post.getTotalShares}
                                                        post={post}
                                                        tags={tags}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isEditModalOpen && (
                <Edit album={album} onClose={handleCloseEditModal} />
            )}
            {isAddPostsModalOpen && (
                <AddPosts
                    album={album}
                    onClose={handleCloseAddPostsModal}
                    userPosts={userPosts}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Show;
