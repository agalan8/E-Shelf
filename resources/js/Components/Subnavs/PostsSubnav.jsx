// resources/js/Components/Subnavs/PostsSubnav.jsx
import { Link } from '@inertiajs/react';

export default function PostsSubnav() {
    return (
        <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
            <Link href="" className="hover:underline">Todas</Link>
            <Link href="" className="hover:underline">Favoritos</Link>
            <Link href="" className="hover:underline">Nuevo</Link>
        </nav>
    );
}
