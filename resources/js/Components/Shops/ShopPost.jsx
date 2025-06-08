import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faPencil,
  faCartPlus,
  faCartArrowDown
} from "@fortawesome/free-solid-svg-icons";
import Edit from "@/Components/ShopPosts/Edit";
import { useToast } from "@/contexts/ToastProvider"; // Importa el hook

const ShopPost = ({ post }) => {
  const { auth } = usePage().props;
  const isOwner = post.post.user.id === auth.user.id;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Carrito del usuario autenticado
  const lineasCarrito = auth?.user?.lineas_carrito || [];

  // Verifica si el producto ya está en el carrito
  const estaEnCarrito = lineasCarrito.some(
    (linea) => linea.shop_post_id === post.id
  );

  const { showToast } = useToast(); // Usa el hook

  const handleRemoveFromShop = () => {
    if (confirm("¿Eliminar esta publicación de la tienda?")) {
      router.delete(route("shop-posts.destroy", post.id), {
        onSuccess: () => {
          showToast("Publicación eliminada de la tienda.", "success");
        },
      });
    }
  };

  const handleDeletePost = () => {
    if (confirm("¿Eliminar esta publicación permanentemente?")) {
      router.delete(route("regular-posts.destroy", post.regular_post.id), {
        onSuccess: () => {
          showToast("Publicación eliminada permanentemente.", "success");
        },
      });
    }
  };

  const handleEditPost = () => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = (wasEdited = false) => {
    setEditModalOpen(false);
    setSelectedPost(null);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    router.post(route("linea-carrito.add"), {
      shop_post_id: post.id,
    }, {
      onSuccess: () => {
        showToast("¡Publicación añadida al carrito!", "success");
      },
    });
  };

  // Quitar del carrito
  const handleRemoveFromCart = () => {
    router.post(route("linea-carrito.remove"), {
      shop_post_id: post.id,
    }, {
      onSuccess: () => {
        showToast("Publicación eliminada del carrito.", "success");
      },
    });
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#2d2d30] to-[#1f1f21] rounded-xl p-2 sm:p-[6px] shadow-inner shadow-[#111] border border-[#3a3a3d] w-full max-w-full group">
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-[#ffffff1a] flex flex-col h-full relative">

          {/* Botones del dueño */}
          {isOwner && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex flex-col gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={handleRemoveFromShop}
                className="w-8 h-8 bg-[#3a3a3d] text-white rounded hover:bg-red-600 flex items-center justify-center"
                title="Eliminar de la tienda"
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
              <button
                onClick={handleEditPost}
                className="w-8 h-8 bg-[#3a3a3d] text-white rounded hover:bg-yellow-500 flex items-center justify-center"
                title="Editar precio"
              >
                <FontAwesomeIcon icon={faPencil} size="sm" />
              </button>
              <button
                onClick={handleDeletePost}
                className="w-8 h-8 bg-[#3a3a3d] text-white rounded hover:bg-red-700 flex items-center justify-center"
                title="Eliminar publicación"
              >
                <FontAwesomeIcon icon={faTrash} size="sm" />
              </button>
            </div>
          )}

          {/* Imagen */}
          <div className="w-full h-[180px] sm:h-[320px] bg-[#505050] flex items-center justify-center overflow-hidden p-2 sm:p-4">
            {post.regular_post.image?.path_small && (
              <img
                src={post.regular_post.image.path_small}
                alt=""
                className="max-w-[200px] max-h-[120px] sm:max-w-[400px] sm:max-h-[260px] object-contain shadow-2xl shadow-black transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            )}
          </div>

          {/* Precio y botón de carrito (solo si NO es dueño) */}
          <div className="p-1 sm:p-2 flex justify-center items-center gap-2 sm:gap-3">
            <span className="text-[#f0f0f0] font-bold text-base sm:text-lg bg-[#29292c] px-2 py-1 sm:px-4 rounded-lg shadow-md border border-[#3f3f42]">
              {post.precio} €
            </span>

            {!isOwner && (
              <>
                {estaEnCarrito ? (
                  <button
                    onClick={handleRemoveFromCart}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center"
                    title="Quitar del carrito"
                  >
                    <FontAwesomeIcon icon={faCartArrowDown} />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded flex items-center justify-center"
                    title="Añadir al carrito"
                  >
                    <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {editModalOpen && selectedPost && (
        <Edit post={selectedPost} onClose={handleCloseEditModal} />
      )}
    </>
  );
};

export default ShopPost;
