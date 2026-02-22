import { useState } from "react";
import { Mail } from "lucide-react";

const templates = [
  { id: 1, type: "Order Confirmation", subject: "Your Order Has Been Confirmed", active: true },
  { id: 2, type: "Gift Code Email", subject: "You've Received a Gift!", active: true },
];

const EmailConfigPage = () => {
  const [editing, setEditing] = useState<number | null>(null);
  const [items, setItems] = useState(templates);

  if (editing !== null) {
    const tpl = items.find(t => t.id === editing);
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Edit Email Template</h1>
          <p className="page-subtitle">{tpl?.type}</p>
        </div>
        <div className="admin-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Subject</label>
            <input defaultValue={tpl?.subject} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Header Banner Image</label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center text-muted-foreground text-sm">
              Upload banner image
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Footer Text</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Banner Placement</label>
            <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
              <option>Top</option><option>Bottom</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="accent-primary" /> Active</label>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
            <button onClick={() => setEditing(null)} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Email Configuration</h1>
        <p className="page-subtitle">Configure system-generated email templates</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((tpl) => (
          <div key={tpl.id} className="admin-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{tpl.type}</p>
                <p className="text-xs text-muted-foreground">{tpl.subject}</p>
              </div>
            </div>
            <button onClick={() => setEditing(tpl.id)} className="px-3 py-1.5 rounded-md text-xs text-primary hover:bg-accent transition-colors">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailConfigPage;
