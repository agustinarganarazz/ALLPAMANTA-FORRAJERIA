import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SuppliersForm = ({
  onSubmit,
  initialData = {},
  suppliers,
  setSuppliers,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Rellenar el formulario cuando initialData cambie
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Nombre y email son obligatorios");
      return;
    }

    const supplierData = { name, email, phone, address };

    if (initialData.id) {
      // Modo editar: actualizar el supplier en la lista
      const updatedSuppliers = suppliers.map((s) =>
        s.id === initialData.id ? { ...s, ...supplierData } : s
      );
      setSuppliers(updatedSuppliers);
      toast.success("Proveedor actualizado");
    } else {
      // Modo crear: agregar nuevo supplier
      const newSupplier = { id: Date.now(), ...supplierData };
      setSuppliers([...suppliers, newSupplier]);
      toast.success("Proveedor creado");
    }

    // Limpiar formulario
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded shadow-md"
    >
      <h2 className="text-lg font-semibold">
        {initialData.id ? "Editar Proveedor" : "Nuevo Proveedor"}
      </h2>
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Dirección</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {initialData.id ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

export default SuppliersForm;
