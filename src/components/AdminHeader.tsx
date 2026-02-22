import { useAuth } from "@/contexts/AuthContext";
import ontraLogo from "@/assets/ontra-logo.png";
import { Home, Printer, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 justify-between fixed top-0 left-0 right-0 z-50" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-center gap-3">
        <img src={ontraLogo} alt="Ontra" className="h-7" />
      </div>
      <span className="text-sm text-muted-foreground hidden sm:block">
        Welcome, <span className="font-semibold text-foreground">{username}</span>
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Home size={15} /> <span className="hidden sm:inline">Home</span>
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Printer size={15} /> <span className="hidden sm:inline">Print</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut size={15} /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
