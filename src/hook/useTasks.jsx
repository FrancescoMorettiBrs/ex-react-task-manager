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

  
  const addTask = useCallback(async function addTask(/* task */) {}, []);
  const removeTask = useCallback(async function removeTask(/* id */) {}, []);
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
