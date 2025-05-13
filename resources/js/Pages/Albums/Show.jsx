import React, { useState, useEffect } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Post from '@/Components/Posts/Post';
import Edit from '@/Components/Albums/Edit';
import AddPosts from '@/Components/Albums/AddPosts'; // Importamos el modal AddPosts

const Show = ({ album, userPosts }) => {
  const [posts, setPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPostsModalOpen, setIsAddPostsModalOpen] = useState(false); // Nuevo estado para el modal de AddPosts

  useEffect(() => {
    if (album && album.posts) {
      setPosts(album.posts);
    }
  }, [album]);

  // Función para abrir el modal de añadir publicaciones
  const handleOpenAddPostsModal = () => {
    setIsAddPostsModalOpen(true);
  };

  // Función para cerrar el modal de añadir publicaciones
  const handleCloseAddPostsModal = () => {
    setIsAddPostsModalOpen(false);
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Función para eliminar un post del álbum
  const handleDeletePost = (postId) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación del álbum?')) {
        router.delete(route('albums.posts.destroy', { album: album.id, post: postId }), {
            preserveScroll: true,
        });
    }

  };

  return (
    <AuthenticatedLayout
      header={<h2 className=" font-semibold leading-tight text-gray-800">{album.titulo}</h2>}
    >
      <Head title="Mis Álbumes" />
      <div className="container mx-auto p-4">
        {/* Enlace para volver a Mis Álbumes */}
        <div className="mb-4">
          <Link
            href={route('mis-albums')}
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

        {/* Título del álbum */}
        <h1 className="text-3xl font-semibold mb-2">{album.nombre}</h1>

        {/* Usuario al que pertenece el álbum */}
        <div className="text-lg text-gray-700 mb-4">
          <strong>Creado por:</strong> {album.user.name}
        </div>

        {/* Descripción del álbum */}
        <div className="text-md text-gray-600 mb-4">
          <strong>Descripción:</strong>
          <p>{album.descripcion}</p>
        </div>

        {/* Botón para añadir una publicación */}
        <div className="mb-4">
          <button
            onClick={handleOpenAddPostsModal} // Abre el modal AddPosts
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Añadir Publicación
          </button>
        </div>

        {/* Lista de Posts del álbum en un grid de 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length === 0 ? (
            <p>No hay publicaciones en este álbum.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="relative">
                {/* Botón de eliminar */}
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <span className="text-lg">&times;</span> {/* X */}
                </button>

                {/* Componente Post */}
                <Post post={post} tags={post.tags || []} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mostrar el modal de edición */}
      {isEditModalOpen && <Edit album={album} onClose={handleCloseEditModal} />}

      {/* Mostrar el modal de añadir posts */}
      {isAddPostsModalOpen && <AddPosts album={album} onClose={handleCloseAddPostsModal} userPosts={userPosts} />}
    </AuthenticatedLayout>
  );
};

export default Show;
