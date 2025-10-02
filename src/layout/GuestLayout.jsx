import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

export default function GuestLayout() {
  return (
    <>
      <AppHeader />
      <div className="container py-3">
        <Outlet />
      </div>
    </>
  );
}
