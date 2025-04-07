import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react'; // usePage para obtener información de la página
import Show from '@/Components/Posts/Show'; // Asegúrate de importar el componente Show
import Edit from '@/Components/Posts/Edit'; // Importa el componente Edit

const Post = ({ post, tags }) => {
  const { auth } = usePage().props; // Obtener el usuario autenticado desde Inertia
  const [showModalOpen, setShowModalOpen] = useState(false); // Estado para controlar el modal de detalles
  const [editModalOpen, setEditModalOpen] = useState(false); // Estado para controlar el modal de edición
  const [selectedPost, setSelectedPost] = useState(null); // Estado para almacenar la publicación seleccionada
  const [isDeleting, setIsDeleting] = useState(false); // Estado para manejar el proceso de eliminación

  // Función para abrir el modal de detalles
  const handleOpenShowModal = () => {
    setSelectedPost(post); // Establece la publicación seleccionada
    setShowModalOpen(true); // Abre el modal de detalles
  };

  // Función para cerrar el modal de detalles
  const handleCloseShowModal = () => {
    setShowModalOpen(false); // Cierra el modal de detalles
    setSelectedPost(null); // Limpia la publicación seleccionada
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = () => {
    setSelectedPost(post); // Establece la publicación seleccionada
    setEditModalOpen(true); // Abre el modal de edición
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditModalOpen(false); // Cierra el modal de edición
    setSelectedPost(null); // Limpia la publicación seleccionada
  };

  // Función para eliminar la publicación
  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setIsDeleting(true); // Activar el estado de "eliminando" mientras la solicitud se procesa

      try {
        // Enviar solicitud DELETE a posts.destroy utilizando Inertia.js
        await router.delete(route('posts.destroy', post.id), {
          preserveScroll: true, // Mantener el scroll de la página
        });
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
      } finally {
        setIsDeleting(false); // Desactivar el estado de "eliminando"
      }
    }
  };


  const canEditOrDelete = auth.user && (auth.user.id === post.user.id || auth.user.is_admin);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Foto de perfil y nombre del usuario */}
      <div className="flex items-center space-x-3 mb-4">
        <Link href={route('users.show', post.user.id)}>
          <img
            src={`/storage/${post.user.profile_image}`}
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
      </div>

      {/* Imagen y contenido de la publicación */}
      <img
        src={`/storage/${post.photo.url}?t=${new Date().getTime()}`}
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
          {/* Botón para abrir el modal de edición */}
          <button onClick={handleOpenEditModal} className="text-green-500 mt-2 ml-4">
            Editar
          </button>

          {/* Botón para eliminar la publicación */}
          <button
            onClick={handleDeletePost}
            className="text-red-500 mt-2 ml-4"
            disabled={isDeleting} // Desactivar el botón mientras se está eliminando
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
