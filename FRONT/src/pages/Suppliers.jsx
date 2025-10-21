import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SupplierForm from "../components/SupplierForm";
import ConfirmModal from "../utils/confirmModal";

import {
  getAllSuppliers,
  getInactiveSuppliers,
  activateSupplier,
  deactivateSupplier,
} from "../api/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [creatingSupplier, setCreatingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveSuppliers()
        : await getAllSuppliers();
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      toast.error("Error al cargar proveedores");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [showInactive]);

  const handleActivate = async (id) => {
    try {
      await activateSupplier(id);
      toast.success("Proveedor activado correctamente");
      setShowInactive(false);
      fetchSuppliers();
    } catch (error) {
      toast.error("Error al activar proveedor");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateSupplier(id);
      toast.success("Proveedor desactivado correctamente");
      fetchSuppliers();
    } catch (error) {
      toast.error("Error al desactivar proveedor");
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
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
            <p className="text-gray-600 mt-2">
              Administra los proveedores del sistema
            </p>
          </div>
          <button
            onClick={() => setCreatingSupplier(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Nuevo Proveedor
          </button>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center mb-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-1 bg-slate-700 rounded"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {showInactive ? "Proveedores Inactivos" : "Proveedores Activos"}
            </h2>
          </div>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {showInactive ? "Ver Activos" : "Ver Inactivos"}
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Cargando proveedores...
              </p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-gray-600 text-lg font-medium">
                No hay proveedores {showInactive ? "inactivos" : "activos"}
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
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Dirección
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
                  {suppliers.map((supplier) => (
                    <tr
                      key={supplier.id_proveedor}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{supplier.id_proveedor}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {supplier.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {supplier.email}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {supplier.telefono}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {supplier.direccion}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            supplier.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {supplier.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSupplier(supplier)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirmModal({
                              title: supplier.activo
                                ? "Desactivar Proveedor"
                                : "Activar Proveedor",
                              message: `¿Estás seguro de que deseas ${supplier.activo ? "desactivar" : "activar"} "${supplier.nombre}"?`,
                              type: supplier.activo ? "danger" : "success",
                              onConfirm: () =>
                                supplier.activo
                                  ? handleDeactivate(supplier.id_proveedor)
                                  : handleActivate(supplier.id_proveedor),
                            })
                          }
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                            supplier.activo
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {supplier.activo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Total de proveedores:{" "}
          <span className="font-semibold text-gray-900">
            {suppliers.length}
          </span>
        </div>
      </div>

      {/* Modal creación */}
      {creatingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setCreatingSupplier(false)}
          ></div>
          <SupplierForm
            onClose={() => setCreatingSupplier(false)}
            onSave={() => {
              fetchSuppliers();
              setCreatingSupplier(false);
            }}
          />
        </div>
      )}

      {/* Modal edición */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setEditingSupplier(null)}
          ></div>
          <SupplierForm
            supplier={editingSupplier}
            onClose={() => setEditingSupplier(null)}
            onSave={fetchSuppliers}
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

export default Suppliers;
