import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../utils/confirmModal";
import PresentationForm from "../components/PresentationForm";

import {
  getAllPresentations,
  createPresentation,
  updatePresentation,
  deletePresentation,
} from "../api/presentation";
import { getAllProducts } from "../api/products";

const Presentations = () => {
  const [presentations, setPresentations] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // Confirm modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchData = async () => {
    try {
      const pres = await getAllPresentations();
      setPresentations(pres.data.presentations || []);
      const prods = await getAllProducts();
      setProducts(prods.data.products || []);
    } catch (err) {
      toast.error("Error al cargar presentaciones");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing) {
        await updatePresentation(editing.id_presentacion, data);
        toast.success("Presentación actualizada");
      } else {
        await createPresentation(data);
        toast.success("Presentación creada");
      }
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error("Error al guardar presentación");
      console.error(err);
    }
  };

  const handleDelete = (presentation) => {
    setModalConfig({
      title: "Eliminar Presentación",
      message: `¿Desea eliminar la presentación "${presentation.nombre_presentacion}"?`,
      type: "danger",
      onConfirm: async () => {
        await deletePresentation(presentation.id_presentacion);
        toast.success("Presentación eliminada");
        setModalOpen(false);
        fetchData();
      },
    });
    setModalOpen(true);
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gestión de Presentaciones</h1>

      {/* Formulario Crear / Editar */}
      <PresentationForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || {}}
        products={products}
      />

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Producto</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Cantidad</th>
              <th className="py-3 px-6 text-left">Precio Venta</th>
              <th className="py-3 px-6 text-left">Costo</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {presentations.map((p) => (
              <tr key={p.id_presentacion}>
                <td className="py-4 px-6">{p.id_presentacion}</td>
                <td className="py-4 px-6">
                  {products.find((pr) => pr.id_producto === p.id_producto)
                    ?.nombre || "—"}
                </td>
                <td className="py-4 px-6">{p.nombre_presentacion}</td>
                <td className="py-4 px-6">{p.cantidad}</td>
                <td className="py-4 px-6">{p.precio_venta}</td>
                <td className="py-4 px-6">{p.costo}</td>
                <td className="py-4 px-6 flex justify-center gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                    onClick={() => setEditing(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                    onClick={() => handleDelete(p)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal edición difuminado */}
      {editing && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <PresentationForm
            initialData={editing}
            onSubmit={handleCreateOrUpdate}
            products={products}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setEditing(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
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

export default Presentations;
