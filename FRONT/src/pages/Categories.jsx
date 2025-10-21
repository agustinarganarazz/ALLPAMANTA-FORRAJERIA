import { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import ConfirmModal from "../utils/confirmModal";
import toast from "react-hot-toast";

import {
  getAllCategories,
  getInactiveCategories,
  updateCategory,
  createCategory,
  activateCategory,
  deactivateCategory,
} from "../api/categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveCategories()
        : await getAllCategories();

      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error("Error al cargar categorías");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [showInactive]);

  const handleCreate = async ({ name }) => {
    try {
      await createCategory({ name });
      toast.success("Categoría creada correctamente");
      fetchCategories();
    } catch (error) {
      toast.error("Error al crear categoría");
      console.error(error);
    }
  };

  const handleUpdate = async (id, name, active) => {
    try {
      await updateCategory(id, { name, active });
      toast.success("Categoría actualizada correctamente");
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      toast.error("Error al actualizar categoría");
      console.error(error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateCategory(id);
      toast.success("Categoría activada correctamente");
      setShowInactive(false);
      fetchCategories();
    } catch (error) {
      toast.error("Error al activar categoría");
      console.error(error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateCategory(id);
      toast.success("Categoría desactivada correctamente");
      fetchCategories();
    } catch (error) {
      toast.error("Error al desactivar categoría");
      console.error(error);
    }
  };

  // Función para abrir modal de confirmación
  const openConfirmModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Categorías
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las categorías de productos del sistema
          </p>
        </div>

        {/* Formulario */}
        <CategoryForm onSubmit={handleCreate} />

        {/* Controles */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-1 bg-slate-700 rounded"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {showInactive ? "Categorías Inactivas" : "Categorías Activas"}
            </h2>
          </div>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {showInactive ? "Ver Activas" : "Ver Inactivas"}
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Cargando categorías...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 px-6">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 text-lg font-medium">
                No hay categorías {showInactive ? "inactivas" : "activas"}
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
                      Nombre
                    </th>
                    <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr
                      key={cat.id_categoria}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{cat.id_categoria}
                      </td>

                      <td className="py-4 px-6">
                        {editingId === cat.id_categoria ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {cat.nombre}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            cat.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cat.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-center">
                          {editingId === cat.id_categoria ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdate(
                                    cat.id_categoria,
                                    editingName,
                                    cat.activo
                                  )
                                }
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingName("");
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(cat.id_categoria);
                                  setEditingName(cat.nombre);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (cat.activo) {
                                    openConfirmModal({
                                      title: "Desactivar Categoría",
                                      message: `¿Estás seguro de que deseas desactivar la categoría "${cat.nombre}"?`,
                                      type: "danger",
                                      onConfirm: () =>
                                        handleDeactivate(cat.id_categoria),
                                    });
                                  } else {
                                    handleActivate(cat.id_categoria);
                                  }
                                }}
                                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                                  cat.activo
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                              >
                                {cat.activo ? "Desactivar" : "Activar"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Total de categorías:{" "}
          <span className="font-semibold text-gray-900">
            {categories.length}
          </span>
        </div>
      </div>

      {/* Modal de Confirmación */}
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

export default Categories;
