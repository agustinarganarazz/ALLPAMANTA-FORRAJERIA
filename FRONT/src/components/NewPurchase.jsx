import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  registerPurchase,
  getAllProducts,
  getAllSuppliers,
} from "../api/purchase";

const NewPurchase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  // Buscador de productos
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          getAllSuppliers(),
          getAllProducts(),
        ]);
        setSuppliers(suppliersRes.data.suppliers || []);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        toast.error("Error al cargar datos");
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.nombre);
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedProduct(null);
    setCantidad(1);
    setPrecioUnitario(0);
  };

  const handleAddItem = () => {
    if (!selectedProduct || cantidad <= 0 || precioUnitario <= 0) {
      toast.error("Complete todos los campos del producto");
      return;
    }

    const newItem = {
      id_producto: selectedProduct.id_producto,
      producto_nombre: selectedProduct.nombre,
      cantidad: Number(cantidad),
      precio_unitario: Number(precioUnitario),
      subtotal: Number(cantidad) * Number(precioUnitario),
    };

    setDetalles([...detalles, newItem]);
    handleClearSearch();
    toast.success("Producto agregado");
  };

  const handleRemoveItem = (index) => {
    const newDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(newDetalles);
    toast.success("Producto eliminado");
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplier) {
      toast.error("Seleccione un proveedor");
      return;
    }

    if (detalles.length === 0) {
      toast.error("Agregue al menos un producto");
      return;
    }

    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const id_usuario = userData.id_usuario || 1;

      const purchaseData = {
        id_proveedor: Number(selectedSupplier),
        id_usuario,
        fecha,
        detalles: detalles.map((d) => ({
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      };

      const response = await registerPurchase(purchaseData);
      toast.success(response.data.message || "Compra registrada correctamente");
      navigate("/purchases");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error al registrar compra";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Compra</h1>
            <p className="text-gray-600 mt-2">
              Registra una nueva compra a proveedor
            </p>
          </div>
          <button
            onClick={() => navigate("/purchases")}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Información General
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.id_proveedor}
                      value={supplier.id_proveedor}
                    >
                      {supplier.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Agregar Productos
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                {/* Buscador de productos */}
                <div className="lg:col-span-6 relative" ref={searchRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar Producto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Escribe para buscar..."
                      className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {showDropdown && filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id_producto}
                          type="button"
                          onClick={() => handleSelectProduct(product)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {product.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            Stock actual: {product.stock_total || 0}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showDropdown &&
                    searchTerm &&
                    filteredProducts.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                        No se encontraron productos
                      </div>
                    )}
                </div>

                {/* Cantidad */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                {/* Precio Unitario (Costo) */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Unitario
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                {/* Botón Agregar */}
                <div className="lg:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                    title="Agregar producto"
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
                  </button>
                </div>
              </div>

              {/* Lista de productos agregados */}
              {detalles.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-slate-700 rounded"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Productos en la compra ({detalles.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">
                            Producto
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase">
                            Cantidad
                          </th>
                          <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase">
                            Costo Unitario
                          </th>
                          <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase">
                            Subtotal
                          </th>
                          <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {detalles.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                              {item.producto_nombre}
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-gray-900">
                              {item.cantidad}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-gray-900">
                              {formatCurrency(item.precio_unitario)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-semibold text-blue-600">
                              {formatCurrency(item.subtotal)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-800 font-medium transition-colors"
                              >
                                <svg
                                  className="w-5 h-5 inline"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay productos */}
              {detalles.length === 0 && (
                <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
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
                  <p className="mt-2 text-gray-600 font-medium">
                    No hay productos agregados
                  </p>
                  <p className="text-sm text-gray-500">
                    Busca y agrega productos para continuar
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total y Acciones */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-2xl font-bold text-gray-900">
                  Total de la Compra:
                </span>
                <span className="text-3xl font-bold text-blue-600">
                  {formatCurrency(calcularTotal())}
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/purchases")}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || detalles.length === 0}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Registrar Compra
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPurchase;
