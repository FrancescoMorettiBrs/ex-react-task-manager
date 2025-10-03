import { createContext, useContext } from "react";
import useTasks from "../hook/useTasks";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const tasksApi = useTasks();

  return <GlobalContext.Provider value={tasksApi}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal deve essere usato dentro <GlobalProvider>");
  return ctx;
}
