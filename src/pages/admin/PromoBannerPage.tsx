import { useState } from "react";
import { Plus, Pencil, ArrowLeft } from "lucide-react";

const allRegions = ["USA", "Canada", "EMEA", "India", "APAC", "Latin America", "China", "Oceania"];
const displayPages = ["Home", "Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const templateTypes = [
  "Image Right, Content Left",
  "Image Left, Content Right",
  "Image Background, Content Left",
  "Image Background, Content Right",
  "Image Background, Content Center",
];

const mockBanners = [
  { id: 1, name: "Spring Promo", template: "Image Right, Content Left", active: true, rank: 1 },
  { id: 2, name: "Welcome Banner", template: "Image Background, Content Center", active: true, rank: 2 },
  { id: 3, name: "Holiday Deal", template: "Image Left, Content Right", active: false, rank: 3 },
];

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const PromoBannerPage = () => {
  const [editing, setEditing] = useState<number | null>(null);

  if (editing !== null) {
    const banner = mockBanners.find(b => b.id === editing);
    return <PromoEditForm banner={banner} onBack={() => setEditing(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Promotional Banner Setup</h1>
          <p className="page-subtitle">Configure promotional campaign banners</p>
        </div>
        <button onClick={() => setEditing(0)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={16} /> New Banner
        </button>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Banner Name</th><th>Template</th><th>Active</th><th>Rank</th><th>Action</th></tr></thead>
          <tbody>
            {mockBanners.map(b => (
              <tr key={b.id}>
                <td className="font-medium text-foreground">{b.name}</td>
                <td className="text-muted-foreground text-xs">{b.template}</td>
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

const PromoEditForm = ({ banner, onBack }: { banner?: any; onBack: () => void }) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["USA"]);
  const [selectedPages, setSelectedPages] = useState<string[]>(["Home"]);
  const [days, setDays] = useState<string[]>([]);
  const [langTab, setLangTab] = useState("English");

  const toggleRegion = (r: string) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  const togglePage = (p: string) => setSelectedPages(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleDay = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"><ArrowLeft size={15} /> Back to Banners</button>
        <h1 className="page-title">{banner ? "Edit Promotional Banner" : "New Promotional Banner"}</h1>
      </div>

      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Banner Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelCls}>Banner Name</label><input className={inputCls} defaultValue={banner?.name || ""} /></div>
          <div><label className={labelCls}>Template Type</label>
            <select className={inputCls} defaultValue={banner?.template}>
              {templateTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Background Image</label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">Upload image</div>
          </div>
          <div><label className={labelCls}>Content Text</label><textarea className={`${inputCls} min-h-[80px]`} placeholder="Rich content..." /></div>
          <div><label className={labelCls}>Font Family</label>
            <select className={inputCls}><option>Inter</option><option>Arial</option><option>Georgia</option><option>Verdana</option></select>
          </div>
          <div><label className={labelCls}>Font Size</label><input className={inputCls} type="number" defaultValue={16} /></div>
          <div><label className={labelCls}>Font Color</label><input className={inputCls} type="color" defaultValue="#ffffff" /></div>
          <div><label className={labelCls}>Button Label</label><input className={inputCls} placeholder="Shop Now" /></div>
          <div><label className={labelCls}>Button Link</label><input className={inputCls} placeholder="https://..." /></div>
          <div><label className={labelCls}>Banner Rank (1–50)</label><input className={inputCls} type="number" defaultValue={banner?.rank || 1} min={1} max={50} /></div>
        </div>
      </div>

      {/* Display Pages */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Display Pages</h3>
        <div className="flex flex-wrap gap-2">
          {displayPages.map(p => (
            <button key={p} onClick={() => togglePage(p)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${selectedPages.includes(p) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
              {selectedPages.includes(p) ? "☑" : "☐"} {p}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
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

      {/* Recurring Timing */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Recurring Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Days of Week</label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${days.includes(d) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>{d}</button>
              ))}
            </div>
          </div>
          <div><label className={labelCls}>Start Time</label><input className={inputCls} type="time" /></div>
          <div><label className={labelCls}>End Time</label><input className={inputCls} type="time" /></div>
        </div>
      </div>

      {/* Translation */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Translation</h3>
        <div className="flex gap-2 mb-4 border-b border-border">
          {["English", "French", "Spanish", "German"].map(lang => (
            <button key={lang} onClick={() => setLangTab(lang)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${langTab === lang ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {lang}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div><label className={labelCls}>Content ({langTab})</label><textarea className={`${inputCls} min-h-[60px]`} /></div>
          <div><label className={labelCls}>Button Label ({langTab})</label><input className={inputCls} /></div>
        </div>
      </div>

      <div className="admin-card mb-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={banner?.active} className="accent-primary" /> Active</label>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button onClick={onBack} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

export default PromoBannerPage;
