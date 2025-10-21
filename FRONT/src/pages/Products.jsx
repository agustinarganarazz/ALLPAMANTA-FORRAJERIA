import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ProductForm from "../components/ProductForm";
import {
  getAllProducts,
  getInactiveProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
} from "../api/products";
import { getAllCategories } from "../api/categories";
// import { getAllSuppliers } from "../api/suppliers"; // asumimos que tenés un service de proveedores

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveProducts()
        : await getAllProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error("Error al cargar productos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesSuppliers = async () => {
    try {
      const resCat = await getAllCategories();
      setCategories(resCat.data.categories || []);
      const resSup = await getAllSuppliers();
      setSuppliers(resSup.data.suppliers || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesSuppliers();
  }, [showInactive]);

  const handleCreate = async (data) => {
    try {
      await createProduct(data);
      toast.success("Producto creado correctamente");
      fetchProducts();
    } catch (error) {
      toast.error("Error al crear producto");
      console.error(error);
    }
  };

  const handleUpdate = async (id, name, price, active) => {
    try {
      await updateProduct(id, { name, price, active });
      toast.success("Producto actualizado correctamente");
      setEditingId(null);
      setEditingName("");
      setEditingPrice(0);
      fetchProducts();
    } catch (error) {
      toast.error("Error al actualizar producto");
      console.error(error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateProduct(id);
      toast.success("Producto activado correctamente");
      setShowInactive(false);
      fetchProducts();
    } catch (error) {
      toast.error("Error al activar producto");
      console.error(error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id);
      toast.success("Producto desactivado correctamente");
      fetchProducts();
    } catch (error) {
      toast.error("Error al desactivar producto");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">Productos</h1>

      <ProductForm
        onSubmit={handleCreate}
        categories={categories}
        suppliers={suppliers}
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowInactive(!showInactive)}
          className="bg-yellow-500 hover:bg-yellow-600 text-brown-900 font-semibold py-2 px-4 rounded-md shadow-sm transition-transform hover:scale-105"
        >
          {showInactive ? "Ver activos" : "Ver inactivos"}
        </button>
      </div>

      <div className="overflow-x-auto p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-md">
        {loading ? (
          <p className="text-brown-900">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-brown-900 py-4">
            No hay productos {showInactive ? "inactivos" : "activos"}.
          </p>
        ) : (
          <table className="min-w-full border border-yellow-400 rounded-lg">
            <thead className="bg-yellow-300 text-brown-900">
              <tr>
                <th className="py-2 px-4 border-b border-yellow-400">ID</th>
                <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                <th className="py-2 px-4 border-b border-yellow-400">Precio</th>
                <th className="py-2 px-4 border-b border-yellow-400">Activo</th>
                <th className="py-2 px-4 border-b border-yellow-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr
                  key={prod.id_producto}
                  className={`${
                    idx % 2 === 0 ? "bg-yellow-100" : "bg-yellow-50"
                  } hover:bg-yellow-200 transition-colors`}
                >
                  <td className="py-2 px-4 border-b border-yellow-400 text-center">
                    {prod.id_producto}
                  </td>
                  <td className="py-2 px-4 border-b border-yellow-400">
                    {editingId === prod.id_producto ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="px-2 py-1 border border-yellow-400 rounded-md w-full"
                      />
                    ) : (
                      prod.nombre
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-yellow-400 text-center">
                    {editingId === prod.id_producto ? (
                      <input
                        type="number"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        step="0.01"
                        className="px-2 py-1 border border-yellow-400 rounded-md w-full"
                      />
                    ) : (
                      prod.precio
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-yellow-400 text-center">
                    {prod.activo ? "Sí" : "No"}
                  </td>
                  <td className="py-2 px-4 border-b border-yellow-400 text-center flex gap-2 justify-center">
                    {editingId === prod.id_producto ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              prod.id_producto,
                              editingName,
                              editingPrice,
                              prod.activo
                            )
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-brown-900 px-4 py-1.5 rounded-lg font-semibold shadow-sm transition-transform hover:scale-105"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                            setEditingPrice(0);
                          }}
                          className="bg-[#5C4033] hover:bg-[#4B3621] text-yellow-50 px-4 py-1.5 rounded-lg font-semibold shadow-sm transition-transform hover:scale-105"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(prod.id_producto);
                            setEditingName(prod.nombre);
                            setEditingPrice(prod.precio);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-brown-900 px-4 py-1.5 rounded-lg font-semibold shadow-sm transition-transform hover:scale-105"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            prod.activo
                              ? handleDeactivate(prod.id_producto)
                              : handleActivate(prod.id_producto)
                          }
                          className={`px-4 py-1.5 rounded-lg font-semibold shadow-sm transition-transform hover:scale-105 ${
                            prod.activo
                              ? "bg-[#5C4033] hover:bg-[#4B3621] text-yellow-50"
                              : "bg-yellow-500 hover:bg-yellow-600 text-brown-900"
                          }`}
                        >
                          {prod.activo ? "Desactivar" : "Activar"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
