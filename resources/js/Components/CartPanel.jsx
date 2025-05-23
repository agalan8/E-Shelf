import { usePage, router } from '@inertiajs/react';
import { UserIcon } from '@heroicons/react/24/outline';

// Importa FontAwesome y el icono faMoneyBillWave
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

export default function CartPanel() {
    const { auth } = usePage().props;
    const lineasCarrito = auth.user?.lineas_carrito || [];

    const handleRemove = (shopPostId) => {
        router.post(route('linea-carrito.remove'), { shop_post_id: shopPostId }, {
            preserveScroll: true,
        });
    };

    const totalPrecio = lineasCarrito.reduce((acc, linea) => {
        const precio = Number(linea.shop_post?.precio) || 0;
        return acc + precio;
    }, 0);

    return (
        <div className="w-[400px] relative" style={{ paddingBottom: "100px", overflow: 'hidden' }}>
            {lineasCarrito.length === 0 ? (
                <div className="text-gray-400 text-center py-16">Tu carrito está vacío</div>
            ) : (
                <div
                    className="overflow-y-auto p-6"
                    style={{ maxHeight: "calc(100vh - 135px)" }}
                >
                    {lineasCarrito.map((linea) => {
                        const post = linea.shop_post?.regular_post;
                        const author = linea.shop_post?.post.user;
                        const precio = linea.shop_post?.precio ?? null;

                        return (
                            <div
                                key={linea.id}
                                className="rounded-xl shadow-lg overflow-hidden flex items-center space-x-6 p-4 min-h-[70px] mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, #8C6FC1 0%, #4A4A55 60%, #2E2D3A 100%)'
                                }}
                            >
                                {/* Imagen */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md bg-gray-700">
                                    {post?.image?.path_small ? (
                                        <img
                                            src={post.image.path_small}
                                            alt={post.titulo || 'Imagen del producto'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs select-none">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                                    <p className="text-white font-bold text-base truncate">{post?.titulo || 'Sin título'}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <p className="text-gray-400 text-sm truncate">{author?.name || 'Desconocido'}</p>
                                    </div>
                                    {precio !== null && (
                                        <div className="mt-1 inline-flex items-center rounded bg-green-600 bg-opacity-90 px-2 py-0.5 text-white font-semibold text-sm w-max">
                                            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                                            {precio} €
                                        </div>
                                    )}
                                </div>

                                {/* Botón eliminar */}
                                <button
                                    onClick={() => handleRemove(linea.shop_post.id)}
                                    className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xl font-bold shadow-lg transition"
                                    title="Eliminar del carrito"
                                    aria-label="Eliminar del carrito"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Total fijo abajo */}
            {lineasCarrito.length > 0 && (
                <div className="fixed bottom-0 right-0 w-[400px] bg-[#1A1D1F] p-4 border-t border-gray-700 flex justify-between items-center text-white font-bold text-lg shadow-lg">
                    <span>Total:</span>
                    <span>{totalPrecio.toFixed(2)} €</span>
                </div>
            )}
        </div>
    );
}
