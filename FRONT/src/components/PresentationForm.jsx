import { useState, useEffect } from "react";

const PresentationForm = ({ onSubmit, initialData = {}, products }) => {
  const [form, setForm] = useState({
    id_producto: initialData.id_producto || "",
    nombre_presentacion: initialData.nombre_presentacion || "",
    cantidad: initialData.cantidad || "",
    precio_venta: initialData.precio_venta || "",
    costo: initialData.costo || "",
  });

  useEffect(() => {
    setForm({
      id_producto: initialData.id_producto || "",
      nombre_presentacion: initialData.nombre_presentacion || "",
      cantidad: initialData.cantidad || "",
      precio_venta: initialData.precio_venta || "",
      costo: initialData.costo || "",
    });
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      id_producto: "",
      nombre_presentacion: "",
      cantidad: "",
      precio_venta: "",
      costo: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {initialData.id_presentacion
              ? "Editar Presentación"
              : "Nueva Presentación"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select
            name="id_producto"
            value={form.id_producto}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">Seleccione un producto</option>
            {products.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="nombre_presentacion"
            value={form.nombre_presentacion}
            onChange={handleChange}
            placeholder="Nombre de presentación"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <input
            type="number"
            name="precio_venta"
            value={form.precio_venta}
            onChange={handleChange}
            placeholder="Precio de venta"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <input
            type="number"
            name="costo"
            value={form.costo}
            onChange={handleChange}
            placeholder="Costo"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PresentationForm;
