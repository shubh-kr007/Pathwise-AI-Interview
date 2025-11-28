import React, { createContext, useContext, useCallback, useState, useEffect } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((msg, opts = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast = { id, msg, type: opts.type || "info", duration: opts.duration ?? 3000 };
    setToasts((t) => [...t, toast]);
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration);
    }
  }, [remove]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 w-[90%] max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const { msg, type } = toast;
  useEffect(() => {
    // no-op; duration handled at push
  }, []);
  const color = type === "success" ? "from-green-600 to-emerald-600" : type === "error" ? "from-red-600 to-rose-600" : "from-blue-600 to-purple-600";
  return (
    <div className={`text-white px-4 py-3 rounded-xl shadow-lg border border-white/10 bg-gradient-to-r ${color} flex items-start justify-between gap-3`}>
      <div className="text-sm leading-snug">{msg}</div>
      <button className="text-white/80 hover:text-white" onClick={onClose}>✕</button>
    </div>
  );
}


