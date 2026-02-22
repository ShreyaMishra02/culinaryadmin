import { Construction } from "lucide-react";

const PlaceholderPage = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
    <div className="admin-card flex flex-col items-center justify-center py-16 text-center">
      <Construction size={48} className="text-muted-foreground/40 mb-4" />
      <h2 className="text-lg font-heading font-semibold text-foreground">Coming Soon</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">This module is under development and will be available in the next release.</p>
    </div>
  </div>
);

export default PlaceholderPage;
