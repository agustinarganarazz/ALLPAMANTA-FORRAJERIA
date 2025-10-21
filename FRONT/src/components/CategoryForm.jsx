import { useState } from "react";

const CategoryForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
    setName("");
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Nueva Categoría</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la categoría
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Electrónica, Alimentos, etc."
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Guardar Categoría
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
