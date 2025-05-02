import SubNavLink from '@/Components/SubNavLink';
import { RectangleGroupIcon, BookOpenIcon } from '@heroicons/react/24/solid';

export default function HomeSubnav() {
    return (
        <div className="flex flex-col gap-2 text-sm font-medium">
            <SubNavLink
                href={route('posts-seguidos')}
                active={route().current('posts-seguidos')}
                className="flex"
            >
                <RectangleGroupIcon className="h-6 w-6" />
                <span>Seguidos</span>
            </SubNavLink>
        </div>
    );
}
