import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import Busqueda from '@/Components/Busqueda';
import Edit from '@/Components/Users/Edit';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    GlobeAsiaAustraliaIcon,
} from '@heroicons/react/24/solid';

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
                        <NavLink href={route('explorar')} active={route().current('explorar')} className="flex justify-center">
                            <GlobeAsiaAustraliaIcon className="h-9 w-9" />
                        </NavLink>
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

                {/* <div className="bg-[#373841] shadow px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#2b2c31]">
                    {header && <div className="text-base font-semibold text-white">{header}</div>}
                    <div className="w-full sm:w-auto sm:ml-auto">
                        <Busqueda search={handleSearch} />
                    </div>
                </div> */}



                <main className="flex-1 overflow-y-auto">
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
