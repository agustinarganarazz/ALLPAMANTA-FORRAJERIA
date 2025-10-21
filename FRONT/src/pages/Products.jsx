import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ProductForm from "../components/ProductForm";
import ConfirmModal from "../utils/confirmModal";

import {
  getAllProducts,
  getInactiveProducts,
  activateProduct,
  deactivateProduct,
} from "../api/products";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [creatingProduct, setCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveProducts()
        : await getAllProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error("Error loading products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showInactive]);

  const handleActivate = async (id) => {
    try {
      await activateProduct(id);
      toast.success("Product activated successfully");
      setShowInactive(false);
      fetchProducts();
    } catch (error) {
      toast.error("Error activating product");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id);
      toast.success("Product deactivated successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deactivating product");
    }
  };

  const openConfirmModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage system products</p>
          </div>
          <button
            onClick={() => setCreatingProduct(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            New Product
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-1 bg-slate-700 rounded"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {showInactive ? "Inactive Products" : "Active Products"}
            </h2>
          </div>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {showInactive ? "View Active" : "View Inactive"}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-gray-600 text-lg font-medium">
                No products {showInactive ? "inactive" : "active"}
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
                      Name
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id_producto}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{product.id_producto}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {product.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.categoryName || product.id_categoria}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.supplierName || product.id_proveedor}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.stock_total}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.unidad_base}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            product.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.activo ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirmModal({
                              title: product.activo
                                ? "Deactivate Product"
                                : "Activate Product",
                              message: `Are you sure you want to ${product.activo ? "deactivate" : "activate"} "${product.nombre}"?`,
                              type: product.activo ? "danger" : "success",
                              onConfirm: () =>
                                product.activo
                                  ? handleDeactivate(product.id_producto)
                                  : handleActivate(product.id_producto),
                            })
                          }
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                            product.activo
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {product.activo ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Total products:{" "}
          <span className="font-semibold text-gray-900">{products.length}</span>
        </div>
      </div>

      {/* Modal creación */}
      {creatingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setCreatingProduct(false)}
          ></div>
          <ProductForm
            onClose={() => setCreatingProduct(false)}
            onSave={() => {
              fetchProducts();
              setCreatingProduct(false);
            }}
          />
        </div>
      )}

      {/* Modal edición */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setEditingProduct(null)}
          ></div>
          <ProductForm
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={fetchProducts}
          />
        </div>
      )}

      {/* Modal confirmación */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
};

export default Products;
