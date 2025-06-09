import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCheck,
    faXmark,
    faUserPlus,
    faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestPageLayout from "@/Layouts/GuestPageLayout";
import Image from "@/Components/Image";
import CommunitySubnav from "@/Components/Subnavs/CommunitySubnav";
import User from "@/Components/Users/User";
import { useToast } from "@/contexts/ToastProvider";

const Members = ({ community, auth, authUserRole }) => {
    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;
    const { showToast } = useToast();

    const isMemberInitial = community.memberships.some(
        (membership) =>
            membership.user_id === auth.user.id &&
            (membership.community_role_id === 3 ||
                membership.community_role_id === 2)
    );

    const [isMember, setIsMember] = useState(isMemberInitial);
    const [loading, setLoading] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [hoveredUserId, setHoveredUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const canEdit =
        auth.user && (auth.user.is_admin || auth.user.id === community.user_id);

    const handleJoinLeave = () => {
        if (!auth.user) return;
        setLoading(true);

        const url = isMember
            ? route("communities.leave", community.id)
            : route("communities.join", community.id);

        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setIsMember(!isMember),
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleToggleAdmin = (userId, currentRoleId) => {
        if (authUserRole !== 1) {
            alert("Solo el dueño puede cambiar roles de administrador.");
            return;
        }
        const routeName =
            currentRoleId === 2
                ? "communities.removeAdmin"
                : "communities.makeAdmin";

        router.post(
            route(routeName, { community_id: community.id, user_id: userId }),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleKickUser = (userId, targetRoleId) => {
        if (authUserRole === 1) {
            if (userId === auth.user.id) {
                showToast("No puedes expulsarte a ti mismo.", "error");
                return;
            }
        } else if (authUserRole === 2) {
            if (targetRoleId <= 2) {
                showToast(
                    "Los administradores solo pueden expulsar a miembros, no a otros admins ni al dueño.",
                    "error"
                );
                return;
            }
        } else {
            showToast("No tienes permisos para expulsar usuarios.", "error");
            return;
        }

        if (!confirm("¿Estás seguro de que quieres expulsar a este usuario?")) {
            return;
        }

        router.post(
            route("communities.kickUser", {
                community_id: community.id,
                user_id: userId,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast("Usuario expulsado correctamente.", "success");
                },
                onError: () => {
                    showToast("Error al expulsar al usuario.", "error");
                },
            }
        );
    };

    const renderJoinButton = () => {
        if (!auth.user || canEdit) return null;

        return (
            <button
                onClick={handleJoinLeave}
                disabled={loading}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={`w-24 flex items-center justify-center space-x-1 px-1 py-1.5 rounded border-2 text-base whitespace-nowrap transition-all duration-200
          ${
              isMember
                  ? "bg-white text-[#9C7FB3] font-extrabold border-[#876aa0] hover:bg-[#FDECEA] hover:text-red-600 hover:border-red-500"
                  : "bg-[#9C7FB3] text-white font-extrabold hover:bg-[#876aa0] border-transparent"
          }
          `}
                title={
                    isMember
                        ? hovering
                            ? "Salir de la comunidad"
                            : "Unido"
                        : "Unirse a la comunidad"
                }
            >
                {loading ? (
                    "..."
                ) : isMember ? (
                    <>
                        <FontAwesomeIcon
                            icon={hovering ? faXmark : faCheck}
                            className="w-4 h-4 transition-all duration-200"
                        />
                        <span>{hovering ? "Salir" : "Unido"}</span>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        <span>Unirse</span>
                    </>
                )}
            </button>
        );
    };

    // Primero filtramos los miembros por rol (excluyendo rol 4),
    // luego filtramos por búsqueda (nombre que incluye el término)
    const filteredMemberships = community.memberships
        .filter((membership) => membership.community_role_id !== 4)
        .filter((membership) =>
            membership.user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <Layout subnav={<CommunitySubnav currentCommunity={community} />}>
            <div className="community-profile">
                {/* Fondo de portada */}
                <div
                    className={`w-full overflow-hidden flex items-center justify-center relative ${
                        community.background_image?.path_original
                            ? "h-[200px] sm:h-[350px]"
                            : "h-[80px] sm:h-[124px]"
                    }`}
                >
                    {community.background_image?.path_original ? (
                        <Image
                            src={`${community.background_image.path_original}?t=${Date.now()}`}
                            alt="Fondo de comunidad"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-600" />
                    )}

                    {/* Franja con efecto blur */}
                    <div
                        className={`absolute bottom-0 left-0 w-full py-3 px-2 sm:px-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6
                ${
                    community.background_image
                        ? "bg-black/50 backdrop-blur-sm"
                        : "bg-[#2d2e38]"
                }`}
                    >
                        {/* Imagen de perfil */}
                        {community.profile_image?.path_small ? (
                            <Image
                                src={`${community.profile_image.path_small}?t=${Date.now()}`}
                                alt={community.nombre}
                                className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-full border-4 border-white object-cover"
                            />
                        ) : (
                            <div
                                className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-full border-4 border-white bg-gray-400 flex items-center justify-center text-white text-2xl sm:text-4xl"
                                title="Sin imagen"
                            >
                                ?
                            </div>
                        )}

                        {/* Contadores */}
                        <div className="flex gap-4 sm:gap-8 mt-2 sm:mt-0">
                            <div className="text-center text-white">
                                <p className="font-semibold">
                                    {community.getTotalMembers}
                                </p>
                                <p className="text-xs sm:text-base">Miembros</p>
                            </div>
                            <div className="text-center text-white">
                                <p className="font-semibold">
                                    {community.getTotalPosts}
                                </p>
                                <p className="text-xs sm:text-base">Publicaciones</p>
                            </div>
                        </div>

                        {/* Botón de unirse/salir */}
                        <div className="mt-2 sm:mt-0">{renderJoinButton()}</div>
                    </div>
                </div>

                {/* Contenedor buscador y lista */}
                <div className="max-full mx-auto px-4 py-8">
                    {/* Buscador arriba a la izquierda */}
                    <div className="mb-4 flex justify-start">
                        <input
                            type="text"
                            placeholder="Buscar por nombre de usuario"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#292B2F] text-white rounded-md px-3 py-2 border border-gray-600 w-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>

                    {filteredMemberships.length === 0 ? (
                        <p className="text-gray-500">
                            No se encontraron miembros con ese nombre.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredMemberships.map((membership) => (
                                <div
                                    key={membership.id}
                                    className="relative rounded-md p-4"
                                    onMouseEnter={() =>
                                        setHoveredUserId(membership.user.id)
                                    }
                                    onMouseLeave={() => setHoveredUserId(null)}
                                >
                                    {/* Badge fundador */}
                                    {membership.user.id === community.user_id && (
                                        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded shadow-md select-none z-20">
                                            Fundador
                                        </div>
                                    )}

                                    {/* Badge admin */}
                                    {membership.community_role_id === 2 && (
                                        <div
                                            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded shadow-md select-none z-20
                                            ${
                                                membership.user.id === community.user_id
                                                    ? "bg-indigo-600 text-white left-[5.5rem]"
                                                    : "bg-indigo-600 text-white"
                                            }`}
                                        >
                                            Admin
                                        </div>
                                    )}

                                    {/* Contenedor botones en esquina superior derecha */}
                                    <div
                                        className="absolute top-2 right-2 flex flex-col items-end space-y-1 z-10"
                                        style={{
                                            opacity:
                                                hoveredUserId === membership.user.id
                                                    ? 1
                                                    : 0,
                                            transform:
                                                hoveredUserId === membership.user.id
                                                    ? "translateY(0)"
                                                    : "translateY(-10px)",
                                            transition:
                                                "opacity 0.3s ease, transform 0.3s ease",
                                        }}
                                    >
                                        {/* Botón hacer/quitar admin */}
                                        {authUserRole === 1 &&
                                            membership.user.id !== auth.user.id && (
                                                <button
                                                    title={
                                                        membership.community_role_id === 2
                                                            ? "Quitar admin"
                                                            : "Hacer admin"
                                                    }
                                                    onClick={() =>
                                                        handleToggleAdmin(
                                                            membership.user.id,
                                                            membership.community_role_id
                                                        )
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-indigo-100 hover:bg-indigo-200 text-xs font-semibold"
                                                >
                                                    <FontAwesomeIcon
                                                        className="w-3 h-3"
                                                        icon={faUserPlus}
                                                    />
                                                    <span>
                                                        {membership.community_role_id === 2
                                                            ? "Quitar admin"
                                                            : "Hacer admin"}
                                                    </span>
                                                </button>
                                            )}

                                        {/* Botón expulsar */}
                                        {((authUserRole === 1 &&
                                            membership.user.id !== auth.user.id) ||
                                            (authUserRole === 2 &&
                                                membership.community_role_id > 2)) && (
                                            <button
                                                title="Expulsar usuario"
                                                onClick={() =>
                                                    handleKickUser(
                                                        membership.user.id,
                                                        membership.community_role_id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-xs font-semibold"
                                            >
                                                <FontAwesomeIcon
                                                    className="w-3 h-3"
                                                    icon={faUserMinus}
                                                />
                                                <span>Expulsar</span>
                                            </button>
                                        )}
                                    </div>

                                    <User user={membership.user} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Members;
