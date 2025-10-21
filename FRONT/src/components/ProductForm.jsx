import { useState } from "react";
import toast from "react-hot-toast";

const ProductForm = ({ onSubmit, categories = [], suppliers = [] }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [id_categoria, setIdCategoria] = useState("");
  const [id_proveedor, setIdProveedor] = useState("");
  const [base_unit, setBaseUnit] = useState("");
  const [stock_total, setStockTotal] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !id_categoria || !id_proveedor || !base_unit) {
      toast.error(
        "Nombre, categoría, proveedor y unidad base son obligatorios"
      );
      return;
    }

    onSubmit({
      name,
      price: parseFloat(price) || 0,
      id_categoria,
      id_proveedor,
      base_unit,
      stock_total: parseFloat(stock_total) || 0,
      description,
      active: 1,
    });

    // limpiar inputs
    setName("");
    setPrice("");
    setIdCategoria("");
    setIdProveedor("");
    setBaseUnit("");
    setStockTotal(0);
    setDescription("");
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
        Nuevo Producto
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Precio"
          step="0.01"
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
        />
        <select
          value={id_categoria}
          onChange={(e) => setIdCategoria(e.target.value)}
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <select
          value={id_proveedor}
          onChange={(e) => setIdProveedor(e.target.value)}
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
          required
        >
          <option value="">Seleccionar proveedor</option>
          {suppliers.map((sup) => (
            <option key={sup.id_proveedor} value={sup.id_proveedor}>
              {sup.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={base_unit}
          onChange={(e) => setBaseUnit(e.target.value)}
          placeholder="Unidad base"
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
          required
        />
        <input
          type="number"
          value={stock_total}
          onChange={(e) => setStockTotal(e.target.value)}
          placeholder="Stock inicial"
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-brown-900"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-brown-900 font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
