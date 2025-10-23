import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllSales } from "../api/sales";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getAllSales();
      setSales(response.data.sales || []);
    } catch (error) {
      toast.error("Error al cargar ventas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Ventas
            </h1>
            <p className="text-gray-600 mt-2">
              Administra y registra las ventas del sistema
            </p>
          </div>
          <button
            onClick={() => navigate("/sales/new")}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Venta
          </button>
        </div>

        {/* Tabla de Ventas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Cargando ventas...
              </p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-16 px-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="mt-4 text-gray-600 text-lg font-medium">
                No hay ventas registradas
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                Comienza registrando tu primera venta
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="py-3.5 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr
                      key={sale.id_venta}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{sale.id_venta}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(sale.fecha)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        {sale.cliente}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {sale.usuario}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-semibold text-green-600">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/sales/${sale.id_venta}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        {!loading && sales.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <div>
              Total de ventas:{" "}
              <span className="font-semibold text-gray-900">
                {sales.length}
              </span>
            </div>
            <div>
              Monto total:{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(
                  sales.reduce((sum, sale) => sum + Number(sale.total), 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
