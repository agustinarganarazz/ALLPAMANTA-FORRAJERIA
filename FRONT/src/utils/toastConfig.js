export const toastConfig = {
  position: "top-right",
  toastOptions: {
    duration: 3000,
    style: {
      background: "#1e293b", // slate-800
      color: "#fff",
      padding: "16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    success: {
      duration: 3000,
      style: {
        background: "#22c55e", // green-500
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#22c55e",
      },
    },
    error: {
      duration: 4000,
      style: {
        background: "#ef4444", // red-500
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    },
    loading: {
      style: {
        background: "#3b82f6", // blue-500
      },
    },
  },
};

// Funciones helper para toasts personalizados
export const showSuccessToast = (message) => {
  return toast.success(message);
};

export const showErrorToast = (message) => {
  return toast.error(message);
};

export const showLoadingToast = (message) => {
  return toast.loading(message);
};

export const showPromiseToast = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || "Cargando...",
    success: messages.success || "¡Éxito!",
    error: messages.error || "Error",
  });
};
