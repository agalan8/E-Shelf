import GuestPageLayout from '@/Layouts/GuestPageLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Explorar({ auth }) {
    // Condición para verificar si el usuario está autenticado
    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Explorar
                </h2>
            }
        >
            <Head title="Explorar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {auth.user ? 'You\'re logged in!' : 'Please log in to explore.'}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
