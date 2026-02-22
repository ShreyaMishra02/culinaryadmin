import { Package, FolderTree, Users, TrendingUp, ShoppingCart, AlertTriangle, BarChart3, Activity } from "lucide-react";

const stats = [
  { label: "Total Products", value: "2,847", change: "+12%", icon: Package, color: "text-primary" },
  { label: "Active Categories", value: "64", change: "+3", icon: FolderTree, color: "text-success" },
  { label: "Active Programs", value: "18", change: "0", icon: Users, color: "text-info" },
  { label: "Orders Today", value: "342", change: "+8%", icon: ShoppingCart, color: "text-warning" },
];

const recentActivity = [
  { action: "Product 'Wireless Mouse X1' updated", user: "admin@ontra.com", time: "5 min ago" },
  { action: "Category 'Electronics' visibility changed", user: "manager@ontra.com", time: "12 min ago" },
  { action: "New banner uploaded for Q1 campaign", user: "marketing@ontra.com", time: "1 hr ago" },
  { action: "Bulk upload completed (156 products)", user: "admin@ontra.com", time: "2 hr ago" },
  { action: "Help Center FAQ updated", user: "support@ontra.com", time: "3 hr ago" },
];

const DashboardPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your marketplace administration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={22} className={s.color} />
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary" /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" /> System Health
          </h2>
          <div className="space-y-4">
            {[
              { label: "Product Data Sync", value: 98, color: "bg-success" },
              { label: "Email Delivery Rate", value: 95, color: "bg-primary" },
              { label: "Storage Usage", value: 42, color: "bg-info" },
              { label: "API Response Time", value: 87, color: "bg-warning" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{m.label}</span>
                  <span className="text-muted-foreground font-medium">{m.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
