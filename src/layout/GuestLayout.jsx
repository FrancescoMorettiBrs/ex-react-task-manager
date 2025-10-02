import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

export default function GuestLayout() {
  return (
    <>
      <AppHeader />
      <div className="px-3 py-3">
        <Outlet />
      </div>
    </>
  );
}
