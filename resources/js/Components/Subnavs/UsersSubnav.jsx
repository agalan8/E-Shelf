import SubNavLink from '@/Components/SubNavLink';
import { RectangleGroupIcon, BookOpenIcon } from '@heroicons/react/24/solid';

export default function PostsSubnav() {
    return (
        <div className="flex flex-col gap-2 text-sm font-medium">
            <SubNavLink
                href={route('mis-posts')}
                active={route().current('mis-posts')}
                className="flex"
            >
                <RectangleGroupIcon className="h-6 w-6" />
                <span>Mis Publicaciones</span>
            </SubNavLink>

            <SubNavLink
                href={route('mis-albums')}
                active={route().current('mis-albums')}
                className="flex"
            >
                <BookOpenIcon className="h-6 w-6" />
                <span>Mis Álbumes</span>
            </SubNavLink>
        </div>
    );
}
