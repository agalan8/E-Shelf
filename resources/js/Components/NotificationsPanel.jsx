import React from "react";

export default function NotificationsPanel({ notifications, onClose }) {
    return (
        <div className="w-[265px] h-full bg-[#2F3136] p-4 space-y-2 flex flex-col text-white border-r border-[#232428]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notificaciones</h2>
                <button onClick={onClose} className="text-lg">
                    ✖
                </button>
            </div>
            {notifications.length === 0 ? (
                <p className="text-gray-400">No tienes nuevas notificaciones.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notif) => (
                        <li
                            key={notif.id}
                            className="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                        >
                            {notif.type === "follow" && (
                                <p>
                                    <strong>{notif.data.follower_name}</strong> empezó a seguirte.
                                </p>
                            )}
                            {notif.type === "like" && (
                                <p>Alguien le dio me gusta a tu publicación.</p>
                            )}
                            {notif.type === "share" && (
                                <p>Alguien compartió una de tus publicaciones.</p>
                            )}
                            <span className="text-xs text-gray-400">{notif.created_at}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
