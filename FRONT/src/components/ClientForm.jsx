import { useState } from "react";

const ClientForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");
  const [telephone, setTelephone] = useState(initialData.telephone || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [direction, setDirection] = useState(initialData.direction || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, telephone, email, direction, active: 1 });
    setName("");
    setTelephone("");
    setEmail("");
    setDirection("");
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {initialData.name ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Ej: 1122334455"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="Calle, número, ciudad"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Guardar Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
