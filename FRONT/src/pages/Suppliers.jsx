import { useState } from "react";
import SuppliersForm from "../components/SuppliersForm";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  return (
    <div className="p-6">
      <SuppliersForm
        initialData={editingSupplier}
        suppliers={suppliers}
        setSuppliers={setSuppliers}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Lista de Proveedores</h2>
        <ul>
          {suppliers.map((s) => (
            <li key={s.id} className="border p-2 mb-2 flex justify-between">
              <div>
                {s.name} - {s.email}
              </div>
              <button
                onClick={() => setEditingSupplier(s)}
                className="bg-blue-600 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuppliersPage;
