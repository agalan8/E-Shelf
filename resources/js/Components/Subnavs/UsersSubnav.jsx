import SubNavLink from '@/Components/SubNavLink';
import { RectangleGroupIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { usePage } from '@inertiajs/react';

export default function UsersSubnav({ currentUser }) {
    const { auth: { user } } = usePage().props;

    console.log(currentUser)

    return (
        <div className="flex flex-col gap-2 text-sm font-medium">
            <SubNavLink
                href={route('users.show', { user: currentUser.id })}
                active={route().current('users.show')}
                className="flex"
            >
                <RectangleGroupIcon className="h-6 w-6" />
                <span>Publicaciones</span>
            </SubNavLink>

            {currentUser.id === user.id && (
                <SubNavLink
                    href={route('mis-albums')}
                    active={route().current('mis-albums')}
                    className="flex"
                >
                    <BookOpenIcon className="h-6 w-6" />
                    <span>Mis Álbumes</span>
                </SubNavLink>
            )}
        </div>
    );
}
