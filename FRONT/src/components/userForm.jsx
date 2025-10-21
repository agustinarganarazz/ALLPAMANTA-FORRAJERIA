import { useState, useEffect } from "react";
import { createUser, updateUser } from "../api/users";

const UserForm = ({ user = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rol: "vendedor",
    active: 1,
  });

  const roles = ["admin", "vendedor", "cliente"];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.nombre,
        email: user.email,
        password: "",
        rol: user.rol,
        active: user.activo,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUser(user.id_usuario, formData);
      } else {
        await createUser(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md z-50"
    >
      <h2 className="text-2xl font-bold mb-4">
        {user ? "Editar Usuario" : "Nuevo Usuario"}
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Correo electrónico"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder={user ? "Dejar vacío para no cambiar" : "Contraseña"}
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        {...(!user && { required: true })}
      />

      <select
        name="rol"
        value={formData.rol}
        onChange={handleChange}
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default UserForm;
