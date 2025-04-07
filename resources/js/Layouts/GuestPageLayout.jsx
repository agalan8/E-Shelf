import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import Busqueda from '@/Components/Busqueda';

export default function GuestLayout({ children, header }) {
    const handleSearch = (query, filter) => {
        console.log("Buscando:", query, "Filtro:", filter);
        // Aquí puedes manejar la búsqueda como una petición a tu backend
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>


                            <NavLink
                                href={route('explorar')}
                                active={route().current('explorar')}
                            >
                                Explorar
                            </NavLink>

                            <Busqueda search={handleSearch} />
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
