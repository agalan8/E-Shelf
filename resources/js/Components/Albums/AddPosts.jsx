import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "../Image";
import { useToast } from "@/contexts/ToastProvider";

const AddPosts = ({ album, userPosts, onClose }) => {
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [searchTitle, setSearchTitle] = useState("");
    const { showToast } = useToast();

    const postsNotInAlbum = userPosts.filter(
        (userPost) => !album.posts.some(albumPost => albumPost.id === userPost.id)
    );

    const filteredPosts = postsNotInAlbum.filter((post) =>
        post.titulo?.toLowerCase().includes(searchTitle.trim().toLowerCase())
    );

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const togglePostSelection = (postId) => {
        setSelectedPosts((prevSelected) =>
            prevSelected.includes(postId)
                ? prevSelected.filter((id) => id !== postId)
                : [...prevSelected, postId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedPosts.length === 0) {
            alert("Selecciona al menos un post para agregar.");
            return;
        }

        router.post(
            route("albums.posts.store", album.id),
            { posts: selectedPosts },
            {
                onSuccess: () => {
                    showToast("¡Publicaciones agregadas al álbum!", "success");
                    handleClose();
                },
                preserveScroll: true,
            }
        );
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                onClick={handleModalClick}
                className={`bg-[#292B2F] rounded-lg shadow-lg w-11/12 max-w-6xl h-[85vh] flex flex-col overflow-hidden relative transform transition-all duration-300 ${
                    isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-5"
                }`}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white hover:text-red-400 z-10"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                    <div className="p-6 text-white overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            Añadir Publicaciones al Álbum
                        </h2>
                        {/* Campo de búsqueda por título */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                placeholder="Buscar por título"
                                className="w-full sm:w-1/2 px-3 py-2 rounded bg-[#1c1c1e] border border-white text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
                            {filteredPosts.length === 0 ? (
                                <p>No tienes posts disponibles para agregar.</p>
                            ) : (
                                filteredPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => togglePostSelection(post.id)}
                                        className={`relative rounded cursor-pointer transition-all ${
                                            selectedPosts.includes(post.id)
                                                ? "border-4 border-purple-500 bg-purple-100 bg-opacity-10"
                                                : "border border-gray-600"
                                        }`}
                                    >
                                        <Image
                                            src={post.image.path_medium}
                                            alt={post.titulo}
                                            className="object-cover w-full h-48 rounded"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-sm p-1">
                                            {post.titulo}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6">
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-500"
                        >
                            Agregar Publicaciones
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPosts;
