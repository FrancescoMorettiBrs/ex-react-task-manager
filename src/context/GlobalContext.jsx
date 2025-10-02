import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
      console.warn("VITE_API_URL non definita. Imposta il valore in .env");
      return;
    }

    fetch(`${API_URL}/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error(`GET /tasks failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("[GlobalContext] Tasks ricevuti:", data);
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("[GlobalContext] Errore fetch /tasks:", err);
      });
  }, []);
  const value = { tasks, setTasks };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
  const cxt = useContext(GlobalContext);
  if (!cxt) throw new Error("Errore nel context, CONTROLLARE!");
  return cxt;
}
