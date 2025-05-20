import React, { useState, useEffect } from "react";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Post from "@/Components/Posts/Post";
import Edit from "@/Components/Albums/Edit";
import AddPosts from "@/Components/Albums/AddPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Show = ({ album, userPosts, tags }) => {
    const [posts, setPosts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddPostsModalOpen, setIsAddPostsModalOpen] = useState(false);

    useEffect(() => {
        if (album && album.posts) {
            setPosts(album.posts);
        }
    }, [album]);

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
            <div className="container mx-auto p-4">
                {/* Enlace para volver */}
                <div className="mb-4">
                    <Link
                        href={route("mis-albums")}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        &larr; Volver a Mis Álbumes
                    </Link>
                </div>

                {/* Botón de Editar */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleOpenEditModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Editar
                    </button>
                </div>

                {/* Título y detalles */}
                <h1 className="text-white text-3xl font-semibold mb-2">
                    {album.nombre}
                </h1>
                <div className="text-lg text-white mb-4">
                    <strong>Creado por:</strong> {album.user.name}
                </div>
                <div className="text-md text-white mb-4">
                    <strong>Descripción:</strong>
                    <p>{album.descripcion}</p>
                </div>

                {/* Botón añadir publicación */}
                <div className="mb-4">
                    <button
                        onClick={handleOpenAddPostsModal}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Añadir Publicación
                    </button>
                </div>

                {/* Mostrar publicaciones */}
                {posts.length === 0 ? (
                    <p className="text-white">
                        No hay publicaciones en este álbum.
                    </p>
                ) : (
                    <div className="py-2">
                        <div className="mx-auto max-w-8xl p-1">
                            <div className="flex gap-2">
                                {[0, 1, 2].map((colIndex) => (
                                    <div key={colIndex} className="">
                                        {posts
                                            .filter(
                                                (_, index) =>
                                                    index % 3 === colIndex
                                            )
                                            .map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="relative group flex flex-col gap-2 flex-1 mt-2"
                                                >
                                                    {/* Ícono eliminar */}
                                                    <button
                                                        onClick={() =>
                                                            handleDeletePost(
                                                                post.id
                                                            )
                                                        }
                                                        className="absolute top-2 right-2 z-10 text-red-500 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 hover:scale-125"
                                                        aria-label="Eliminar publicación"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faXmark}
                                                            className="w-7 h-7"
                                                        />
                                                    </button>

                                                    {/* Publicación */}
                                                    <Post
                                                        getTotalLikes={
                                                            post.getTotalLikes
                                                        }
                                                        isLikedByUser={
                                                            post.isLikedByUser
                                                        }
                                                        post={post}
                                                        tags={tags}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {posts.links && posts.links.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    {posts.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 mx-1 text-sm ${
                                                link.active
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                            } rounded`}
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
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
