import { useState } from "react";
import { ArrowLeft, Search, Plus } from "lucide-react";

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const samplePrograms = [
  { number: "PG-001", name: "Rewards Plus", aiEnabled: true, widgetEnabled: true, offCategories: ["Grocery"], offSubcategories: [], offBrands: [], offSuppliers: [] },
  { number: "PG-002", name: "Corporate Perks", aiEnabled: false, widgetEnabled: true, offCategories: [], offSubcategories: ["Fast Food"], offBrands: ["BrandX"], offSuppliers: [] },
  { number: "PG-003", name: "Employee Benefits", aiEnabled: true, widgetEnabled: false, offCategories: [], offSubcategories: [], offBrands: [], offSuppliers: ["Supplier A"] },
  { number: "PG-004", name: "Partner Network", aiEnabled: false, widgetEnabled: false, offCategories: ["Beverages", "Goodies"], offSubcategories: [], offBrands: [], offSuppliers: [] },
];

const categories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const subcategories = ["Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies", "Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences", "Food Delivery", "Premium Items", "Meal Kit", "Snacks", "Treats", "Edible Gifts"];
const brands = ["BrandX", "BrandY", "BrandZ", "Premium Co", "Value Inc"];
const suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];

const ProgramConfigPage = () => {
  const [editing, setEditing] = useState<typeof samplePrograms[0] | null>(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filtered, setFiltered] = useState(samplePrograms);

  const handleSearch = () => {
    setFiltered(samplePrograms.filter(p =>
      (!searchNumber || p.number.toLowerCase().includes(searchNumber.toLowerCase())) &&
      (!searchName || p.name.toLowerCase().includes(searchName.toLowerCase()))
    ));
  };

  if (editing) {
    return <ProgramEditPage program={editing} onBack={() => setEditing(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Program Configuration</h1>
        <p className="page-subtitle">Manage program settings and visibility</p>
      </div>

      {/* Filters */}
      <div className="admin-card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className={labelCls}>Program Number</label>
            <input className={inputCls} placeholder="Search by number..." value={searchNumber} onChange={e => setSearchNumber(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Program Name</label>
            <input className={inputCls} placeholder="Search by name..." value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              <Search size={14} /> Search
            </button>
            <button onClick={() => { setSearchNumber(""); setSearchName(""); setFiltered(samplePrograms); }} className="px-4 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Reset</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Program Number</th>
              <th>Program Name</th>
              <th>AI Enabled</th>
              <th>Widget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.number}>
                <td className="font-medium">{p.number}</td>
                <td>{p.name}</td>
                <td><span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${p.aiEnabled ? "bg-green-500" : "bg-muted-foreground/30"}`} />{p.aiEnabled ? "Yes" : "No"}</td>
                <td><span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${p.widgetEnabled ? "bg-green-500" : "bg-muted-foreground/30"}`} />{p.widgetEnabled ? "Yes" : "No"}</td>
                <td><button onClick={() => setEditing(p)} className="text-xs text-primary hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Edit Page ── */

const MultiSelectField = ({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) => {
  const toggle = (item: string) => onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="border border-input rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 px-2 py-1 rounded">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="accent-primary w-3.5 h-3.5" />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

const ProgramEditPage = ({ program, onBack }: { program: any; onBack: () => void }) => {
  const [aiEnabled, setAiEnabled] = useState(program.aiEnabled);
  const [widgetEnabled, setWidgetEnabled] = useState(program.widgetEnabled);
  const [offCats, setOffCats] = useState<string[]>(program.offCategories);
  const [offSubs, setOffSubs] = useState<string[]>(program.offSubcategories);
  const [offBrands, setOffBrands] = useState<string[]>(program.offBrands);
  const [offSuppliers, setOffSuppliers] = useState<string[]>(program.offSuppliers);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          <ArrowLeft size={15} /> Back to Programs
        </button>
        <h1 className="page-title">{program.name} – {program.number}</h1>
      </div>

      <div className="admin-card space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Program Number</label>
            <input className={`${inputCls} bg-muted`} value={program.number} readOnly />
          </div>
          <div>
            <label className={labelCls}>Program Name</label>
            <input className={inputCls} defaultValue={program.name} />
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Feature Toggles</h3>
          <div className="space-y-3">
            <ToggleRow label="Enable Culinary Marketplace AI" checked={aiEnabled} onChange={setAiEnabled} />
            <ToggleRow label="Enable Widget" checked={widgetEnabled} onChange={setWidgetEnabled} />
          </div>
        </div>

        {/* Turn Off Sections */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Turn Off Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiSelectField label="Turn Off Categories" options={categories} selected={offCats} onChange={setOffCats} />
            <MultiSelectField label="Turn Off Subcategories" options={subcategories} selected={offSubs} onChange={setOffSubs} />
            <MultiSelectField label="Turn Off Brands" options={brands} selected={offBrands} onChange={setOffBrands} />
            <MultiSelectField label="Turn Off Suppliers" options={suppliers} selected={offSuppliers} onChange={setOffSuppliers} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  </label>
);

export default ProgramConfigPage;
