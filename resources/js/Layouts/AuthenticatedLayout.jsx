import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import Busqueda from '@/Components/Busqueda';
import Edit from '@/Components/Users/Edit';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    GlobeAsiaAustraliaIcon,
    ArrowUpTrayIcon,
    UserIcon,
    UserGroupIcon,
    RectangleStackIcon,
    SwatchIcon,
    AtSymbolIcon,
    Cog8ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    HomeIcon
} from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersGear, faUsers } from '@fortawesome/free-solid-svg-icons';



export default function AuthenticatedLayout({ header, children, subnav }) {
    const { auth: { user }, mustVerifyEmail, status, socials } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query, filter) => {
        console.log("Buscando:", query, "Filtro:", filter);
    };

    return (
        <div className="h-screen flex bg-[#373841]">
            {/* Sidebar fijo */}
            <aside className="bg-[#1A1D1F] text-white w-20 h-full border-r border-gray-800 hidden sm:flex flex-col z-50">
                <div className="flex items-center justify-center h-16 border-b border-gray-700 px-4">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex flex-col space-y-3">
                        <NavLink title="Home" href={route('posts-seguidos')} active={route().current('posts-seguidos')} className="flex justify-center">
                            <HomeIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('explorar')} active={route().current('explorar')} className="flex justify-center">
                            <GlobeAsiaAustraliaIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('users.show', { user: user.id })} active={route().current('users.show') || route().current('mis-posts') || route().current('mis-albums') || route().current('mis-comunidades')} className="flex justify-center">
                            <UserIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('regular-posts.create')} active={route().current('regular-posts.create')} className="flex justify-center">
                            <ArrowUpTrayIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('communities.index')} active={route().current('communities.index')} className="flex justify-center">
                            <FontAwesomeIcon icon={faUsers} className="h-9 w-9" />
                        </NavLink>
                    </div>

                    {user.is_admin && (
                        <div className="flex flex-col space-y-3 border-t border-gray-700 pt-3">
                            <NavLink href={route('users.index')} active={route().current('users.index')} className="flex justify-center">
                                <FontAwesomeIcon icon={faUsersGear} className="h-9 w-9" />
                            </NavLink>
                            <NavLink href={route('regular-posts.index')} active={route().current('regular-posts.index')} className="flex justify-center">
                                <RectangleStackIcon className="h-9 w-9" />
                            </NavLink>
                            <NavLink href={route('tags.index')} active={route().current('tags.index')} className="flex justify-center">
                                <SwatchIcon className="h-9 w-9" />
                            </NavLink>
                            <NavLink href={route('socials.index')} active={route().current('socials.index')} className="flex justify-center">
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
                        <NavLink href={route('logout')} method="post" className="flex justify-center">
                                <ArrowLeftStartOnRectangleIcon className="h-9 w-9" />
                        </NavLink>
                    </div>
                </div>
            </aside>

            {subnav && (
                <div className="w-[265px] bg-[#2F3136] p-4 space-y-2 hidden sm:flex flex-col text-white h-full">
                    {subnav}
                </div>
            )}

            {/* Contenido principal con scroll solo aquí */}
            <div className="flex-1 flex flex-col h-full">
  {/* Header */}
  <div className="bg-[#373841] shadow px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#2b2c31]">
    {header && <div className="text-base font-semibold text-white">{header}</div>}
    <div className="w-full sm:w-auto sm:ml-auto">
      <Busqueda search={handleSearch} />
    </div>
  </div>





                {/* Main con scroll */}
                <main className="flex-1 overflow-y-auto p-2 bg-[#373841]">
                    {children}
                </main>
            </div>

            <Edit
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mustVerifyEmail={mustVerifyEmail}
                status={status}
                user={user}
                socials={socials}
            />
        </div>
    );
}
