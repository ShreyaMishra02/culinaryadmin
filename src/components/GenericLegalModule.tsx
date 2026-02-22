import { useState } from "react";
import { Search, RotateCcw, Plus, Pencil, Trash2, Globe } from "lucide-react";

interface GenericItem {
  id: number;
  title: string;
  active: boolean;
  category?: string;
}

interface GenericModuleProps {
  title: string;
  subtitle: string;
  hasCategory?: boolean;
  items: GenericItem[];
}

const GenericLegalModule = ({ title, subtitle, hasCategory, items: initialItems }: GenericModuleProps) => {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = items.filter((item) =>
    !search || item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (editing !== null) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">{editing === 0 ? "New Entry" : "Edit Entry"}</h1>
        </div>
        <div className="admin-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
            <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          {hasCategory && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>General</option><option>Account</option><option>Billing</option><option>Technical</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Content</label>
            <textarea rows={12} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" placeholder="Enter content here..." />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" /> Active</label>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
            <button onClick={() => setEditing(null)} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Globe size={15} /> Translation</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <button onClick={() => setEditing(0)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={16} /> New
        </button>
      </div>

      <div className="filter-section">
        <div className="flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"><Search size={14} /> Search</button>
          <button onClick={() => setSearch("")} className="flex items-center gap-1.5 px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"><RotateCcw size={14} /></button>
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Title</th>{hasCategory && <th>Category</th>}<th>Active</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="font-medium text-foreground">{item.title}</td>
                {hasCategory && <td className="text-muted-foreground">{item.category}</td>}
                <td>
                  <button
                    onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, active: !i.active } : i))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${item.active ? "bg-success" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${item.active ? "left-5" : "left-0.5"}`} />
                  </button>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground"><Globe size={14} /></button>
                    <button onClick={() => setEditing(item.id)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-accent"><Pencil size={13} /> Edit</button>
                    <button className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericLegalModule;
