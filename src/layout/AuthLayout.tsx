import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full bg-white rounded-xl shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
