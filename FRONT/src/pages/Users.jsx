import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UserForm from "../components/userForm.jsx";
import ConfirmModal from "../utils/confirmModal";

import {
  getAllUsers,
  getInactiveUsers,
  activateUser,
  deactivateUser,
} from "../api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [creatingUser, setCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = showInactive
        ? await getInactiveUsers()
        : await getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [showInactive]);

  const handleActivate = async (id) => {
    try {
      await activateUser(id);
      toast.success("Usuario activado correctamente");
      setShowInactive(false);
      fetchUsers();
    } catch (error) {
      toast.error("Error al activar usuario");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateUser(id);
      toast.success("Usuario desactivado correctamente");
      fetchUsers();
    } catch (error) {
      toast.error("Error al desactivar usuario");
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
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-2">
              Administra los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => setCreatingUser(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Nuevo Usuario
          </button>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center mb-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-1 bg-slate-700 rounded"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {showInactive ? "Usuarios Inactivos" : "Usuarios Activos"}
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
                Cargando usuarios...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-gray-600 text-lg font-medium">
                No hay usuarios {showInactive ? "inactivos" : "activos"}
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
                      Rol
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
                  {users.map((user) => (
                    <tr
                      key={user.id_usuario}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        #{user.id_usuario}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {user.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-900">{user.email}</td>
                      <td className="py-4 px-6 text-gray-900">{user.rol}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirmModal({
                              title: user.activo
                                ? "Desactivar Usuario"
                                : "Activar Usuario",
                              message: `¿Estás seguro de que deseas ${user.activo ? "desactivar" : "activar"} "${user.nombre}"?`,
                              type: user.activo ? "danger" : "success",
                              onConfirm: () =>
                                user.activo
                                  ? handleDeactivate(user.id_usuario)
                                  : handleActivate(user.id_usuario),
                            })
                          }
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                            user.activo
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {user.activo ? "Desactivar" : "Activar"}
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
          Total de usuarios:{" "}
          <span className="font-semibold text-gray-900">{users.length}</span>
        </div>
      </div>

      {/* Modal creación */}
      {creatingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setCreatingUser(false)}
          ></div>
          <UserForm
            onClose={() => setCreatingUser(false)}
            onSave={() => {
              fetchUsers();
              setCreatingUser(false);
            }}
          />
        </div>
      )}

      {/* Modal edición */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          ></div>
          <UserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={fetchUsers}
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

export default Users;
