import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Show from '@/Components/Posts/Show';
import Edit from '@/Components/Posts/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { PencilIcon as PencilOutline } from '@heroicons/react/24/outline';
import { PencilIcon as PencilSolid } from '@heroicons/react/24/solid';
import { TrashIcon as TrashOutline } from '@heroicons/react/24/outline';
import { TrashIcon as TrashSolid } from '@heroicons/react/24/solid';
import Image from '@/Components/Image';

const Post = ({ post, tags, isLikedByUser, getTotalLikes }) => {
  const { auth } = usePage().props;
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [totalLikes, setTotalLikes] = useState(getTotalLikes || 0);
  const [hovered, setHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    if (!auth.user) return;

    router.post(route('like'), { post_id: post.id }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLiked(prev => !prev);
        setTotalLikes(prev => isLiked ? prev - 1 : prev + 1);
      },
    });
  };

  console.log('post:', post);

  console.log('isLiked:', isLiked);
    console.log('totalLikes:', totalLikes);

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
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      router.delete(route('regular-posts.destroy', post.id), {
        preserveScroll: true,
      });
    }
  };

  const canEdit = auth.user && (auth.user.id === post.post.user.id || auth.user.is_admin);

  return (
    <div className="relative group cursor-pointer" style={{ display: 'inline-block', lineHeight: 0 }}>
      <Image
        src={`${post.image.path_medium}?t=${new Date().getTime()}`}
        alt={post.titulo}
        className="w-full h-auto object-contain"
        loading="lazy"
        onClick={handleOpenShowModal}
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800/60 backdrop-blur-sm text-white px-4 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 group-hover:py-2 transition-all duration-300 text-sm">
        {/* Usuario */}
        <div className="flex items-center space-x-2">
          {post.post.user.profile_image?.path_small ? (
            <Image
              src={`${post.post.user.profile_image.path_small}?t=${new Date().getTime()}`}
              alt={post.post.user.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">?</div>
          )}
          <Link
            href={route('users.show', post.post.user.id)}
            className="hover:underline text-base font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {post.post.user.name}
          </Link>
        </div>

        {/* Likes y acciones */}
        <div className="flex items-center space-x-3">
          {/* Botón me gusta */}
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
              className={`transition duration-200 ${isLiked ? 'text-red-500' : 'text-white'}`}
            />
          </button>
          <span className="text-sm">{totalLikes}</span>

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
          isOpen={editModalOpen} // <-- Añade esta línea
        />
      )}
    </div>
  );
};

export default Post;
