import SubNavLink from "@/Components/SubNavLink";
import { RectangleGroupIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStore, faReceipt } from '@fortawesome/free-solid-svg-icons';

export default function UsersSubnav({ currentUser }) {
    const {
        auth: { user },
    } = usePage().props;

    console.log(currentUser);

    return (
        <div className="flex flex-col gap-2 text-sm font-medium text-white">
            <SubNavLink
                href={route("users.show", { user: currentUser.id })}
                active={route().current("users.show")}
                className="flex items-center text-white"
            >
                <RectangleGroupIcon className="h-6 w-6 text-white" />
                <span className="ml-2 text-white">Publicaciones</span>
            </SubNavLink>

            {currentUser.id === user.id && (
                <>
                    <SubNavLink
                        href={route("mis-albums")}
                        active={route().current("mis-albums")}
                        className="flex items-center text-white"
                    >
                        <BookOpenIcon className="h-6 w-6 text-white" />
                        <span className="ml-2 text-white">Mis Álbumes</span>
                    </SubNavLink>
                    <SubNavLink
                        href={route("mis-comunidades")}
                        active={route().current("mis-comunidades")}
                        className="flex items-center text-white"
                    >
                        <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-white" />
                        <span className="ml-2 text-white">Mis Comunidades</span>
                    </SubNavLink>
                    <SubNavLink
                        href={route("orders.index")}
                        active={route().current("orders.index")}
                        className="flex items-center text-white"
                    >
                        <FontAwesomeIcon icon={faReceipt} className="h-6 w-6 text-white" />
                        <span className="ml-2 text-white">Mis Compras</span>
                    </SubNavLink>
                </>
            )}

            {currentUser.id !== user.id && (
                <SubNavLink
                    href={route("shops.show", { shop: currentUser.shop.id })}
                    active={route().current("shops.show", { shop: currentUser.shop.id })}
                    className="flex items-center text-white"
                >
                    <FontAwesomeIcon icon={faStore} className="h-6 w-6 text-white" />
                    <span className="ml-2 text-white">Tienda</span>
                </SubNavLink>
            )}
        </div>
    );
}
