import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <AdminSidebar />
      <main className="pt-14 pl-[260px] transition-all duration-250 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
