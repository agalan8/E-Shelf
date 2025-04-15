import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';

const MisPosts = ({ posts, tags }) => {
  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Mis Publicaciones</h2>}
      subnav={<UsersSubnav />}
    >
      <Head title="Mis publicaciones" />
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Mis Publicaciones</h2>

        {posts.length === 0 ? (
          <p>No tienes publicaciones aún.</p>
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

export default MisPosts;
