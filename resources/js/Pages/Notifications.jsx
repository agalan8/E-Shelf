import { router } from '@inertiajs/react';

export default function Notifications({ notifications, unreadCount }) {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Notificaciones</h1>
                {unreadCount > 0 && (
                    <button
                        onClick={() => router.post('/notifications/read')}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            <ul>
                {notifications.map((n) => (
                    <li
                        key={n.id}
                        className={`mb-2 p-4 rounded shadow ${n.read_at ? 'bg-gray-100' : 'bg-white'}`}
                    >
                        {n.data.type === 'follow' && (
                            <p><strong>{n.data.follower_name}</strong> empezó a seguirte.</p>
                        )}
                        {n.data.type === 'like' && (
                            <p>Tu publicación recibió un <strong>me gusta</strong>.</p>
                        )}
                        {n.data.type === 'share' && (
                            <p>Tu publicación fue <strong>compartida</strong>.</p>
                        )}
                        <span className="text-xs text-gray-500 block mt-1">
                            {new Date(n.created_at).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
