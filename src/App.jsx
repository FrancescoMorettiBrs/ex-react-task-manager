import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import TaskList from "./pages/tasks/TaskList";
import AddTask from "./pages/tasks/AddTask";
import { GlobalProvider } from "./context/GlobalContext";
import TaskDetail from "./pages/tasks/TaskDetail";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/add" element={<AddTask />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
