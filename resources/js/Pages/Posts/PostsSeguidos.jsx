import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HomeSubnav from '@/Components/Subnavs/HomeSubnav';

const PostsSeguidos = ({ posts, tags }) => {
  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Seguidos</h2>}
      subnav={<HomeSubnav />}
    >
      <Head title="Mis publicaciones" />
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Seguidos</h2>

        {posts.length === 0 ? (
          <p>No sigues a nadie aún aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} tags={tags} />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default PostsSeguidos;
