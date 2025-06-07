import React, { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faUserMinus,
    faUserCheck,
    faHeart as faHeartSolid,
    faHeartCrack,
    faMapLocationDot,
    faCircleInfo,
    faClockRotateLeft,
    faCamera,
    faBoltLightning,
    faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { XMarkIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import Comment from "@/Components/Comments/Comment";
import Image from "../Image";

const Show = ({
    post,
    onClose,
    isLiked,
    setIsLiked,
    totalLikes,
    setTotalLikes,
    notification,
}) => {
    const { auth, newCommentId } = usePage().props;
    const user = auth?.user || null;

    const [isVisible, setIsVisible] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [following, setFollowing] = useState(
        user?.following?.some((f) => f.id === post.post.user.id) || false
    );
    const [hoveringFollow, setHoveringFollow] = useState(false);
    const [hoveringImage, setHoveringImage] = useState(false);
    const [commentBody, setCommentBody] = useState("");
    const [comments, setComments] = useState(post.comments || []);
    const [hoveredLike, setHoveredLike] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showExif, setShowExif] = useState(false);

    // Chequeo si latitud y longitud están disponibles y válidas
    const hasValidLocation =
        post?.image?.latitud !== null &&
        post?.image?.longitud !== null &&
        post?.image?.latitud !== undefined &&
        post?.image?.longitud !== undefined;

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        const handleKeyDown = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!showMap) return;

        const existingScript = document.querySelector("#googleMapsScript");
        if (existingScript) {
            initMap();
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCTy_UZS2tqbYIoYFUDkreos9Q8vq4pkEc`;
        script.id = "googleMapsScript";
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);

        return () => {
            const mapDiv = document.getElementById("google-map");
            if (mapDiv) mapDiv.innerHTML = "";
        };
    }, [showMap]);

    const initMap = () => {
        if (!window.google || !hasValidLocation) return;
        const lat = parseFloat(post.image.latitud);
        const lng = parseFloat(post.image.longitud);
        const map = new window.google.maps.Map(
            document.getElementById("google-map"),
            {
                center: { lat, lng },
                zoom: 8,
                streetViewControl: true,
            }
        );
        new window.google.maps.Marker({ position: { lat, lng }, map });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    if (!post) return null;

    const handleFollowToggle = () => {
        if (!user) return;
        if (following) {
            router.delete(`/unfollow/${post.post.user.id}`, {
                onSuccess: () => setFollowing(false),
                preserveScroll: true,
            });
        } else {
            router.post(
                "/follow",
                { followed_user_id: post.post.user.id },
                {
                    onSuccess: () => setFollowing(true),
                    preserveScroll: true,
                }
            );
        }
    };

    const handleImageClick = () => setIsImageOpen(true);
    const closeImageView = () => setIsImageOpen(false);

    const toggleLike = (postId) => {
        if (!user) return;
        router.post(
            route("like"),
            { post_id: postId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLiked((prev) => !prev);
                    setTotalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
                },
            }
        );
    };

    const handleSubmitComment = () => {
        if (!user || !commentBody.trim()) return;
        router.post(
            route("comments.store"),
            {
                contenido: commentBody,
                commentable_type: "App\\Models\\RegularPost",
                commentable_id: post.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const newComment = {
                        id: newCommentId + 1,
                        contenido: commentBody,
                        created_at: new Date().toISOString(),
                        user: { name: user.name, id: user.id },
                    };
                    setComments([newComment, ...comments]);
                    setCommentBody("");
                },
            }
        );
    };

    const renderFollowIcon = () => {
        if (!user || user.id === post.post.user.id) return null;
        let icon = faUserPlus;
        let color = "text-blue-500";
        let title = "Seguir";
        if (following) {
            icon = hoveringFollow ? faUserMinus : faUserCheck;
            color = hoveringFollow ? "text-red-500" : "text-green-500";
            title = hoveringFollow ? "Dejar de seguir" : "Siguiendo";
        }
        return (
            <FontAwesomeIcon
                icon={icon}
                onClick={handleFollowToggle}
                onMouseEnter={() => setHoveringFollow(true)}
                onMouseLeave={() => setHoveringFollow(false)}
                className={`text-2xl cursor-pointer transition-colors duration-200 ${color}`}
                title={title}
            />
        );
    };

    return (
        <div
            className={`cursor-default fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white shadow-lg w-full h-full flex items-center justify-center relative transform transition-all duration-300 ${
                    isVisible
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-5"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full h-full">
                    <div
                        className="w-4/5 h-full flex justify-center items-center bg-black relative"
                        onMouseEnter={() => setHoveringImage(true)}
                        onMouseLeave={() => setHoveringImage(false)}
                    >
                        <Image
                            src={`${
                                post.image.path_original
                            }?t=${new Date().getTime()}`}
                            alt={post.titulo}
                            className="object-contain max-w-full max-h-full cursor-pointer"
                            onClick={handleImageClick}
                        />
                        {hoveringImage && (
                            <button
                                onClick={handleClose}
                                className="absolute top-2 left-2 p-1 bg-black bg-opacity-50 rounded-full transition-opacity duration-200 opacity-100"
                            >
                                <XMarkIcon className="w-9 h-9 text-white" />
                            </button>
                        )}
                    </div>
                    <div className="w-1/4 h-full overflow-y-auto relative bg-[#18191C] flex flex-col">
                        <div className="flex items-center space-x-3 p-8 bg-[#292B2F]">
                            <Link href={route("users.show", post.post.user.id)}>
                                {post.post.user.profile_image?.path_small ? (
                                    <Image
                                        src={`${
                                            post.post.user.profile_image
                                                .path_small
                                        }?t=${new Date().getTime()}`}
                                        alt={post.post.user.name}
                                        className="w-14 h-14 rounded-full"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                        ?
                                    </div>
                                )}
                            </Link>
                            <Link
                                href={route("users.show", post.post.user.id)}
                                className="font-semibold text-lg text-white"
                            >
                                {post.post.user.name}
                            </Link>
                            {renderFollowIcon()}
                        </div>
                        <div className="flex justify-between items-center py-4 px-8 bg-[#202225] space-x-2">
                            {!notification && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        onMouseEnter={() =>
                                            setHoveredLike(true)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredLike(false)
                                        }
                                        className="text-xl focus:outline-none"
                                        disabled={!user}
                                        title={
                                            isLiked ? "Quitar like" : "Dar like"
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                isLiked
                                                    ? hoveredLike
                                                        ? faHeartCrack
                                                        : faHeartSolid
                                                    : faHeartRegular
                                            }
                                            className={`w-7 h-7 transition duration-200 ${
                                                isLiked
                                                    ? "text-red-600"
                                                    : "text-white"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-lg text-white">
                                        {totalLikes}
                                    </span>
                                </div>
                            )}

                            {/* Mostrar botón del mapa sólo si hay localización válida */}
                            {hasValidLocation && (
                                <button
                                    onClick={() => {
                                        setShowMap((prev) => !prev);
                                        if (showExif) setShowExif(false);
                                    }}
                                    className="text-xl focus:outline-none text-white hover:text-purple-400 transition-colors"
                                    title={
                                        showMap
                                            ? "Ocultar mapa"
                                            : "Mostrar mapa"
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faMapLocationDot}
                                        className="w-7 h-7"
                                    />
                                </button>
                            )}

                            {/* Botón info EXIF */}
                            <button
                                onClick={() => {
                                    setShowExif((prev) => !prev);
                                    if (showMap) setShowMap(false);
                                }}
                                className="flex items-center space-x-2 text-xl focus:outline-none text-white hover:text-purple-400 transition-colors"
                                title={
                                    showExif
                                        ? "Ocultar información EXIF"
                                        : "Mostrar información EXIF"
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className="w-7 h-7"
                                />
                                <span>EXIF</span>
                            </button>
                        </div>

                        {/* Contenedor mapa */}
                        <div
                            className={`transition-[max-height,opacity] duration-500 ease-in-out px-8 bg-[#202225] rounded ${
                                showMap
                                    ? "max-h-[400px] opacity-100"
                                    : "max-h-0 opacity-0 py-0"
                            }`}
                        >
                            <div
                                id="google-map"
                                className="w-full rounded"
                                style={{
                                    height: showMap ? "300px" : "0px",
                                    transition: "height 0.5s ease",
                                }}
                            />
                        </div>

{/* Contenedor EXIF */}
<div
  className={`transition-[max-height,opacity] duration-500 ease-in-out px-8 bg-[#202225] rounded overflow-hidden ${
    showExif ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
  }`}
>
  {/* Encabezado: Fecha y Marca/Modelo */}
  <div className="flex justify-between items-center text-white text-base mb-6">
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faClockRotateLeft} className="w-5 h-5" />
      {post.image.fecha_hora
        ? (() => {
            const [date, time] = post.image.fecha_hora.split(" ");
            const [year, month, day] = date.split(":");
            return `${day}/${month}/${year} ${time}`;
          })()
        : "No disponible"}
    </div>
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faCamera} className="w-5 h-5" />
      {post.image.marca || "No disponible"} | {post.image.modelo || "No disponible"}
    </div>
  </div>

  {/* Tres listas debajo */}
  <div className="flex gap-12 text-white text-base justify-center items-start">
    {/* Lista 1: Diafragma, ISO */}
    <ul className="space-y-4 flex-1">
      <li className="flex items-center gap-2">
        <img src="/exposure_icon.png" alt="Apertura" className="w-5 h-5" />
        f/{post.image.diafragma || "No disponible"}
      </li>
      <li className="flex items-center gap-2">
        <img src="/iso_icon.png" alt="ISO" className="w-5 h-5" />
        {post.image.iso !== null ? post.image.iso : "No disponible"}
      </li>
    </ul>

    {/* Lista 2: Exposición, Longitud focal */}
    <ul className="space-y-4 flex-1">
      <li className="flex items-center gap-2">
        <FontAwesomeIcon icon={faStopwatch} className="w-5 h-5" />
        {post.image.exposicion || "No disponible"} s
      </li>
      <li className="flex items-center gap-2">
        <img src="/focal_icon.png" alt="Focal" className="w-5 h-5" />
        {post.image.longitud_focal || "No disponible"}
      </li>
    </ul>

    {/* Lista 3: Flash */}
    <ul className="space-y-4 flex-1">
      <li className="flex items-center gap-2">
        <FontAwesomeIcon icon={faBoltLightning} className="w-5 h-5" />
        {post.image.flash !== null ? (post.image.flash ? "Sí" : "No") : "No disponible"}
      </li>
    </ul>
  </div>
</div>



                        <div className="px-8 py-4 bg-[#292B2F] flex-shrink-0">
                            <h2 className="text-2xl font-semibold text-white">
                                {post.titulo}
                            </h2>
                            <p className="text-sm text-white mt-2">
                                {post.descripcion}
                            </p>
                            <p className="text-sm text-white mt-2">
                                Localización:{" "}
                                {hasValidLocation
                                    ? post.image.localizacion
                                    : "No disponible"}
                            </p>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-white">
                                    Etiquetas
                                </h3>
                                {post.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
    {post.tags.map((tag) => (
        <span
            key={tag.id}
            className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
        >
            {tag.nombre}
        </span>
    ))}
</div>

                                ) : (
                                    <p className="text-sm text-white">
                                        No hay etiquetas disponibles.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto px-4 pt-6 bg-[#18191C] flex flex-col">
                            <h4 className="text-md font-semibold mb-4 text-white">
                                Comentarios
                            </h4>

                            <div className="overflow-y-auto flex-grow">
                                {comments.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No hay comentarios todavía.
                                    </p>
                                ) : (
                                    comments.map(
                                        (comment) =>
                                            comment && (
                                                <Comment
                                                    key={comment.id}
                                                    comment={comment}
                                                />
                                            )
                                    )
                                )}
                            </div>
                            <div className="flex items-center space-x-3 mb-4 mt-2">
                                <ChatBubbleOvalLeftIcon className="w-7 h-7 text-[#656769]" />
                                <textarea
                                    rows={1}
                                    value={commentBody}
                                    onChange={(e) =>
                                        setCommentBody(e.target.value)
                                    }
                                    placeholder={
                                        user
                                            ? "Escribe un comentario..."
                                            : "Debes iniciar sesión para comentar"
                                    }
                                    className="w-full border-none bg-[#2a2b2f] text-white rounded resize-none overflow-hidden ml-2"
                                    disabled={!user}
                                    onInput={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSubmitComment();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isImageOpen && (
                <div
                    className="fixed inset-0 bg-black z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={closeImageView}
                        className="absolute top-4 left-4 p-1 z-10"
                    >
                        <XMarkIcon className="text-white w-8 h-8" />
                    </button>
                    <div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={`${
                                post.image.path_original
                            }?t=${new Date().getTime()}`}
                            alt={post.titulo}
                            className="max-w-full max-h-full object-contain cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Show;
