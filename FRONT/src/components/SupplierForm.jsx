import { useState, useEffect } from "react";
import { createSupplier, updateSupplier } from "../api/suppliers";
import toast from "react-hot-toast";

const SupplierForm = ({ supplier = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    direction: "",
    active: 1,
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.nombre,
        email: supplier.email,
        telephone: supplier.telefono ?? "",
        direction: supplier.direccion ?? "",
        active: supplier.activo,
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.email) {
        return toast.error("Name and email are required");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        direction: formData.direction,
        active: formData.active,
      };

      if (supplier) {
        await updateSupplier(supplier.id_proveedor, payload);
      } else {
        await createSupplier(payload);
      }

      toast.success("Supplier saved successfully");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving supplier:", err);
      if (err.response) {
        toast.error(err.response.data.message || "Server error");
      } else {
        toast.error("Network or server error");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md z-50"
    >
      <h2 className="text-2xl font-bold mb-4">
        {supplier ? "Edit Supplier" : "New Supplier"}
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
        required
      />

      <input
        name="telephone"
        value={formData.telephone}
        onChange={handleChange}
        placeholder="Telephone"
        className="w-full mb-3 p-2 rounded bg-gray-700 placeholder-gray-300"
      />

      <input
        name="direction"
        value={formData.direction}
        onChange={handleChange}
        placeholder="Direction"
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

export default SupplierForm;
