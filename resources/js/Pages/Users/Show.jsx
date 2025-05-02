import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestPageLayout from '@/Layouts/GuestPageLayout';
import UsersSubnav from '@/Components/Subnavs/UsersSubnav';

const Show = ({ user, auth }) => {
    const Layout = auth.user ? AuthenticatedLayout : GuestPageLayout;

    const isFollowingInitial = auth.user?.following?.some(f => f.id === user.id);
    const [following, setFollowing] = useState(isFollowingInitial);
    const [hovering, setHovering] = useState(false);

    const handleFollowToggle = () => {
        if (!auth.user) return;

        if (following) {
            router.delete(`/unfollow/${user.id}`, {
                onSuccess: () => setFollowing(false),
                preserveScroll: true
            });
        } else {
            router.post('/follow', { followed_user_id: user.id }, {
                onSuccess: () => setFollowing(true),
                preserveScroll: true
            });
        }
    };

    const renderIcon = () => {
        if (!auth.user || auth.user.id === user.id) return null;

        let icon = faUserPlus;
        let color = 'text-blue-500';
        let title = 'Seguir';

        if (following) {
            icon = hovering ? faUserMinus : faUserCheck;
            color = hovering ? 'text-red-500' : 'text-green-500';
            title = hovering ? 'Dejar de seguir' : 'Siguiendo';
        }

        return (
            <FontAwesomeIcon
                icon={icon}
                onClick={handleFollowToggle}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={`text-4xl cursor-pointer transition-colors duration-200 ${color}`}
                title={title}
            />
        );
    };

    return (
        <Layout subnav={<UsersSubnav />}>
            <div className="user-profile">
                {/* Fondo de portada */}
                <div
                    className="background-image"
                    style={{
                        backgroundImage: `url(/storage/${user.background_image}?t=${new Date().getTime()})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '300px',
                        width: '100%',
                    }}
                ></div>

                {/* Detalles del perfil */}
                <div className="profile-details" style={{ padding: '20px' }}>
                    <div className="profile-header" style={{ position: 'relative', marginTop: '-75px' }}>
                        <div className="flex items-center gap-6">
                            <img
                                src={`/storage/${user.profile_image}?t=${new Date().getTime()}`}
                                alt={user.name}
                                className="profile-image"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    border: '4px solid white',
                                    objectFit: 'cover',
                                }}
                            />
                            {/* Icono a la derecha de la imagen */}
                            <div className="flex items-center ml-8">
                                {renderIcon()}
                            </div>
                        </div>
                    </div>

                    <div className="profile-info text-center mt-4">
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-gray-600 mt-2">
                            {user.biografia || 'No hay biografía disponible.'}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show;
