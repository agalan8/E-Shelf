import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Show from "@/Components/Posts/Show";
import Edit from "@/Components/Posts/Edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart as faHeartSolid,
    faHeartCrack,
    faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { PencilIcon as PencilOutline } from "@heroicons/react/24/outline";
import { PencilIcon as PencilSolid } from "@heroicons/react/24/solid";
import { TrashIcon as TrashOutline } from "@heroicons/react/24/outline";
import { TrashIcon as TrashSolid } from "@heroicons/react/24/solid";
import Image from "@/Components/Image";

const Post = ({
    post,
    tags,
    isLikedByUser,
    getTotalLikes,
    isSharedByUser,
    getTotalShares,
    postType,
}) => {
    const { auth } = usePage().props;
    const [showModalOpen, setShowModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLiked, setIsLiked] = useState(isLikedByUser);
    const [totalLikes, setTotalLikes] = useState(getTotalLikes || 0);
    const [hovered, setHovered] = useState(false);
    const [editHovered, setEditHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState(false);
    const [isShared, setIsShared] = useState(isSharedByUser);
    const [totalShares, setTotalShares] = useState(getTotalShares || 0);

    console.log("Post:", post);
    console.log("Post Type:", postType);

    const toggleLike = (e) => {
        e.stopPropagation();
        if (!auth.user) return;

        router.post(
            route("like"),
            { post_id: post.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLiked((prev) => !prev);
                    setTotalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
                },
            }
        );
    };

    const toggleShare = (e) => {
        e.stopPropagation();
        if (!auth.user) return;

        if (!isShared) {
            router.post(
                route("shared-posts.store"),
                { post_id: post.id },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsShared(true);
                        setTotalShares((prev) =>
                            isShared ? prev - 1 : prev + 1
                        );
                    },
                }
            );
        } else {
            router.delete(route("shared-posts.destroyByPostId"), {
                data: { regular_post_id: post.id },
                preserveScroll: true,
                onSuccess: () => {
                    setIsShared(false);
                    setTotalShares((prev) => (isShared ? prev - 1 : prev + 1));
                },
            });
        }
    };

    const handleOpenShowModal = () => {
        setSelectedPost(post);
        setShowModalOpen(true);
    };

    const handleCloseShowModal = () => {
        setShowModalOpen(false);
        setSelectedPost(null);
    };

    const handleOpenEditModal = (e) => {
        e.stopPropagation();
        setSelectedPost(post);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedPost(null);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (
            confirm("¿Estás seguro de que quieres eliminar esta publicación?")
        ) {
            router.delete(route("regular-posts.destroy", post.id), {
                preserveScroll: true,
            });
        }
    };

    const canEdit =
        auth.user && (auth.user.id === post.post.user.id || auth.user.is_admin);

    return (
        <div
            className="relative group cursor-pointer"
            style={{ display: "inline-block", lineHeight: 0 }}
        >
            <Image
                src={`${post.image.path_medium}?t=${new Date().getTime()}`}
                alt={post.titulo}
                className="w-full h-auto object-contain"
                loading="lazy"
                onClick={handleOpenShowModal}
            />

            {/* Indicador si es post compartido */}
            {postType === "shared" && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg select-none z-10 max-w-[140px] text-center">
                    Compartido por <br />
                    <span className="font-bold">{post.post.user.name}</span>
                </div>
            )}

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/60 backdrop-blur-sm text-white px-4 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 group-hover:py-2 transition-all duration-300 text-sm">
                {/* Usuario */}
                <div className="flex items-center space-x-2">
                    {post.post.user.profile_image?.path_small ? (
                        <Image
                            src={`${
                                post.post.user.profile_image.path_small
                            }?t=${new Date().getTime()}`}
                            alt={post.post.user.name}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                            ?
                        </div>
                    )}
                    {auth.user ? (
                        <Link
                            href={route("users.show", post.post.user.id)}
                            className="hover:underline text-base font-medium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {post.post.user.name}
                        </Link>
                    ) : (
                        <span className="text-base font-medium">
                            {post.post.user.name}
                        </span>
                    )}
                </div>

                {/* Likes y acciones */}
                <div className="flex items-center space-x-3">
                    {/* Me gusta */}
                    <button
                        onClick={toggleLike}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="text-lg focus:outline-none"
                    >
                        <FontAwesomeIcon
                            icon={
                                isLiked
                                    ? hovered
                                        ? faHeartCrack
                                        : faHeartSolid
                                    : faHeartRegular
                            }
                            className={`w-6 h-6 transition duration-200 ${
                                isLiked ? "text-red-500" : "text-white"
                            }`}
                        />
                    </button>
                    <span className="text-sm">{totalLikes}</span>

                    {/* Compartir */}
                    <button
                        onClick={toggleShare}
                        className="text-lg focus:outline-none"
                    >
                        <FontAwesomeIcon
                            icon={faRetweet}
                            className={`w-6 h-6 transition duration-200 ${
                                isShared ? "text-[#E0B0FF]" : "text-white"
                            }`}
                        />
                    </button>
                    <span className="text-sm">{totalShares}</span>

                    {/* Editar */}
                    {canEdit && (
                        <>
                            <button
                                onClick={handleOpenEditModal}
                                onMouseEnter={() => setEditHovered(true)}
                                onMouseLeave={() => setEditHovered(false)}
                                className="text-white"
                            >
                                {editHovered ? (
                                    <PencilSolid className="w-5 h-5 text-white" />
                                ) : (
                                    <PencilOutline className="w-5 h-5 text-white" />
                                )}
                            </button>

                            {/* Eliminar */}
                            <button
                                onClick={handleDelete}
                                onMouseEnter={() => setDeleteHovered(true)}
                                onMouseLeave={() => setDeleteHovered(false)}
                                className="text-white"
                            >
                                {deleteHovered ? (
                                    <TrashSolid className="w-5 h-5 text-red-500" />
                                ) : (
                                    <TrashOutline className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Modales */}
            {showModalOpen && selectedPost && (
                <Show
                    post={selectedPost}
                    onClose={handleCloseShowModal}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    totalLikes={totalLikes}
                    setTotalLikes={setTotalLikes}
                />
            )}
            {editModalOpen && selectedPost && (
                <Edit
                    post={selectedPost}
                    tags={tags}
                    onClose={handleCloseEditModal}
                    isOpen={editModalOpen}
                />
            )}
        </div>
    );
};

export default Post;
