import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getPurchaseWithDetails } from "../api/purchase";

const PurchaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseDetail = async () => {
      try {
        const response = await getPurchaseWithDetails(id);
        setPurchase(response.data.purchase);
      } catch (error) {
        toast.error("Error al cargar el detalle de la compra");
        console.error(error);
        navigate("/purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetail();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Cargando detalle de compra...
          </p>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return null;
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalle de Compra #{purchase.id_compra}
            </h1>
            <p className="text-gray-600 mt-2">
              Información completa de la compra
            </p>
          </div>
          <button
            onClick={() => navigate("/purchases")}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>

        {/* Información General */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Información General
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Número de Compra
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  #{purchase.id_compra}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fecha</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(purchase.fecha)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Proveedor
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.proveedor}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Registrado por
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.usuario}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Comprados */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Productos Comprados
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="py-3.5 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Costo Unitario
                  </th>
                  <th className="py-3.5 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchase.detalles && purchase.detalles.length > 0 ? (
                  purchase.detalles.map((detalle, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        {detalle.producto}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {detalle.descripcion_producto || "—"}
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-gray-900">
                        {detalle.cantidad}
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-gray-900">
                        {formatCurrency(detalle.precio_unitario)}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-semibold text-blue-600">
                        {formatCurrency(detalle.subtotal)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 text-center text-gray-500 text-sm"
                    >
                      No hay detalles disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                Total de la Compra:
              </span>
              <span className="text-4xl font-bold text-blue-600">
                {formatCurrency(purchase.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Nota:</p>
              <p>
                Esta compra actualizó automáticamente el inventario. El stock de
                cada producto se incrementó con las cantidades compradas.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de impresión (opcional) */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Imprimir Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetail;
