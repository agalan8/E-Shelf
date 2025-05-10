import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Comment from '@/Components/Comments/Comment';

const Show = ({ post, onClose }) => {
  const { auth, newCommentId } = usePage().props;
  const user = auth?.user || null;

  const [isVisible, setIsVisible] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [following, setFollowing] = useState(user?.following?.some(f => f.id === post.user.id) || false);
  const [hovering, setHovering] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [commentId, setCommentId] = useState(null);

  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [hoveredLike, setHoveredLike] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post.getTotalLikes || 0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!post) return null;

  const handleFollowToggle = () => {
    if (!user) return;

    if (following) {
      router.delete(`/unfollow/${post.user.id}`, {
        onSuccess: () => setFollowing(false),
        preserveScroll: true
      });
    } else {
      router.post('/follow', { followed_user_id: post.user.id }, {
        onSuccess: () => setFollowing(true),
        preserveScroll: true
      });
    }
  };

  const handleImageClick = () => setIsImageOpen(true);
  const closeImageView = () => setIsImageOpen(false);

  const renderFollowIcon = () => {
    if (!user || user.id === post.user.id) return null;

    let icon = faUserPlus;
    let color = 'text-blue-500';
    let title = 'Seguir';

    if (following) {
      icon = hovering ? faUserMinus : faUserCheck;
      color = hovering ? 'text-red-500' : 'text-green-500';
      title = hovering ? 'Dejar de seguir' : 'Siguiendo';
    }

    return (
      <FontAwesomeIcon
        icon={icon}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`text-2xl cursor-pointer transition-colors duration-200 ${color}`}
        title={title}
      />
    );
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

  const toggleLike = (postId) => {
    if (!user) return;

    router.post(route('like'), { post_id: postId }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLiked(prev => !prev);
        setTotalLikes(prev => isLiked ? prev - 1 : prev + 1);
      },
    });
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative transition-transform duration-500 transform ${isVisible ? 'scale-100' : 'scale-90'} max-h-[80vh] overflow-y-auto`}>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 absolute top-2 right-2">X</button>

        {/* Usuario */}
        <div className="flex items-center space-x-3 mb-4">
          <Link href={route('users.show', post.user.id)}>
            <img
              src={`${post.user.profile_image.path_small}`}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>
          <Link
            href={route('users.show', post.user.id)}
            className="font-semibold text-blue-500"
          >
            {post.user.name}
          </Link>
          {renderFollowIcon()}
        </div>

        {/* Imagen */}
        <div className="relative">
          <img
            src={`${post.image.path_original}?t=${new Date().getTime()}`}
            alt={post.titulo}
            className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer"
            onClick={handleImageClick}
          />
        </div>

        {/* Info */}
        <h2 className="text-2xl font-semibold">{post.titulo}</h2>
        <p className="text-sm text-gray-500 mb-2">Localización: {post.image.localizacion}</p>
        <p className="text-lg">{post.descripcion}</p>

        {/* Categorías */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
          {post.tags.map((tag) => (
            <p key={tag.id}>{tag.nombre}</p>
          ))}
        </div>

        {/* Botón de me gusta */}
        <div className="mt-4 flex items-center space-x-2">
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
              className={`transition duration-200 ${
                isLiked ? 'text-red-600' : 'text-gray-500'
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">{totalLikes}</span>
        </div>

        {/* Comentario input */}
        <div className="mt-2">
          <textarea
            rows={1}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder={user ? "Escribe un comentario..." : "Debes iniciar sesión para comentar"}
            className="w-full p-2 border border-gray-300 rounded resize-none overflow-hidden"
            disabled={!user}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!user}
            className={`mt-2 px-4 py-2 rounded ${user ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
          >
            Comentar
          </button>
        </div>

        {/* Comentarios */}
        <div className="mt-6 max-h-[300px] overflow-y-auto">
          <h4 className="text-md font-semibold mb-2">Comentarios</h4>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No hay comentarios todavía.</p>
          ) : (
            comments.map((comment) => (
              comment ? <Comment key={comment.id} comment={comment} /> : null
            ))
          )}
        </div>
      </div>

      {/* Imagen full-screen */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <button
            onClick={closeImageView}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            X
          </button>
          <img
            src={`${post.image.path_original}?t=${new Date().getTime()}`}
            alt={post.titulo}
            className="max-w-full max-h-full object-contain cursor-pointer"
            onClick={closeImageView}
          />
        </div>
      )}
    </div>
  );
};

export default Show;
