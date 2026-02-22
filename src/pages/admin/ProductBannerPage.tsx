import { useState } from "react";
import { Search, RotateCcw, Plus, Pencil, ArrowLeft } from "lucide-react";

const allRegions = ["USA", "Canada", "EMEA", "India", "APAC", "Latin America", "China", "Oceania"];

const mockBanners = [
  { id: 1, name: "Summer Sale Banner", linkType: "Product", displayPage: "Home", active: true, rank: 1, startDate: "2026-03-01", endDate: "2026-06-30" },
  { id: 2, name: "New Arrivals", linkType: "Category", displayPage: "Category page", active: true, rank: 2, startDate: "2026-02-01", endDate: "2026-12-31" },
  { id: 3, name: "Holiday Special", linkType: "Product", displayPage: "Home", active: false, rank: 3, startDate: "2026-11-01", endDate: "2026-12-31" },
];

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const ProductBannerPage = () => {
  const [editing, setEditing] = useState<number | null>(null);

  if (editing !== null) {
    const banner = mockBanners.find(b => b.id === editing);
    return <BannerEditForm banner={banner} onBack={() => setEditing(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Product Banner Setup</h1>
          <p className="page-subtitle">Design and manage product page banners</p>
        </div>
        <button onClick={() => setEditing(0)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={16} /> New Banner
        </button>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Banner Name</th><th>Link To</th><th>Display Page</th><th>Active</th><th>Rank</th><th>Action</th></tr></thead>
          <tbody>
            {mockBanners.map(b => (
              <tr key={b.id}>
                <td className="font-medium text-foreground">{b.name}</td>
                <td className="text-muted-foreground">{b.linkType}</td>
                <td className="text-muted-foreground">{b.displayPage}</td>
                <td>
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${b.active ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className="text-xs">{b.active ? "Active" : "Inactive"}</span>
                </td>
                <td className="text-muted-foreground">{b.rank}</td>
                <td>
                  <button onClick={() => setEditing(b.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-primary hover:bg-accent transition-colors">
                    <Pencil size={13} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BannerEditForm = ({ banner, onBack }: { banner?: any; onBack: () => void }) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["USA"]);
  const toggleRegion = (r: string) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"><ArrowLeft size={15} /> Back to Banners</button>
        <h1 className="page-title">{banner ? "Edit Banner" : "New Banner"}</h1>
      </div>

      <div className="admin-card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelCls}>Banner Name</label><input className={inputCls} defaultValue={banner?.name || ""} /></div>
          <div>
            <label className={labelCls}>Background Image</label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">Upload image</div>
          </div>
          <div>
            <label className={labelCls}>Link To</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="link" defaultChecked={banner?.linkType === "Product"} className="accent-primary" /> Product</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="link" defaultChecked={banner?.linkType === "Category"} className="accent-primary" /> Category</label>
            </div>
          </div>
          <div><label className={labelCls}>Display Page</label>
            <select className={inputCls}><option>Home</option><option>Category page</option></select>
          </div>
          <div><label className={labelCls}>Start Date</label><input className={inputCls} type="date" defaultValue={banner?.startDate} /></div>
          <div><label className={labelCls}>End Date</label><input className={inputCls} type="date" defaultValue={banner?.endDate} /></div>
          <div><label className={labelCls}>Rank</label><input className={inputCls} type="number" defaultValue={banner?.rank || 1} min={1} /></div>
          <div className="flex items-center gap-2 pt-6"><input type="checkbox" defaultChecked={banner?.active} className="accent-primary" /><span className="text-sm">Active</span></div>
        </div>
      </div>

      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Region Selection</h3>
        <div className="flex flex-wrap gap-2">
          {allRegions.map(r => (
            <button key={r} onClick={() => toggleRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${selectedRegions.includes(r) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
              {selectedRegions.includes(r) ? "☑" : "☐"} {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button onClick={onBack} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

export default ProductBannerPage;
