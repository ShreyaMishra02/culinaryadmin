import { useState } from "react";
import { Search, RotateCcw, Pencil, Plus } from "lucide-react";

const mockCategories = [
  { id: 1, name: "Electronics", code: "ELEC", active: true, region: "USA, EMEA", modifiedDate: "2026-02-20", modifiedBy: "admin@ontra.com" },
  { id: 2, name: "Gift Cards", code: "GIFT", active: true, region: "All", modifiedDate: "2026-02-19", modifiedBy: "manager@ontra.com" },
  { id: 3, name: "Travel & Experiences", code: "TRVL", active: false, region: "USA, Canada", modifiedDate: "2026-02-18", modifiedBy: "admin@ontra.com" },
  { id: 4, name: "Home & Living", code: "HOME", active: true, region: "All", modifiedDate: "2026-02-17", modifiedBy: "manager@ontra.com" },
  { id: 5, name: "Fashion & Apparel", code: "FASH", active: true, region: "EMEA, APAC", modifiedDate: "2026-02-16", modifiedBy: "admin@ontra.com" },
  { id: 6, name: "Health & Wellness", code: "HLTH", active: true, region: "USA", modifiedDate: "2026-02-15", modifiedBy: "support@ontra.com" },
];

const CategoryManagementPage = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState(mockCategories);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = categories.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (region && !c.region.includes(region)) return false;
    if (status === "active" && !c.active) return false;
    if (status === "inactive" && c.active) return false;
    return true;
  });

  if (editingId !== null) {
    const cat = categories.find((c) => c.id === editingId);
    return <CategoryEditForm category={cat} onBack={() => setEditingId(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Control visibility and structure of marketplace categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Category Name / Code" className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Regions</option>
            <option>USA</option><option>Canada</option><option>EMEA</option><option>APAC</option><option>India</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Status</option>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Search size={14} /> Search</button>
            <button onClick={() => { setSearch(""); setRegion(""); setStatus(""); }} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"><RotateCcw size={14} /> Reset</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th><th>Code</th><th>Active</th><th>Region</th><th>Modified</th><th>Modified By</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground">{c.name}</td>
                  <td><span className="px-2 py-0.5 rounded bg-muted text-xs font-mono">{c.code}</span></td>
                  <td>
                    <button
                      onClick={() => setCategories(categories.map(cat => cat.id === c.id ? { ...cat, active: !cat.active } : cat))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${c.active ? "bg-success" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${c.active ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="text-muted-foreground">{c.region}</td>
                  <td className="text-muted-foreground text-xs">{c.modifiedDate}</td>
                  <td className="text-muted-foreground text-xs">{c.modifiedBy}</td>
                  <td>
                    <button onClick={() => setEditingId(c.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-primary hover:bg-accent transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const regions = ["USA", "Canada", "EMEA", "India", "APAC", "Latin America", "China", "Oceania"];

const CategoryEditForm = ({ category, onBack }: { category?: any; onBack: () => void }) => {
  const [name, setName] = useState(category?.name || "");
  const [code, setCode] = useState(category?.code || "");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(category?.active ?? true);
  const [showInNav, setShowInNav] = useState(true);
  const [defaultExpanded, setDefaultExpanded] = useState(false);
  const [programVisibility, setProgramVisibility] = useState("all");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["USA"]);

  const toggleRegion = (r: string) => {
    if (r === "All") { setSelectedRegions(regions); return; }
    setSelectedRegions((prev) => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{category ? "Edit Category" : "New Category"}</h1>
        <p className="page-subtitle">Configure category details and visibility settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="admin-card">
          <h3 className="font-heading font-semibold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category Code *</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={() => setActive(!active)} className="accent-primary" /> Active</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showInNav} onChange={() => setShowInNav(!showInNav)} className="accent-primary" /> Show in Navigation</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={defaultExpanded} onChange={() => setDefaultExpanded(!defaultExpanded)} className="accent-primary" /> Default Expanded</label>
            </div>
          </div>
        </div>

        {/* Program & Region */}
        <div className="space-y-4">
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-4">Program Visibility</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="prog" checked={programVisibility === "all"} onChange={() => setProgramVisibility("all")} className="accent-primary" /> Visible to All Programs</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="prog" checked={programVisibility === "selected"} onChange={() => setProgramVisibility("selected")} className="accent-primary" /> Visible to Selected Programs</label>
            </div>
          </div>
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-4">Region Selection</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toggleRegion("All")} className="px-3 py-1 rounded-full text-xs border border-input hover:bg-accent transition-colors">Select All</button>
              {regions.map((r) => (
                <button key={r} onClick={() => toggleRegion(r)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${selectedRegions.includes(r) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save</button>
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
