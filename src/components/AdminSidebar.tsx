import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderTree, Package, Scale, Bell, Settings2,
  Upload, Star, Eye, Image, Megaphone, ImageIcon, Mail,
  HelpCircle, FileText, Shield, Cookie, ChevronLeft, ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Category Management", icon: FolderTree, path: "/admin/categories" },
  { label: "Product Management", icon: Package, path: "/admin/products" },
  { label: "Product Rules", icon: Scale, path: "/admin/product-rules" },
  { label: "Product Alerts", icon: Bell, path: "/admin/product-alerts" },
  { label: "Program Configuration", icon: Settings2, path: "/admin/programs" },
  { label: "Bulk Upload", icon: Upload, path: "/admin/bulk-upload" },
  { label: "Popular Products", icon: Star, path: "/admin/popular-products" },
  { label: "Showcase Products", icon: Eye, path: "/admin/showcase-products" },
  { label: "Product Banner Setup", icon: Image, path: "/admin/product-banners" },
  { label: "Promotional Banner Setup", icon: Megaphone, path: "/admin/promo-banners" },
  { label: "Background Images", icon: ImageIcon, path: "/admin/background-images" },
  { label: "Email Configuration", icon: Mail, path: "/admin/email-config" },
  { label: "Help Center", icon: HelpCircle, path: "/admin/help-center" },
  { label: "Terms & Conditions", icon: FileText, path: "/admin/terms" },
  { label: "Privacy Policy", icon: Shield, path: "/admin/privacy-policy" },
  { label: "Cookie Policy", icon: Cookie, path: "/admin/cookie-policy" },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed top-14 left-0 bottom-0 z-40 bg-sidebar-bg border-r border-sidebar-border flex flex-col overflow-hidden"
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 mx-2 mt-2 mb-1 rounded-md text-sidebar-fg hover:bg-sidebar-hover transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1 px-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 group ${
                active
                  ? "bg-sidebar-active text-sidebar-active-fg"
                  : "text-sidebar-fg hover:bg-sidebar-hover"
              }`}
            >
              <item.icon size={18} className={`flex-shrink-0 ${active ? "text-sidebar-active-fg" : "text-sidebar-icon group-hover:text-sidebar-fg"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default AdminSidebar;
