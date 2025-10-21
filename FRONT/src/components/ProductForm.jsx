import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../api/products";
import { getAllCategories } from "../api/categories";
import { getAllSuppliers } from "../api/suppliers";
import toast from "react-hot-toast";

const ProductForm = ({ product = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    supplierId: "",
    baseUnit: "u",
    stockTotal: 0,
    description: "",
    active: 1,
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Cargar categorías y proveedores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await getAllCategories();
        setCategories(categoriesRes.data.categories || []);
        const suppliersRes = await getAllSuppliers();
        setSuppliers(suppliersRes.data.suppliers || []);
      } catch (err) {
        console.error(err);
        toast.error("Error loading categories or suppliers");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.nombre,
        categoryId: product.id_categoria,
        supplierId: product.id_proveedor,
        baseUnit: product.unidad_base,
        stockTotal: product.stock_total,
        description: product.descripcion,
        active: product.activo,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.categoryId ||
      !formData.supplierId ||
      !formData.baseUnit
    ) {
      return toast.error("Name, category, supplier and base unit are required");
    }

    const payload = {
      name: formData.name,
      id_categoria: formData.categoryId,
      id_proveedor: formData.supplierId,
      base_unit: formData.baseUnit,
      stock_total: formData.stockTotal ?? 0,
      description: formData.description,
      active: formData.active ?? 1,
    };

    try {
      if (product) {
        await updateProduct(product.id_producto, payload);
      } else {
        await createProduct(payload);
      }

      toast.success("Product saved successfully");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(err.response?.data?.message || "Network or server error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md z-50"
    >
      <h2 className="text-2xl font-bold mb-4">
        {product ? "Edit Product" : "New Product"}
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      />

      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        className="w-full mb-3 p-2 rounded bg-gray-700"
        required
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id_categoria} value={cat.id_categoria}>
            {cat.nombre}
          </option>
        ))}
      </select>

      <select
        name="supplierId"
        value={formData.supplierId}
        onChange={handleChange}
        className="w-full mb-3 p-2 rounded bg-gray-700"
        required
      >
        <option value="">Select supplier</option>
        {suppliers.map((sup) => (
          <option key={sup.id_proveedor} value={sup.id_proveedor}>
            {sup.nombre}
          </option>
        ))}
      </select>

      <select
        name="baseUnit"
        value={formData.baseUnit}
        onChange={handleChange}
        className="w-full mb-3 p-2 rounded bg-gray-700"
        required
      >
        <option value="u">Unit</option>
        <option value="g">Gram</option>
      </select>

      <input
        type="number"
        name="stockTotal"
        value={formData.stockTotal}
        onChange={handleChange}
        placeholder="Stock total"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
