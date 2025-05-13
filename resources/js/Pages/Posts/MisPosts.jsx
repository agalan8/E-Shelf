import { Head } from '@inertiajs/react';
import Post from '@/Components/Posts/Post';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';

const MisPosts = ({ posts, tags }) => {
  return (
    <AuthenticatedLayout
      header={<h2 className=" font-semibold leading-tight text-gray-800">Mis Publicaciones</h2>}
      subnav={<UsersSubnav />}
    >
      <Head title="Mis publicaciones" />
      <div className="container">

        {posts.length === 0 ? (
          <p>No tienes publicaciones aún.</p>
        ) : (
            <div className="flex gap-1">
                {[0, 1, 2].map((colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-1 flex-1">
                    {posts
                        .filter((_, index) => index % 3 === colIndex)
                        .map((post) => (
                        <Post key={post.id} post={post} tags={tags} />
                        ))}
                    </div>
                ))}
                </div>

        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default MisPosts;
