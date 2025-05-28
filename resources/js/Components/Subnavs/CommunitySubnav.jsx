import SubNavLink from '@/Components/SubNavLink';
import { RectangleGroupIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";


export default function CommunitySubnav({ currentCommunity }) {
    return (
        <div className="flex flex-col gap-2 text-sm font-medium">
            <SubNavLink
                href={route('communities.show', currentCommunity.id)}
                active={route().current('communities.show')}
                className="flex"
            >
                <RectangleGroupIcon className="h-6 w-6" />
                <span>Publicaciones</span>
            </SubNavLink>
            <SubNavLink
                href={route('communities.members', currentCommunity.id)}
                active={route().current('communities.members')}
                className="flex"
            >
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />
                <span>Miembros</span>
            </SubNavLink>
        </div>
    );
}
