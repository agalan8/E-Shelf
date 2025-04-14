import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import Busqueda from '@/Components/Busqueda';
import Edit from '@/Components/Users/Edit'; // Asegúrate de que la ruta sea correcta
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const mustVerifyEmail = usePage().props.mustVerifyEmail;
    const status = usePage().props.status;
    const socials = usePage().props.socials;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query, filter) => {
        console.log("Buscando:", query, "Filtro:", filter);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>

                            <div className="hidden sm:ms-10 sm:flex space-x-8">
                                <NavLink href={route('explorar')} active={route().current('explorar')}>
                                    Explorar
                                </NavLink>
                                <NavLink href={route('mis-posts')} active={route().current('mis-posts')}>
                                    Mis publicaciones
                                </NavLink>
                                <NavLink href={route('mis-albums')} active={route().current('mis-albums')}>
                                    Mis álbumes
                                </NavLink>
                                <NavLink href={route('posts.create')} active={route().current('posts.create')}>
                                    Crear Publicación
                                </NavLink>
                                {user.is_admin && (
                                    <>
                                        <NavLink href={route('users.index')} active={route().current('users.index')}>
                                            Gestión de Usuarios
                                        </NavLink>
                                        <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                            Gestión de Publicaciones
                                        </NavLink>
                                        <NavLink href={route('tags.index')} active={route().current('tags.index')}>
                                            Gestión de Categorías
                                        </NavLink>
                                        <NavLink href={route('socials.index')} active={route().current('socials.index')}>
                                            Gestión de Redes Sociales
                                        </NavLink>
                                    </>
                                )}
                                <Busqueda search={handleSearch} />
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-gray-600 hover:text-gray-800 text-xl"
                                title="Editar perfil"
                            >
                                ⚙️
                            </button>

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Modal */}
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
