import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';
import User from '@/Components/Users/User';
const Show = ({ user, auth }) => {

    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;
    return (
        <Layout
            subnav={<UsersSubnav />}>
            <div className="user-profile">
                {/* Fondo de la imagen */}
                <div
                    className="background-image"
                    style={{
                        backgroundImage: `url(/storage/${user.background_image}?t=${new Date().getTime()})`, // Usar backgroundImage en lugar de src
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '300px',
                        width: '100%', // Asegurarse de que ocupe todo el ancho disponible
                    }}
                ></div>

                <div className="profile-details" style={{ padding: '20px' }}>
                    {/* Imagen de perfil */}
                    <div className="profile-header" style={{ position: 'relative', marginTop: '-75px' }}>
                        <img
                            src={`/storage/${user.profile_image}?t=${new Date().getTime()}`}
                            alt={user.name}
                            className="profile-image"
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                border: '4px solid white',
                                objectFit: 'cover', // Asegura que la imagen se recorte correctamente
                                marginTop: '-75px',
                                zIndex: 1,
                            }}
                        />
                    </div>

                    <div className="profile-info" style={{ textAlign: 'center', marginTop: '30px' }}>
                        {/* Nombre del usuario */}
                        <h1 className="user-name" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
                            {user.name}
                        </h1>
                        {/* Biografía del usuario */}
                        <p className="user-bio" style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5' }}>
                            {user.biografia || 'No hay biografía disponible.'} {/* Añadido un fallback */}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show;
