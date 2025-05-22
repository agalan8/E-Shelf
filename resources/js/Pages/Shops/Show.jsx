import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import ShopPost from '@/Components/Shops/ShopPost';
import AddPosts from '@/Components/Shops/AddPosts';

const Show = ({ posts, shop, user, userPosts }) => {

      const [showModal, setShowModal] = useState(false);
  const isOwner = shop.user.id === user.id;

  return (
    <AuthenticatedLayout
      subnav={shop.user.id !== user.id ? <UsersSubnav currentUser={shop.user} /> : null}
    >
{isOwner && (
  <div className="w-full mx-auto px-4 mb-4 flex justify-end">
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
    >
      Añadir publicaciones a la tienda
    </button>
  </div>
)}


      <div className="w-full flex justify-center px-4">

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">Este usuario no tiene productos en venta.</p>
        ) : (
          <div className="flex flex-wrap gap-6 w-full justify-center">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-grow-0 flex-shrink-0 basis-[calc((100%/3)-16px)] max-w-[600px]"
              >
                <ShopPost post={post} />
              </div>
            ))}
          </div>
        )}

                {showModal && (
          <AddPosts
            shop={shop}
            userPosts={userPosts}
            onClose={() => setShowModal(false)}
          />
        )}

      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
