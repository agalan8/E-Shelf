import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import Busqueda from "@/Components/Busqueda";
import Edit from "@/Components/Users/Edit";
import CartPanel from "@/Components/CartPanel";
import NotificationsPanel from "@/Components/Notifications/NotificationsPanel";
import Show from "@/Components/Posts/Show";
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
import UsersSubnav from "@/Components/Subnavs/UsersSubnav";

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
  const [modalPost, setModalPost] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserSubnavOpen, setIsUserSubnavOpen] = useState(false);

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
  };

  const openPostModal = (post) => setModalPost(post);
  const closePostModal = () => setModalPost(null);

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
      if (modalPost) return;

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
  }, [isNotifVisible, modalPost]);

  const handleSearch = (query, filter) => {
    console.log("Buscando:", query, "Filtro:", filter);
  };

  const lineasCarrito = user?.lineas_carrito || [];
  const cantidadLineas = lineasCarrito.length;

  return (
    <div className="h-screen flex bg-[#373841] relative overflow-x-hidden min-w-0">
      <aside className="bg-[#1A1D1F] text-white w-20 flex-shrink-0 h-full border-r border-purple-950 hidden sm:flex flex-col z-50">
        <div className="flex items-center justify-center h-16 border-b border-purple-950 px-4">
          <Link href="/">
            <ApplicationLogo className="block h-10 w-auto fill-current text-white" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-1 space-y-2 flex flex-col items-center">
          <NavLink title="Home" href={route("posts-seguidos")} active={!isNotifOpen && route().current("posts-seguidos")} className="flex justify-center">
            <HomeIcon className="h-9 w-9" />
          </NavLink>
          <NavLink title="Explorar" href={route("explorar")} active={!isNotifOpen && route().current("explorar") || !isNotifOpen && route().current("home")} className="flex justify-center">
            <GlobeAsiaAustraliaIcon className="h-9 w-9" />
          </NavLink>
          <NavLink title="Mi Perfil" href={route("users.show", { user: user.id })} active={!isNotifOpen && route().current("users.show") || !isNotifOpen && route().current("mis-albums") || !isNotifOpen && route().current("mis-comunidades") || !isNotifOpen && route().current("orders.index")} className="flex justify-center">
            <UserIcon className="h-9 w-9" />
          </NavLink>

          {/* NOTIFICACIONES */}
          <button
            onClick={() => (isNotifOpen ? closeNotif() : openNotif())}
            className={`mt-2 flex items-center justify-center px-2 py-2 rounded-xl relative transition-colors duration-200 ${
              isNotifOpen ? "bg-[#7A27BC]" : "hover:bg-[#2A2D2F]"
            }`}
            title="Notificaciones"
          >
            <FontAwesomeIcon icon={faBell} className="h-9 w-9 text-white" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E0B0FE] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <NavLink title="Subir Publicación" href={route("regular-posts.create")} active={!isNotifOpen && route().current("regular-posts.create")} className="flex justify-center mt-4">
            <ArrowUpTrayIcon className="h-9 w-9" />
          </NavLink>
          <NavLink title="Mi Tienda" href={route("shops.show", { shop: user.shop.id })} active={!isNotifOpen && route().current("shops.show")} className="flex justify-center">
            <FontAwesomeIcon icon={faStore} className="h-9 w-9" />
          </NavLink>
          <NavLink title="Comunidades" href={route("communities.index")} active={!isNotifOpen && route().current("communities.index")} className="flex justify-center">
            <FontAwesomeIcon icon={faUsers} className="h-9 w-9" />
          </NavLink>

          {user.is_admin && (
            <div className="flex flex-col space-y-3 border-t border-purple-950 pt-3">
              <NavLink title="Gestión de Usuarios" href={route("users.index")} active={!isNotifOpen && route().current("users.index")} className="flex justify-center">
                <FontAwesomeIcon icon={faUsersGear} className="h-9 w-9" />
              </NavLink>
              <NavLink title="Gestión de Publicaciones" href={route("regular-posts.index")} active={!isNotifOpen && route().current("regular-posts.index")} className="flex justify-center">
                <RectangleStackIcon className="h-9 w-9" />
              </NavLink>
              <NavLink title="Gestión de Etiquetas" href={route("tags.index")} active={!isNotifOpen && route().current("tags.index")} className="flex justify-center">
                <SwatchIcon className="h-9 w-9" />
              </NavLink>
              <NavLink title="Gestión de Redes Sociales" href={route("socials.index")} active={!isNotifOpen && route().current("socials.index")} className="flex justify-center">
                <AtSymbolIcon className="h-9 w-9" />
              </NavLink>
            </div>
          )}

          <div className="flex justify-center">
            <button onClick={() => setIsModalOpen(true)} className="flex justify-center hover:text-gray-300 text-sm px-2 py-2 rounded hover:bg-[#2A2D2F]">
              <Cog8ToothIcon title="Editar Perfil" className="h-9 w-9" />
            </button>
          </div>
          <div className="flex justify-center">
            <NavLink title="Cerrar Sesión" href={route("logout")} method="post" className="flex justify-center">
              <ArrowLeftStartOnRectangleIcon className="h-9 w-9" />
            </NavLink>
          </div>
        </div>
      </aside>

      {subnav && (
        <div className="w-[265px] bg-[#2F3136] p-4 space-y-2 hidden sm:flex flex-col text-white h-full flex-shrink-0">
          {subnav}
        </div>
      )}

      <div className="flex-1 flex flex-col h-full">
        <div className="bg-[#373841] shadow px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#2b2c31]">
            {/* Botón menú móvil */}
  <button
    className="sm:hidden text-white"
    onClick={() => setIsMobileMenuOpen(true)}
  >
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
          {header && (

            <div className="text-base font-semibold text-white">{header}</div>
          )}
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-4">
            <Busqueda search={handleSearch} />
            <button
              onClick={openCart}
              className="relative flex items-center justify-center text-black hover:text-black px-3 py-2 rounded bg-[#2A2D2F] hover:bg-[#1F2022]"
              title={`Carrito (${cantidadLineas} items)`}
            >
              <FontAwesomeIcon icon={faCartShopping} className="h-6 w-6 text-white" />
              {cantidadLineas > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E0B0FE] text-b text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cantidadLineas}
                </span>
              )}
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-2 bg-[#373841]">
          {children}
        </main>
      </div>

      {isCartOpen && (
        <div
          ref={cartPanelRef}
          className={`fixed top-0 right-0 w-[400px] h-full bg-[#18191C] text-white border-l border-[#232428] z-40 transform transition-transform duration-300 ease-in-out ${
            isCartVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <CartPanel lineasCarrito={lineasCarrito} onClose={closeCart} />
        </div>
      )}

      {isNotifOpen && (
        <div
          ref={notifPanelRef}
          className={`fixed overflow-y-auto top-0 left-20 w-[450px] h-full text-white border-r border-[#232428] z-40 transform transition-transform duration-300 ease-in-out ${
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

      {isModalOpen && (
  <Edit
    isOpen={isModalOpen}
    user={user}
    socials={socials}
    onClose={() => setIsModalOpen(false)}
    mustVerifyEmail={mustVerifyEmail}
    status={status}
  />
)}


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

{isMobileMenuOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 sm:hidden flex">
    {/* Panel lateral */}
    <div className="relative w-72 max-w-full bg-[#1A1D1F] h-full flex flex-col p-0">
      {/* Botón cerrar */}
      <button
        className="absolute top-4 right-4 text-white z-10"
        onClick={() => setIsMobileMenuOpen(false)}
        aria-label="Cerrar menú"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Menú de enlaces solo iconos */}
      <div className="mt-4 flex-1 flex flex-col space-y-2 px-4 pb-8 overflow-y-auto">
        <NavLink
          href={route("posts-seguidos")}
          active={route().current("posts-seguidos")}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <HomeIcon className="w-7 h-7 text-white" />
        </NavLink>
        <NavLink
          href={route("explorar")}
          active={route().current("explorar") || route().current("home")}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <GlobeAsiaAustraliaIcon className="w-7 h-7 text-white" />
        </NavLink>
        {/* Icono usuario con botón para desplegar subnav */}
        <div>
          <button
            className="flex items-center justify-center w-full py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
            onClick={() => setIsUserSubnavOpen((prev) => !prev)}
            aria-label="Abrir menú de usuario"
            type="button"
          >
            <UserIcon className="w-7 h-7 text-white" />
          </button>
          {/* Desplegable UsersSubnav solo si está abierto */}
          {isUserSubnavOpen && (
            <div className="block sm:hidden mt-2">
              <UsersSubnav currentUser={user} />
            </div>
          )}
        </div>
                  <button
            onClick={() => {
              if (isNotifOpen) {
                closeNotif();
              } else {
                openNotif();
              }
              setIsMobileMenuOpen(false);
            }}
            className={`mt-2 flex items-center justify-center px-2 py-2 rounded-xl relative transition-colors duration-200 ${
              isNotifOpen ? "bg-[#7A27BC]" : "hover:bg-[#2A2D2F]"
            }`}
            title="Notificaciones"
          >
            <FontAwesomeIcon icon={faBell} className="h-7 w-7 text-white" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E0B0FE] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        <NavLink
          href={route("regular-posts.create")}
          active={route().current("regular-posts.create")}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <ArrowUpTrayIcon className="w-7 h-7 text-white" />
        </NavLink>
        <NavLink
          href={route("shops.show", { shop: user.shop.id })}
          active={route().current("shops.show")}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <FontAwesomeIcon icon={faStore} className="w-6 h-6 text-white" />
        </NavLink>
        <NavLink
          href={route("communities.index")}
          active={route().current("communities.index")}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
        </NavLink>
        {user.is_admin && (
          <>
            <NavLink
              href={route("users.index")}
              active={route().current("users.index")}
              className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
            >
              <FontAwesomeIcon icon={faUsersGear} className="w-6 h-6 text-white" />
            </NavLink>
            <NavLink
              href={route("regular-posts.index")}
              active={route().current("regular-posts.index")}
              className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
            >
              <RectangleStackIcon className="w-7 h-7 text-white" />
            </NavLink>
            <NavLink
              href={route("tags.index")}
              active={route().current("tags.index")}
              className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
            >
              <SwatchIcon className="w-7 h-7 text-white" />
            </NavLink>
            <NavLink
              href={route("socials.index")}
              active={route().current("socials.index")}
              className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
            >
              <AtSymbolIcon className="w-7 h-7 text-white" />
            </NavLink>
          </>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition text-left w-full"
        >
          <Cog8ToothIcon className="w-7 h-7 text-white" />
        </button>
        <NavLink
          href={route("logout")}
          method="post"
          className="flex items-center justify-center py-3 px-2 rounded-lg text-white hover:bg-[#232428] transition"
        >
          <ArrowLeftStartOnRectangleIcon className="w-7 h-7 text-white" />
        </NavLink>
      </div>
    </div>
    {/* Clic fuera cierra menú */}
    <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
  </div>
)}



    </div>
  );
}
