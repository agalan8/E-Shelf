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
    Cog8ToothIcon
} from '@heroicons/react/24/solid';

export default function AuthenticatedLayout({ header, children, subnav }) {
    const { auth: { user }, mustVerifyEmail, status, socials } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query, filter) => {
        console.log("Buscando:", query, "Filtro:", filter);
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar fijo */}
            <aside className="bg-[#1A1D1F] text-white w-20 h-full border-r border-gray-800 hidden sm:flex flex-col z-50">
                <div className="flex items-center justify-center h-16 border-b border-gray-700 px-4">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex flex-col space-y-3">
                        <NavLink href={route('explorar')} active={route().current('explorar')} className="flex justify-center">
                            <GlobeAsiaAustraliaIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('users.show', { user: user.id })} active={route().current('users.show') || route().current('mis-posts') || route().current('mis-albums')} className="flex justify-center">
                            <UserIcon className="h-9 w-9" />
                        </NavLink>
                        <NavLink href={route('posts.create')} active={route().current('posts.create')} className="flex justify-center">
                            <ArrowUpTrayIcon className="h-9 w-9" />
                        </NavLink>
                    </div>

                    {user.is_admin && (
                        <div className="flex flex-col space-y-3 border-t border-gray-700 pt-3">
                            <NavLink href={route('users.index')} active={route().current('users.index')} className="flex justify-center">
                                <UserGroupIcon className="h-9 w-9" />
                            </NavLink>
                            <NavLink href={route('posts.index')} active={route().current('posts.index')} className="flex justify-center">
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

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex justify-center hover:text-gray-300 text-sm px-2 py-2 rounded hover:bg-[#2A2D2F]"
                    >
                        <Cog8ToothIcon className="h-9 w-9" />
                    </button>

                    <div>
                        <Dropdown align="left" width="100%">
                            <Dropdown.Trigger>
                                <button className="w-full flex items-center justify-between text-sm hover:text-gray-300 px-2 py-2 rounded hover:bg-[#2A2D2F]">
                                    {user.name}
                                    <svg className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </aside>

            {subnav && (
                <div className="w-[265px] bg-[#2F3136] border-r border-gray-300 p-4 space-y-2 hidden sm:flex flex-col text-white h-full">
                    {subnav}
                </div>
            )}

            {/* Contenido principal con scroll solo aquí */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="bg-white shadow px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {header && <div className="text-lg font-semibold">{header}</div>}
                    <div className="w-full sm:w-1/2">
                        <Busqueda search={handleSearch} />
                    </div>
                </div>

                {/* Main con scroll */}
                <main className="flex-1 overflow-y-auto p-4">
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
