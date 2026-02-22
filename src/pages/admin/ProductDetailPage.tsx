import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const tabs = ["Basic Info", "Pricing", "Content", "Media", "Flags", "Display", "Program", "Audit"];

const categories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const subcategoriesMap: Record<string, string[]> = {
  Beverages: ["Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies"],
  Restaurants: ["Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences"],
  "Order In": ["Food Delivery"],
  "Meal Kits": ["Premium Items", "Meal Kit"],
  Goodies: ["Snacks", "Treats", "Edible Gifts"],
  Grocery: [],
};

const ProductDetailPage = ({ product, onBack }: { product?: any; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          <ArrowLeft size={15} /> Back to Products
        </button>
        <h1 className="page-title">{product?.name || "New Product"} – {product?.id || "—"}</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-4 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        {activeTab === 0 && <BasicInfoTab product={product} />}
        {activeTab === 1 && <PricingTab />}
        {activeTab === 2 && <ContentTab product={product} />}
        {activeTab === 3 && <MediaTab />}
        {activeTab === 4 && <FlagsTab />}
        {activeTab === 5 && <DisplayTab />}
        {activeTab === 6 && <ProgramTab />}
        {activeTab === 7 && <AuditTab />}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const readOnlyCls = "w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const BasicInfoTab = ({ product }: { product?: any }) => {
  const [cat, setCat] = useState(product?.category || "");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className={labelCls}>Product PK <span className="text-xs text-muted-foreground">(Read-only)</span></label><input className={readOnlyCls} value="12345" readOnly /></div>
      <div><label className={labelCls}>Product ID <span className="text-xs text-muted-foreground">(Read-only)</span></label><input className={readOnlyCls} value={product?.id || ""} readOnly /></div>
      <div><label className={labelCls}>Product Name</label><input className={inputCls} defaultValue={product?.name || ""} /></div>
      <div><label className={labelCls}>Brand Name</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Supplier Name</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Supplier ID</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Category</label>
        <select className={inputCls} value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Select...</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div><label className={labelCls}>Subcategory</label>
        <select className={inputCls}>
          <option value="">Select...</option>
          {(subcategoriesMap[cat] || []).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div><label className={labelCls}>Subcategory Group (Item Group)</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Location ID</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Physical Nature</label>
        <select className={inputCls}><option>Digital</option><option>Physical</option><option>Experience</option></select>
      </div>
      <div><label className={labelCls}>Model Number</label><input className={inputCls} /></div>
      <div><label className={labelCls}>Status</label>
        <select className={inputCls}><option>Active</option><option>Inactive</option></select>
      </div>
      <div><label className={labelCls}>Data Source <span className="text-xs text-muted-foreground">(Read-only)</span></label><input className={readOnlyCls} value={product?.dataSource || "PS"} readOnly /></div>
      <div className="flex items-center gap-6 col-span-1 md:col-span-2 pt-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Shipped Product</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={product?.active} className="accent-primary" /> Active</label>
      </div>
    </div>
  );
};

const PricingTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div><label className={labelCls}>Supplier Price</label><input className={inputCls} type="number" placeholder="0.00" /></div>
    <div><label className={labelCls}>MSRP</label><input className={inputCls} type="number" placeholder="0.00" /></div>
    <div><label className={labelCls}>Margin Table</label><select className={inputCls}><option>Standard</option><option>Premium</option><option>Discount</option></select></div>
    <div><label className={labelCls}>Margin %</label><input className={inputCls} type="number" placeholder="15" /></div>
    <div><label className={labelCls}>Calculated Retail Price <span className="text-xs text-muted-foreground">(Auto)</span></label><input className={readOnlyCls} readOnly placeholder="Auto-calculated" /></div>
    <div><label className={labelCls}>Currency</label><select className={inputCls}><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option></select></div>
    <div><label className={labelCls}>Program Point Value <span className="text-xs text-muted-foreground">(Auto)</span></label><input className={readOnlyCls} readOnly placeholder="Auto" /></div>
    <div><label className={labelCls}>Converted Point Value <span className="text-xs text-muted-foreground">(Auto)</span></label><input className={readOnlyCls} readOnly placeholder="Auto" /></div>
    <div><label className={labelCls}>Override Price</label><input className={inputCls} type="number" placeholder="Optional" /></div>
    <div><label className={labelCls}>Override Point Value</label><input className={inputCls} type="number" placeholder="Optional" /></div>
    <div className="flex items-center gap-6 col-span-1 md:col-span-2 pt-2">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Tax Included</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Shipping Included</label>
    </div>
  </div>
);

const ContentTab = ({ product }: { product?: any }) => (
  <div className="space-y-4">
    <div><label className={labelCls}>Overview</label><textarea className={`${inputCls} min-h-[100px]`} placeholder="Product overview..." /></div>
    <div><label className={labelCls}>Product Description</label><textarea className={`${inputCls} min-h-[100px]`} placeholder="Detailed description..." /></div>
    <div><label className={labelCls}>Delivery Information</label><textarea className={`${inputCls} min-h-[60px]`} placeholder="Delivery details..." /></div>
    <div><label className={labelCls}>Terms & Conditions</label><textarea className={`${inputCls} min-h-[60px]`} /></div>
    {product?.dataSource === "Viator" && (
      <div><label className={labelCls}>Cancellation Policy <span className="text-xs text-muted-foreground">(Viator only)</span></label><textarea className={`${inputCls} min-h-[60px]`} /></div>
    )}
    <div><label className={labelCls}>Keywords</label><input className={inputCls} placeholder="keyword1, keyword2, keyword3" /></div>
  </div>
);

const MediaTab = () => {
  const [additionalImages, setAdditionalImages] = useState<string[]>([""]);
  return (
    <div className="space-y-4">
      <div><label className={labelCls}>Primary Image URL</label><input className={inputCls} placeholder="https://..." /></div>
      <div>
        <label className={labelCls}>Upload Primary Image</label>
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
          Drag & drop an image or click to browse
        </div>
      </div>
      <div>
        <label className={labelCls}>Additional Images</label>
        {additionalImages.map((_, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={inputCls} placeholder={`Image URL ${i + 1}`} />
            <button onClick={() => setAdditionalImages(additionalImages.filter((_, j) => j !== i))} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={() => setAdditionalImages([...additionalImages, ""])} className="flex items-center gap-1 text-xs text-primary hover:underline mt-1"><Plus size={13} /> Add More Image</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">Thumbnail</div>
      </div>
      <div><label className={labelCls}>Image Alt Text</label><input className={inputCls} placeholder="Descriptive alt text" /></div>
    </div>
  );
};

const FlagsTab = () => (
  <div className="space-y-3">
    {["Best Seller", "Featured", "New Product", "Discount Available", "Great Deal"].map((f) => (
      <label key={f} className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <input type="checkbox" className="accent-primary w-4 h-4" /> {f}
      </label>
    ))}
  </div>
);

const DisplayTab = () => {
  const [days, setDays] = useState<string[]>([]);
  const toggleDay = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className={labelCls}>Display Start Date</label><input className={inputCls} type="date" /></div>
      <div><label className={labelCls}>Display End Date</label><input className={inputCls} type="date" /></div>
      <div className="col-span-1 md:col-span-2">
        <label className={labelCls}>Recurring Days</label>
        <div className="flex gap-2 flex-wrap">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
            <button key={d} onClick={() => toggleDay(d)} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${days.includes(d) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>{d}</button>
          ))}
        </div>
      </div>
      <div><label className={labelCls}>Age Restriction</label><input className={inputCls} placeholder="None" /></div>
      <div><label className={labelCls}>Max Quantity Per User</label><input className={inputCls} type="number" placeholder="0" /></div>
      <div><label className={labelCls}>Purchase Acknowledgement Text</label><textarea className={`${inputCls} min-h-[60px]`} /></div>
      <div className="col-span-1 md:col-span-2 space-y-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Purchase Acknowledgement Required</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Show Purchase Checkbox Before Add to Cart</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Hide If Out of Stock</label>
      </div>
    </div>
  );
};



const ProgramTab = () => {
  const [vis, setVis] = useState("all");
  const programs = ["Program Alpha", "Program Beta", "Program Gamma", "Program Delta", "Program Epsilon"];
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="pv" checked={vis === "all"} onChange={() => setVis("all")} className="accent-primary" /> Visible to All</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="pv" checked={vis === "selected"} onChange={() => setVis("selected")} className="accent-primary" /> Selected Programs</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="pv" checked={vis === "excluded"} onChange={() => setVis("excluded")} className="accent-primary" /> Excluded Programs</label>
      </div>
      {vis !== "all" && (
        <div>
          <label className={labelCls}>{vis === "selected" ? "Selected" : "Excluded"} Programs</label>
          <div className="flex flex-wrap gap-2">
            {programs.map(p => (
              <button key={p} className="px-3 py-1.5 rounded-full text-xs border border-input hover:bg-accent transition-colors">{p}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AuditTab = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className={labelCls}>Created By</label><p className="text-sm text-muted-foreground">admin@ontra.com</p></div>
      <div><label className={labelCls}>Created Date</label><p className="text-sm text-muted-foreground">2026-01-15 09:30:00</p></div>
      <div><label className={labelCls}>Modified By</label><p className="text-sm text-muted-foreground">manager@ontra.com</p></div>
      <div><label className={labelCls}>Modified Date</label><p className="text-sm text-muted-foreground">2026-02-20 14:22:00</p></div>
    </div>
    <div>
      <label className={labelCls}>Change Log</label>
      <div className="overflow-x-auto mt-2">
        <table className="admin-table">
          <thead><tr><th>Date</th><th>User</th><th>Change</th></tr></thead>
          <tbody>
            {[
              { date: "2026-02-20 14:22", user: "manager@ontra.com", change: "Updated pricing - MSRP changed from $29.99 to $34.99" },
              { date: "2026-02-18 10:15", user: "admin@ontra.com", change: "Activated product for EMEA region" },
              { date: "2026-01-15 09:30", user: "admin@ontra.com", change: "Product created" },
            ].map((log, i) => (
              <tr key={i}>
                <td className="text-xs text-muted-foreground whitespace-nowrap">{log.date}</td>
                <td className="text-xs text-primary">{log.user}</td>
                <td className="text-sm">{log.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
