import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import Busqueda from "@/Components/Busqueda";
import Edit from "@/Components/Users/Edit";
import CartPanel from "@/Components/CartPanel";
import NotificationsPanel from "@/Components/Notifications/NotificationsPanel";
import Show from "@/Components/Posts/Show"; // Modal full screen para post
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import {
  GlobeAsiaAustraliaIcon,
  ArrowUpTrayIcon,
  UserIcon,
  RectangleStackIcon,
  SwatchIcon,
  AtSymbolIcon,
  Cog8ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersGear,
  faUsers,
  faStore,
  faCartShopping,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

export default function AuthenticatedLayout({ header, children, subnav }) {
  const {
    auth: { user },
    mustVerifyEmail,
    status,
    socials,
    notifications = [],
    unreadNotificationCount,
  } = usePage().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifVisible, setIsNotifVisible] = useState(false);

  // Estado para modal full screen Show (post)
  const [modalPost, setModalPost] = useState(null);

  const cartPanelRef = useRef(null);
  const notifPanelRef = useRef(null);

  const openCart = () => {
    setIsCartOpen(true);
    setTimeout(() => setIsCartVisible(true), 10);
  };
  const closeCart = () => {
    setIsCartVisible(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  const openNotif = () => {
    setIsNotifOpen(true);
    setTimeout(() => setIsNotifVisible(true), 10);
  };
  const closeNotif = () => {
    setIsNotifVisible(false);
    setTimeout(() => setIsNotifOpen(false), 300);
    router.post("/notifications/read", {}, { preserveScroll: true });
  };

  // Función que abre modal full screen con el post
  const openPostModal = (post) => {
    setModalPost(post);
  };
  const closePostModal = () => {
    setModalPost(null);
  };



  useEffect(() => {
    function handleClickOutsideCart(event) {
      if (cartPanelRef.current && !cartPanelRef.current.contains(event.target)) {
        closeCart();
      }
    }
    if (isCartVisible) {
      document.addEventListener("mousedown", handleClickOutsideCart);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideCart);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCart);
    };
  }, [isCartVisible]);

  useEffect(() => {
    function handleClickOutsideNotif(event) {
      if (notifPanelRef.current && !notifPanelRef.current.contains(event.target)) {
        closeNotif();
      }
    }
    if (isNotifVisible) {
      document.addEventListener("mousedown", handleClickOutsideNotif);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideNotif);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNotif);
    };
  }, [isNotifVisible]);

  const handleSearch = (query, filter) => {
    console.log("Buscando:", query, "Filtro:", filter);
  };

  const lineasCarrito = user?.lineas_carrito || [];
  const cantidadLineas = lineasCarrito.length;

  return (
    <div className="h-screen flex bg-[#373841] relative overflow-x-hidden min-w-0">
      {/* Sidebar */}
      <aside className="bg-[#1A1D1F] text-white w-20 flex-shrink-0 h-full border-r border-gray-800 hidden sm:flex flex-col z-50">
        <div className="flex items-center justify-center h-16 border-b border-gray-700 px-4">
          <Link href="/">
            <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-3 flex flex-col items-center">
          <NavLink
            title="Home"
            href={route("posts-seguidos")}
            active={route().current("posts-seguidos")}
            className="flex justify-center"
          >
            <HomeIcon className="h-9 w-9" />
          </NavLink>
          <NavLink
            href={route("explorar")}
            active={route().current("explorar")}
            className="flex justify-center"
          >
            <GlobeAsiaAustraliaIcon className="h-9 w-9" />
          </NavLink>
          <NavLink
            href={route("users.show", { user: user.id })}
            active={route().current("users.show")}
            className="flex justify-center"
          >
            <UserIcon className="h-9 w-9" />
          </NavLink>

          <button
            onClick={() => (isNotifOpen ? closeNotif() : openNotif())}
            className="mt-2 flex items-center justify-center text-white hover:text-gray-300 px-2 py-2 rounded-xl hover:bg-[#2A2D2F] relative"
            title="Notificaciones"
          >
            <FontAwesomeIcon icon={faBell} className="h-9 w-9" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E0B0FE] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <NavLink
            href={route("regular-posts.create")}
            active={route().current("regular-posts.create")}
            className="flex justify-center mt-4"
          >
            <ArrowUpTrayIcon className="h-9 w-9" />
          </NavLink>
          <NavLink
            href={route("shops.show", { shop: user.shop.id })}
            active={route().current("shops.show")}
            className="flex justify-center"
          >
            <FontAwesomeIcon icon={faStore} className="h-9 w-9" />
          </NavLink>
          <NavLink
            href={route("communities.index")}
            active={route().current("communities.index")}
            className="flex justify-center"
          >
            <FontAwesomeIcon icon={faUsers} className="h-9 w-9" />
          </NavLink>

          {user.is_admin && (
            <div className="flex flex-col space-y-3 border-t border-gray-700 pt-3">
              <NavLink
                href={route("users.index")}
                active={route().current("users.index")}
                className="flex justify-center"
              >
                <FontAwesomeIcon icon={faUsersGear} className="h-9 w-9" />
              </NavLink>
              <NavLink
                href={route("regular-posts.index")}
                active={route().current("regular-posts.index")}
                className="flex justify-center"
              >
                <RectangleStackIcon className="h-9 w-9" />
              </NavLink>
              <NavLink
                href={route("tags.index")}
                active={route().current("tags.index")}
                className="flex justify-center"
              >
                <SwatchIcon className="h-9 w-9" />
              </NavLink>
              <NavLink
                href={route("socials.index")}
                active={route().current("socials.index")}
                className="flex justify-center"
              >
                <AtSymbolIcon className="h-9 w-9" />
              </NavLink>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center hover:text-gray-300 text-sm px-2 py-2 rounded hover:bg-[#2A2D2F]"
            >
              <Cog8ToothIcon className="h-9 w-9" />
            </button>
          </div>

          <div className="flex justify-center">
            <NavLink
              href={route("logout")}
              method="post"
              className="flex justify-center"
            >
              <ArrowLeftStartOnRectangleIcon className="h-9 w-9" />
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Subnav */}
      {subnav && (
        <div className="w-[265px] bg-[#2F3136] p-4 space-y-2 hidden sm:flex flex-col text-white h-full flex-shrink-0">
          {subnav}
        </div>
      )}

      {/* Contenido principal */}
                {/* Main layout */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="bg-[#373841] shadow px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#2b2c31]">
                    {header && (
                        <div className="text-base font-semibold text-white">
                            {header}
                        </div>
                    )}
                    <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-4">
                        <Busqueda search={handleSearch} />
                        <button
                            onClick={openCart}
                            className="relative flex items-center justify-center text-black hover:text-black px-3 py-2 rounded bg-[#2A2D2F] hover:bg-[#1F2022]"
                            title={`Carrito (${cantidadLineas} items)`}
                        >
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                className="h-6 w-6 text-white"
                            />
                            {cantidadLineas > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E0B0FE] text-b text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cantidadLineas}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-2 bg-[#373841]">
                    {children}
                </main>
            </div>

      {/* Panel Carrito */}
      {isCartOpen && (
        <div
          ref={cartPanelRef}
          className={`fixed top-0 right-0 w-[450px] h-full bg-[#2F3136] text-white border-l border-[#232428] z-40 transform transition-transform duration-300 ease-in-out ${
            isCartVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <CartPanel lineasCarrito={lineasCarrito} onClose={closeCart} />
        </div>
      )}

      {/* Panel Notificaciones */}
      {isNotifOpen && (
        <div
          ref={notifPanelRef}
          className={`fixed overflow-y-auto top-0 left-20 w-[450px] h-full bg-[#2F3136] text-white border-r border-[#232428] z-40 transform transition-transform duration-300 ease-in-out ${
            isNotifVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <NotificationsPanel
            notifications={notifications}
            onClose={closeNotif}
            openPostModal={openPostModal}
          />
        </div>
      )}

      {/* Modal configuración */}
      {isModalOpen && (
        <Edit
          user={user}
          socials={socials}
          onClose={() => setIsModalOpen(false)}
          mustVerifyEmail={mustVerifyEmail}
          status={status}
        />
      )}

      {/* Modal post full screen */}
      {modalPost && (
        <Show
          post={modalPost}
          onClose={closePostModal}
          canModerate={user.is_admin}
          setIsLiked={() => {}}
          setTotalLikes={() => {}}
          notification={true}
        />
      )}
    </div>
  );
}
