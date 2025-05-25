import { usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UsersSubnav from "@/Components/Subnavs/UsersSubnav";

export default function OrderIndex() {
    const { orders, user } = usePage().props;
    const [openOrderId, setOpenOrderId] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");

    const toggleOrder = (id) => {
        setOpenOrderId(openOrderId === id ? null : id);
    };

    const years = Array.from(
        new Set(orders.map(order => new Date(order.created_at).getFullYear()))
    ).sort((a, b) => b - a);

    const months = [
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" },
    ];

    const filteredOrders = orders.filter(order => {
        const created = new Date(order.created_at);
        if (fromDate && created < new Date(fromDate)) return false;
        if (toDate && created > new Date(toDate + "T23:59:59")) return false;
        if (filterYear && created.getFullYear().toString() !== filterYear) return false;
        if (filterMonth) {
            const monthStr = (created.getMonth() + 1).toString().padStart(2, "0");
            if (monthStr !== filterMonth) return false;
        }
        return true;
    });

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-2xl text-purple-100 leading-tight">Mis Compras</h2>}
            subnav={<UsersSubnav currentUser={user} />}
        >
            <Head title="Mis Compras" />
            <div className="max-w-5xl mx-auto py-8 px-6">

                {/* FILTROS */}
                <div className="mb-12 flex flex-wrap gap-4 items-end justify-center">
                    <div>
                        <label className="block text-sm font-medium text-white">Desde</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                            className="mt-1 border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Hasta</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            className="mt-1 border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Año</label>
                        <select
                            value={filterYear}
                            onChange={e => setFilterYear(e.target.value)}
                            className="mt-1 border border-gray-300 rounded-md p-2 bg-white"
                        >
                            <option value="">Todos</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Mes</label>
                        <select
                            value={filterMonth}
                            onChange={e => setFilterMonth(e.target.value)}
                            className="mt-1 border border-gray-300 rounded-md p-2 bg-white"
                        >
                            <option value="">Todos</option>
                            {months.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* PEDIDOS */}
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">
                        No se encontraron compras con los filtros aplicados.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-purple-200 rounded-xl shadow-sm overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => toggleOrder(order.id)}
                                    className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                        <span className="font-medium text-lg">
                                            Pedido: {new Date(order.created_at).toLocaleString()}
                                        </span>
                                        <div className="flex items-center gap-6 mt-2 sm:mt-0">
                                            <span className="text-lg font-semibold text-white">
                                                Total: {parseFloat(order.total).toFixed(2)} €
                                            </span>
                                            <span className="text-xl">
                                                {openOrderId === order.id ? "▲" : "▼"}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openOrderId === order.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} bg-white px-6`}>
                                    <div className="py-6 space-y-4">
                                        <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 text-sm pb-2 border-b">
                                            <div>Imagen</div>
                                            <div>Título</div>
                                            <div className="text-right">Precio</div>
                                            <div className="text-right">Descargar</div>
                                        </div>

                                        {order.lines.map((line, idx) => (
                                            <div key={idx} className="grid grid-cols-4 gap-4 items-center py-4 border-b last:border-b-0">
                                                <div>
                                                    {line.path_small ? (
                                                        <img
                                                            src={`${line.path_small}?t=${new Date().getTime()}`}
                                                            alt="Producto"
                                                            className="object-cover rounded-xl border border-gray-200 shadow-sm"
                                                            style={{ width: "160px", height: "120px" }}
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-200 rounded-xl flex items-center justify-center text-white font-bold text-3xl border border-gray-200 shadow-sm"
                                                             style={{ width: "160px", height: "120px" }}>
                                                            ?
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-gray-800 text-lg font-medium">
                                                    {line.titulo ?? "Producto"}
                                                </div>
                                                <div className="text-right text-xl font-bold text-purple-600">
                                                    {line.precio ? `${parseFloat(line.precio).toFixed(2)} €` : "—"}
                                                </div>
                                                <div className="text-right">
                                                    {line.path_image ? (
                                                        <a
                                                            href={`/order-lines/${line.id}/download-image`}
                                                            download
                                                            className="inline-block px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                                                        >
                                                            Descargar
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            No disponible
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
