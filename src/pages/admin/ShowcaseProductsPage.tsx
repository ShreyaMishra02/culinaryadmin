import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const allProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `PRD-${String(1000 + i).padStart(5, "0")}`,
  name: ["Craft Beer Bundle", "Espresso Gift Set", "Sushi Platter", "Steak Dinner", "Pizza Delivery", "Keto Meal Kit", "Gourmet Popcorn", "Organic Juice Pack", "Smoothie Box", "Trail Mix Gift"][i % 10],
}));

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const ShowcaseProductsPage = () => {
  const [title, setTitle] = useState("Featured Picks");
  const [selectedIds, setSelectedIds] = useState<string[]>(["PRD-01000", "PRD-01002", "PRD-01005"]);

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Showcase Products</h1>
        <p className="page-subtitle">Configure product showcase displays</p>
      </div>

      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Showcase Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Custom Title</label>
            <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Custom Image</label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
              Upload showcase image
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Select Products & Rank Order</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* All Products */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Available Products (click to add)</p>
            <div className="border border-border rounded-lg max-h-[350px] overflow-y-auto">
              {allProducts.filter(p => !selectedIds.includes(p.id)).map(p => (
                <button key={p.id} onClick={() => toggleProduct(p.id)} className="w-full text-left px-4 py-2.5 text-sm border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <span className="font-mono text-xs text-muted-foreground mr-2">{p.id}</span>{p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Selected (Ranked Order)</p>
            <div className="border border-border rounded-lg max-h-[350px] overflow-y-auto">
              {selectedIds.map((id, i) => {
                const p = allProducts.find(x => x.id === id);
                return (
                  <div key={id} className="flex items-center px-4 py-2.5 text-sm border-b border-border/50 hover:bg-muted/50">
                    <GripVertical size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
                    <span className="text-xs font-bold text-primary mr-2">#{i + 1}</span>
                    <span className="font-mono text-xs text-muted-foreground mr-2">{id}</span>
                    <span className="flex-1">{p?.name}</span>
                    <button onClick={() => toggleProduct(id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                  </div>
                );
              })}
              {!selectedIds.length && <p className="p-4 text-sm text-muted-foreground text-center">No products selected</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

export default ShowcaseProductsPage;
