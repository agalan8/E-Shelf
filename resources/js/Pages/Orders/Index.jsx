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
            header={<h2 className="font-semibold text-base text-purple-100 leading-tight">Mis Compras</h2>}
            subnav={<UsersSubnav currentUser={user} />}
        >
            <Head title="Mis Compras" />
            <div className="max-w-5xl mx-auto py-8 px-6">

{/* FILTROS */}
<div className="mb-12 flex flex-wrap gap-4 items-end justify-center sm:flex-row flex-col">
  <div className="w-full sm:w-auto">
    <label className="block text-sm font-medium text-white">Desde</label>
    <input
      type="date"
      value={fromDate}
      onChange={e => setFromDate(e.target.value)}
      className="mt-1 rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full"
    />
  </div>

  <div className="w-full sm:w-auto">
    <label className="block text-sm font-medium text-white">Hasta</label>
    <input
      type="date"
      value={toDate}
      onChange={e => setToDate(e.target.value)}
      className="mt-1 rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full"
    />
  </div>

  <div className="w-full sm:w-auto">
    <select
      value={filterYear}
      onChange={e => setFilterYear(e.target.value)}
      className="mt-1 rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full"
    >
      <option value="">Todos los años</option>
      {years.map(year => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  </div>

  <div className="w-full sm:w-auto">
    <select
      value={filterMonth}
      onChange={e => setFilterMonth(e.target.value)}
      className="mt-1 rounded px-3 py-2 bg-[#292B2F] text-white border border-gray-600 w-full"
    >
      <option value="">Todos los meses</option>
      {months.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
</div>

{/* PEDIDOS */}
{filteredOrders.length === 0 ? (
  <p className="text-white text-center text-lg">
    No se encontraron compras con los filtros aplicados.
  </p>
) : (
  <div className="space-y-6">
    {filteredOrders.map((order) => (
      <div
        key={order.id}
        className="border border-purple-700 rounded-xl shadow-lg shadow-black overflow-hidden transition-all bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"
      >
        <button
          onClick={() => toggleOrder(order.id)}
          className="w-full flex justify-between items-center px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:brightness-125 transition duration-300 rounded-t-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <span className="font-semibold text-base sm:text-lg tracking-wide">
              Pedido: {new Date(order.created_at).toLocaleString()}
            </span>
            <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
              <span className="text-base sm:text-lg font-semibold text-white">
                Total: {parseFloat(order.total).toFixed(2)} €
              </span>
              <span className="text-xl sm:text-2xl select-none">
                {openOrderId === order.id ? "▲" : "▼"}
              </span>
            </div>
          </div>
        </button>

<div
  className={`transition-all duration-500 ease-in-out overflow-hidden rounded-b-xl ${
    openOrderId === order.id
      ? "max-h-[1000px] opacity-100"
      : "max-h-0 opacity-0"
  } bg-gray-900 px-2 sm:px-6`}
>
  <div className="py-6 space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 font-semibold text-white text-xs sm:text-sm pb-2 border-b border-purple-700">
      <div>Imagen</div>
      <div>Título</div>
      <div className="text-right">Precio</div>
      <div className="text-right">Descargar</div>
    </div>

    {order.lines.map((line, idx) => (
      <div
        key={idx}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 items-center py-4 border-b border-purple-700 last:border-b-0"
      >
        <div>
          {line.path_small ? (
            <img
              src={`${line.path_small}?t=${new Date().getTime()}`}
              alt="Producto"
              className="object-cover rounded-xl border border-purple-700 shadow-2xl w-full max-w-[160px] h-auto sm:h-[120px]"
              style={{ maxWidth: "160px", height: "auto" }}
            />
          ) : (
            <div
              className="bg-gray-800 rounded-xl flex items-center justify-center text-purple-300 font-bold text-2xl sm:text-3xl border border-purple-700 shadow-sm w-full max-w-[160px] h-[80px] sm:h-[120px]"
            >
              ?
            </div>
          )}
        </div>
        <div className="text-gray-300 text-base sm:text-lg font-medium break-words">
          {line.titulo ?? "Producto"}
        </div>
        <div className="text-right text-lg sm:text-xl font-bold text-purple-400">
          {line.precio ? `${parseFloat(line.precio).toFixed(2)} €` : "—"}
        </div>
        <div className="text-right">
          {line.path_image ? (
            <a
              href={`/order-lines/${line.id}/download-image`}
              download
              className="inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Descargar
            </a>
          ) : (
            <span className="text-purple-500 text-xs sm:text-sm">No disponible</span>
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
