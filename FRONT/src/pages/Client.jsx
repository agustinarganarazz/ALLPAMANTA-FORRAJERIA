import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ClientForm from "../components/ClientForm";
import ConfirmModal from "../utils/confirmModal";

import {
  getAllClients,
  getInactiveClients,
  createClient,
  updateClient,
  activateClient,
  deactivateClient,
} from "../api/client";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveClients()
        : await getAllClients();
      setClients(response.data.clients || []);
    } catch (err) {
      toast.error("Error al cargar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [showInactive]);

  const handleCreate = async (data) => {
    try {
      await createClient(data);
      toast.success("Cliente creado correctamente");
      fetchClients();
    } catch (err) {
      toast.error("Error al crear cliente");
      console.error(err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateClient(id, data);
      toast.success("Cliente actualizado correctamente");
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      toast.error("Error al actualizar cliente");
      console.error(err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateClient(id);
      toast.success("Cliente activado correctamente");
      fetchClients();
    } catch (err) {
      toast.error("Error al activar cliente");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateClient(id);
      toast.success("Cliente desactivado correctamente");
      fetchClients();
    } catch (err) {
      toast.error("Error al desactivar cliente");
    }
  };

  const openConfirmModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los clientes registrados en el sistema
          </p>
        </div>

        <ClientForm
          onSubmit={(data) =>
            editingClient
              ? handleUpdate(editingClient.id_cliente, data)
              : handleCreate(data)
          }
          initialData={
            editingClient
              ? {
                  name: editingClient.nombre,
                  telephone: editingClient.telefono,
                  email: editingClient.email,
                  direction: editingClient.direccion,
                }
              : {}
          }
        />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {showInactive ? "Clientes Inactivos" : "Clientes Activos"}
          </h2>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {showInactive ? "Ver Activos" : "Ver Inactivos"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Cargando clientes...
              </p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-gray-600 text-lg font-medium">
                No hay clientes {showInactive ? "inactivos" : "activos"}
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
                      Teléfono
                    </th>
                    <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
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
                  {clients.map((client) => (
                    <tr
                      key={client.id_cliente}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{client.id_cliente}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {client.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {client.telefono}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {client.email}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {client.direccion}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${client.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {client.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingClient(client)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (client.activo) {
                              openConfirmModal({
                                title: "Desactivar Cliente",
                                message: `¿Deseas desactivar a "${client.nombre}"?`,
                                type: "danger",
                                onConfirm: () =>
                                  handleDeactivate(client.id_cliente),
                              });
                            } else {
                              handleActivate(client.id_cliente);
                            }
                          }}
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg ${client.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                        >
                          {client.activo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingClient && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <ClientForm
            initialData={{
              name: editingClient.nombre,
              telephone: editingClient.telefono,
              email: editingClient.email,
              direction: editingClient.direccion,
            }}
            onSubmit={(data) => handleUpdate(editingClient.id_cliente, data)}
          />
          <button
            className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
            onClick={() => setEditingClient(null)}
          >
            &times;
          </button>
        </div>
      )}

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

export default Clients;
