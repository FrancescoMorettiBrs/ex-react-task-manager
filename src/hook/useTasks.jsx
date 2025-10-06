import { useCallback, useEffect, useState } from "react";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const loadTasks = useCallback(async () => {
    if (!API_URL) {
      const msg = "VITE_API_URL non definita. Imposta il valore in .env";
      console.warn(msg);
      setError(msg);
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error(`GET /tasks failed: ${res.status}`);
      const data = await res.json();
      console.log("[useTasks] Tasks ricevuti:", data);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[useTasks] Errore fetch /tasks:", err);
      setError(err.message || "Errore imprevisto");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(
    async function addTask(newTask) {
      if (!API_URL) {
        throw new Error("VITE_API_URL non definita. Imposta il valore in .env");
      }

      const body = {
        title: String(newTask?.title ?? "").trim(),
        description: String(newTask?.description ?? ""),
        status: newTask?.status ?? "To do",
      };

      let payload;
      try {
        const res = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = payload?.message || `POST /tasks failed: ${res.status}`;
          throw new Error(msg);
        }
      } catch (err) {
        throw new Error(err.message || "Impossibile creare il task");
      }

      if (!payload?.success) {
        throw new Error(payload?.message || "Creazione task fallita");
      }

      const created = payload.task;
      if (!created || typeof created !== "object") {
        throw new Error("Risposta API priva di 'task'");
      }
      setTasks((prev) => [...prev, created]);

      return created;
    },
    [API_URL]
  );

  const removeTask = useCallback(
    async function removeTask(taskId) {
      if (!API_URL) {
        throw new Error("VITE_API_URL non definita. Imposta il valore in .env");
      }
      if (taskId == null) {
        throw new Error("ID del task mancante.");
      }

      let payload;
      try {
        const res = await fetch(`${API_URL}/tasks/${encodeURIComponent(taskId)}`, {
          method: "DELETE",
        });

        payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = payload?.message || `DELETE /tasks/${taskId} failed: ${res.status}`;
          throw new Error(msg);
        }
      } catch (err) {
        throw new Error(err.message || "Impossibile eliminare il task");
      }

      if (!payload?.success) {
        throw new Error(payload?.message || "Eliminazione task fallita");
      }

      setTasks((prev) => prev.filter((t) => String(t?.id ?? t?._id) !== String(taskId)));

      return true;
    },
    [API_URL]
  );

  const updateTask = useCallback(async function updateTask(/* id, patch */) {}, []);

  return {
    tasks,
    setTasks,
    loading,
    error,
    addTask,
    removeTask,
    updateTask,
    reload: loadTasks,
  };
}
