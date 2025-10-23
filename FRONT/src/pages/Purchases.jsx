import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllPurchases } from "../api/purchase";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await getAllPurchases();
      setPurchases(response.data.purchases || []);
    } catch (error) {
      toast.error("Error al cargar compras");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
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
              Gestión de Compras
            </h1>
            <p className="text-gray-600 mt-2">
              Administra y registra las compras a proveedores
            </p>
          </div>
          <button
            onClick={() => navigate("/purchases/new")}
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
            Nueva Compra
          </button>
        </div>

        {/* Tabla de Compras */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Cargando compras...
              </p>
            </div>
          ) : purchases.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="mt-4 text-gray-600 text-lg font-medium">
                No hay compras registradas
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                Comienza registrando tu primera compra
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
                      Proveedor
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
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase.id_compra}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{purchase.id_compra}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(purchase.fecha)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        {purchase.proveedor}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {purchase.usuario}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-semibold text-blue-600">
                        {formatCurrency(purchase.total)}
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/purchases/${purchase.id_compra}`)
                          }
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
        {!loading && purchases.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <div>
              Total de compras:{" "}
              <span className="font-semibold text-gray-900">
                {purchases.length}
              </span>
            </div>
            <div>
              Monto total invertido:{" "}
              <span className="font-semibold text-blue-600">
                {formatCurrency(
                  purchases.reduce(
                    (sum, purchase) => sum + Number(purchase.total),
                    0
                  )
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
