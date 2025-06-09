import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import ShopPost from '@/Components/Shops/ShopPost';
import AddPosts from '@/Components/Shops/AddPosts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Show = ({ posts, shop, user, userPosts }) => {
  const [showModal, setShowModal] = useState(false);
  const [sortPriceOrder, setSortPriceOrder] = useState('asc');
  const [sortDateOrder, setSortDateOrder] = useState('desc');
  const isOwner = shop.user.id === user.id;

  // Ordenamos los posts primero por fecha, luego por precio
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    let dateComparison = 0;
    if (sortDateOrder === 'asc') {
      dateComparison = dateA - dateB;
    } else {
      dateComparison = dateB - dateA;
    }

    if (dateComparison !== 0) return dateComparison;

    if (sortPriceOrder === 'asc') {
      return a.precio - b.precio;
    } else {
      return b.precio - a.precio;
    }
  });

  return (
    <AuthenticatedLayout
      subnav={shop.user.id !== user.id ? <UsersSubnav currentUser={shop.user} /> : null}
      header={
        <h2 className="font-semibold leading-tight text-white">
          Tienda de {shop.user.name}
        </h2>
      }
    >
                <Head title={`Tienda de ${shop.user.name}`} />

      {/* Contenedor general con justify-between */}
      <div className="w-full mx-auto px-2 sm:px-4 mb-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 md:gap-4 flex-wrap">
        {/* Siempre visibles: selectores de orden */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 my-3 w-full md:w-auto">
          {/* Selector orden fecha */}
          <select
            value={sortDateOrder}
            onChange={(e) => setSortDateOrder(e.target.value)}
            className="bg-[#292B2F] text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
          >
            <option value="desc">Más recientes primero</option>
            <option value="asc">Más antiguos primero</option>
          </select>

          {/* Selector orden precio */}
          <select
            value={sortPriceOrder}
            onChange={(e) => setSortPriceOrder(e.target.value)}
            className="bg-[#292B2F] text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
          >
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>

        {/* Solo visible para owner: botón añadir */}
        {isOwner && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 my-3 rounded hover:bg-purple-500 transition flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <FontAwesomeIcon icon={faPlus} />
            Añadir Publicaciones a la Tienda
          </button>
        )}
      </div>

      <div className="w-full flex justify-center px-2 sm:px-4">
        {sortedPosts.length === 0 ? (
          <p className="text-center text-white mt-8">Este usuario no tiene productos en venta.</p>
        ) : (
          <div className="flex flex-wrap gap-4 sm:gap-6 w-full justify-center">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[600px] sm:basis-[calc(50%-16px)] md:basis-[calc((100%/3)-16px)]"
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
