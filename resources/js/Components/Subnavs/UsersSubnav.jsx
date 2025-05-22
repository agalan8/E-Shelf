import SubNavLink from "@/Components/SubNavLink";
import { RectangleGroupIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStore } from '@fortawesome/free-solid-svg-icons';

export default function UsersSubnav({ currentUser }) {
    const {
        auth: { user },
    } = usePage().props;

    console.log(currentUser);

    return (
        <div className="flex flex-col gap-2 text-sm font-medium">
            <SubNavLink
                href={route("users.show", { user: currentUser.id })}
                active={route().current("users.show")}
                className="flex"
            >
                <RectangleGroupIcon className="h-6 w-6" />
                <span>Publicaciones</span>
            </SubNavLink>

            {currentUser.id === user.id && (
                <>
                    <SubNavLink
                        href={route("mis-albums")}
                        active={route().current("mis-albums")}
                        className="flex"
                    >
                        <BookOpenIcon className="h-6 w-6" />
                        <span>Mis Álbumes</span>
                    </SubNavLink>
                    <SubNavLink
                        href={route("mis-comunidades")}
                        active={route().current("mis-comunidades")}
                        className="flex"
                    >
                        <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />
                        <span>Mis Comunidades</span>
                    </SubNavLink>
                </>
            )}

            {currentUser.id !== user.id && (
                <>
                    <SubNavLink
                        href={route("shops.show", { shop: currentUser.shop.id })}
                        active={route().current("shops.show", { shop: currentUser.shop.id })}
                        className="flex"
                    >
                        <FontAwesomeIcon icon={faStore} className="h-6 w-6" />
                        <span>Tienda</span>
                    </SubNavLink>
                </>
            )}
        </div>
    );
}
