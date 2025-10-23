import { useState } from "react";

const FlexibleSaleCalculator = ({ precioUnitario, onCalculate }) => {
  const [modoVenta, setModoVenta] = useState("cantidad"); // 'cantidad' o 'monto'
  const [cantidad, setCantidad] = useState(1);
  const [montoDeseado, setMontoDeseado] = useState("");

  const calcularPorMonto = () => {
    if (!montoDeseado || !precioUnitario || precioUnitario <= 0) {
      return { cantidad: 0, total: 0 };
    }
    const cantidadCalculada = Number(montoDeseado) / Number(precioUnitario);
    return {
      cantidad: cantidadCalculada.toFixed(2),
      total: Number(montoDeseado),
    };
  };

  const calcularPorCantidad = () => {
    if (!cantidad || !precioUnitario) {
      return { cantidad: 0, total: 0 };
    }
    return {
      cantidad: Number(cantidad),
      total: Number(cantidad) * Number(precioUnitario),
    };
  };

  const handleAplicar = () => {
    const resultado =
      modoVenta === "monto" ? calcularPorMonto() : calcularPorCantidad();
    onCalculate(resultado);
  };

  const resultado =
    modoVenta === "monto" ? calcularPorMonto() : calcularPorCantidad();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-gray-700">
          Modo de venta:
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModoVenta("cantidad")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              modoVenta === "cantidad"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Por Cantidad
          </button>
          <button
            type="button"
            onClick={() => setModoVenta("monto")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              modoVenta === "monto"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Por Monto ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modoVenta === "monto" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto deseado ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={montoDeseado}
              onChange={(e) => setMontoDeseado(e.target.value)}
              placeholder="Ej: 2000"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Resultado:</p>
          <p className="text-lg font-semibold text-gray-900">
            {modoVenta === "monto" ? (
              <>
                {resultado.cantidad} unidades ={" "}
                <span className="text-green-600">
                  ${resultado.total.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                {resultado.cantidad} unidades ={" "}
                <span className="text-green-600">
                  ${resultado.total.toFixed(2)}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAplicar}
        disabled={
          modoVenta === "monto"
            ? !montoDeseado || montoDeseado <= 0
            : !cantidad || cantidad <= 0
        }
        className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Aplicar
      </button>
    </div>
  );
};

export default FlexibleSaleCalculator;
