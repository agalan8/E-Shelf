import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Show from '@/Components/Posts/Show';
import Edit from '@/Components/Posts/Edit';

const Post = ({ post, tags }) => {
  const { auth } = usePage().props;
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenShowModal = () => {
    setSelectedPost(post);
    setShowModalOpen(true);
  };

  const handleCloseShowModal = () => {
    setShowModalOpen(false);
    setSelectedPost(null);
  };

  const handleOpenEditModal = () => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setIsDeleting(true);
      try {
        await router.delete(route('posts.destroy', post.id), {
          preserveScroll: true,
        });
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const canEditOrDelete = auth.user && (auth.user.id === post.user.id || auth.user.is_admin);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Foto de perfil y nombre del usuario */}
      <div className="flex items-center space-x-3 mb-4">
        <Link href={route('users.show', post.user.id)}>
          {post.user.profile_image?.path_small ? (
            <img
              src={`${post.user.profile_image.path_small}?t=${new Date().getTime()}`}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
              ?
            </div>
          )}
        </Link>
        <Link
          href={route('users.show', post.user.id)}
          className="font-semibold text-blue-500"
        >
          {post.user.name}
        </Link>
      </div>

      {/* Imagen y contenido de la publicación */}
      <img
        src={`${post.image.path_medium}?t=${new Date().getTime()}`}
        alt={post.titulo}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold">{post.titulo}</h3>
      <p className="text-sm text-gray-500">{post.descripcion}</p>
      <p className="text-sm text-gray-400">{post.localizacion}</p>

      {/* Botón para abrir el modal de detalles */}
      <button onClick={handleOpenShowModal} className="text-blue-500 mt-2">
        Ver detalles
      </button>

      {/* Botones solo visibles si el usuario tiene permiso */}
      {canEditOrDelete && (
        <>
          <button onClick={handleOpenEditModal} className="text-green-500 mt-2 ml-4">
            Editar
          </button>
          <button
            onClick={handleDeletePost}
            className="text-red-500 mt-2 ml-4"
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </>
      )}

      {/* Mostrar el modal con la publicación seleccionada */}
      {showModalOpen && selectedPost && (
        <Show post={selectedPost} onClose={handleCloseShowModal} />
      )}

      {/* Mostrar el modal de edición */}
      {editModalOpen && selectedPost && (
        <Edit post={selectedPost} tags={tags} onClose={handleCloseEditModal} />
      )}
    </div>
  );
};

export default Post;
