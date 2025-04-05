import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Post from '@/Components/Posts/Post'; // Asegúrate de importar el componente Post


const Show = ({ album }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Aquí podrías obtener los posts del álbum si es que no los tienes cargados previamente
    // Si ya los tienes en el objeto 'album', puedes omitir esta parte
    if (album && album.posts) {
      setPosts(album.posts);
    }
  }, [album]);

  const handleAddPost = () => {
    // Lógica para añadir una publicación al álbum
    console.log('Añadir publicación');
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{album.titulo}</h2>}
    >
        <Head title="Mis Álbumes" />
        <div className="container mx-auto p-4">
        {/* Botón de Editar */}
        <div className="flex justify-end mb-4">
            <Link
            href={`/albums/${album.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
            Editar
            </Link>
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
            onClick={handleAddPost}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
            Añadir Publicación
            </button>
        </div>

        {/* Lista de Posts del álbum */}
        <div className="space-y-4">
            {posts.length === 0 ? (
            <p>No hay publicaciones en este álbum.</p>
            ) : (
            posts.map((post) => (
                <Post key={post.id} post={post} tags={post.tags || []} />
            ))
            )}
        </div>
        </div>
    </AuthenticatedLayout>
  );
};

export default Show;
