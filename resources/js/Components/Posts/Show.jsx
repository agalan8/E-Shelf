import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUserMinus,
  faUserCheck,
  faHeart as faHeartSolid,
  faHeartCrack,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { XMarkIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid'; // ✅ Importado
import Comment from '@/Components/Comments/Comment';
import Image from '../Image';

const Show = ({ post, onClose, isLiked, setIsLiked, totalLikes, setTotalLikes }) => {
  const { auth, newCommentId } = usePage().props;
  const user = auth?.user || null;

  const [isVisible, setIsVisible] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [following, setFollowing] = useState(user?.following?.some(f => f.id === post.user.id) || false);
  const [hoveringFollow, setHoveringFollow] = useState(false); // Hover separado para el ícono de seguir
  const [hoveringImage, setHoveringImage] = useState(false); // Hover separado para la imagen
  const [commentBody, setCommentBody] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [commentId, setCommentId] = useState(null);
  const [hoveredLike, setHoveredLike] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!post) return null;

  const handleFollowToggle = () => {
    if (!user) return;

    if (following) {
      router.delete(`/unfollow/${post.user.id}`, {
        onSuccess: () => setFollowing(false),
        preserveScroll: true,
      });
    } else {
      router.post('/follow', { followed_user_id: post.user.id }, {
        onSuccess: () => setFollowing(true),
        preserveScroll: true,
      });
    }
  };

  const handleImageClick = () => setIsImageOpen(true);
  const closeImageView = () => setIsImageOpen(false);

  const toggleLike = (postId) => {
    if (!user) return;

    router.post(route('like'), { post_id: postId }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLiked(prev => !prev);
        setTotalLikes(prev => isLiked ? prev - 1 : prev + 1);
      }
    });
  };

  const handleSubmitComment = () => {
    if (!user || !commentBody.trim()) return;

    router.post(route('comments.store'), {
      contenido: commentBody,
      commentable_type: 'App\\Models\\Post',
      commentable_id: post.id,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        const newComment = {
          id: newCommentId + 1,
          contenido: commentBody,
          created_at: new Date().toISOString(),
          user: {
            name: user.name,
            id: user.id,
          },
        };

        setCommentId(newCommentId);
        setComments([newComment, ...comments]);
        setCommentBody('');
      },
    });
  };

  const renderFollowIcon = () => {
    if (!user || user.id === post.user.id) return null;

    let icon = faUserPlus;
    let color = 'text-blue-500';
    let title = 'Seguir';

    if (following) {
      icon = hoveringFollow ? faUserMinus : faUserCheck;
      color = hoveringFollow ? 'text-red-500' : 'text-green-500';
      title = hoveringFollow ? 'Dejar de seguir' : 'Siguiendo';
    }

    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHoveringFollow(true)} // Solo afecta al hover del ícono de seguir
        onMouseLeave={() => setHoveringFollow(false)} // Solo afecta al hover del ícono de seguir
        className={`text-2xl cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
      />
    );
  };

  return (
    <div
      className={`cursor-default fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white shadow-lg w-full h-full flex items-center justify-center relative transition-transform duration-500 transform ${isVisible ? 'scale-100' : 'scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex w-full h-full">
          {/* Contenedor imagen */}
          <div
            className="w-4/5 h-full flex justify-center items-center bg-black relative"
            onMouseEnter={() => setHoveringImage(true)} // Hover sobre la imagen
            onMouseLeave={() => setHoveringImage(false)} // Cuando el ratón sale de la imagen
          >
            <Image
              src={`${post.image.path_original}?t=${new Date().getTime()}`}
              alt={post.titulo}
              className="object-contain max-w-full max-h-full cursor-pointer"
              onClick={handleImageClick}
            />
            {/* Botón superior izquierdo al hacer hover sobre la imagen */}
            {hoveringImage && (
              <button
                onClick={onClose}
                className="absolute top-2 left-2 p-1 bg-black bg-opacity-50 rounded-full transition-opacity duration-200 opacity-100"
              >
                <XMarkIcon className="w-9 h-9 text-white" />
              </button>
            )}
          </div>

          {/* Panel lateral */}
          <div className="w-1/4 h-full overflow-y-auto relative bg-[#18191C]">
            {/* Franja de color #292B2F para la foto y el nombre */}
            <div
              className="flex items-center space-x-3 p-8 bg-[#292B2F]"
            >
              <Link href={route('users.show', post.user.id)}>
                {post.user.profile_image?.path_small ? (
                  <Image
                    src={`${post.user.profile_image.path_small}?t=${new Date().getTime()}`}
                    alt={post.user.name}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                    ?
                  </div>
                )}
              </Link>
              <Link href={route('users.show', post.user.id)} className="font-semibold text-lg text-white">
                {post.user.name}
              </Link>
              {renderFollowIcon()}
            </div>

            {/* Nueva franja para el icono de me gusta */}
            <div
              className="flex justify-start items-center space-x-2 py-4 px-8"
              style={{ backgroundColor: '#202225' }} // Nueva franja con color #202225
            >
              <button
                onClick={() => toggleLike(post.id)}
                onMouseEnter={() => setHoveredLike(true)}
                onMouseLeave={() => setHoveredLike(false)}
                className="text-xl focus:outline-none"
                disabled={!user}
              >
                <FontAwesomeIcon
                  icon={
                    isLiked
                      ? hoveredLike
                        ? faHeartCrack
                        : faHeartSolid
                      : faHeartRegular
                  }
                  className={`w-7 h-7 transition duration-200 ${isLiked ? 'text-red-600' : 'text-white'}`}
                />
              </button>
              <span className="text-lg text-white">{totalLikes}</span>
            </div>

            {/* Nueva franja para Titulo, Descripción, Localización y Categorías */}
            <div className="px-8 py-4 bg-[#292B2F]">
              {/* Título */}
              <h2 className="text-2xl font-semibold text-white">{post.titulo}</h2>

              {/* Descripción */}
              <p className="text-sm text-white mt-2">{post.descripcion}</p>

              {/* Localización */}
              <p className="text-sm text-white mt-2">Localización: {post.image.localizacion}</p>

              {/* Categorías */}
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white">Categorías</h3>
                {post.tags.length > 0 ? (
                  <ul className="list-disc ml-4 text-white">
                    {post.tags.map((tag) => (
                      <li key={tag.id}>{tag.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-white">No hay categorías disponibles.</p>
                )}
              </div>
            </div>

            {/* Fijo el campo de comentarios al final del panel */}
            <div className="absolute bottom-0 w-full bg-[#2a2b2f] px-2 py-1">
              <div className="flex items-center space-x-3">
                {/* Icono de comentario */}
                <ChatBubbleOvalLeftIcon className="w-7 h-7 text-[#656769]" />
                <textarea
                  rows={1}
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder={user ? "Escribe un comentario..." : "Debes iniciar sesión para comentar"}
                  className="w-full border-none bg-[#2a2b2f] text-white rounded resize-none overflow-hidden ml-2"
                  disabled={!user}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
              </div>
            </div>

            <div className="pt-6 px-4 max-h-[500px] overflow-y-auto bg-[#18191C]">
              <h4 className="text-md font-semibold mb-4 text-white">Comentarios</h4>
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No hay comentarios todavía.</p>
              ) : (
                comments.map((comment) => (
                  comment ? <Comment key={comment.id} comment={comment} /> : null
                ))
              )}
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
              src={`${post.image.path_original}?t=${new Date().getTime()}`}
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
