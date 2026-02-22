import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const tabs = ["Basic Info", "Pricing", "Content", "Media", "Flags", "Display Control", "Rules", "Alerts", "Program Visibility", "Audit"];

const ProductDetailPage = ({ product, onBack }: { product?: any; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          <ArrowLeft size={15} /> Back to Products
        </button>
        <h1 className="page-title">Product Detail: {product?.name || "New Product"}</h1>
        <p className="page-subtitle">Product ID: {product?.id || "—"}</p>
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
        {activeTab === 2 && <ContentTab />}
        {activeTab === 3 && <MediaTab />}
        {activeTab === 4 && <FlagsTab />}
        {activeTab === 5 && <DisplayControlTab />}
        {activeTab === 6 && <RulesTab />}
        {activeTab === 7 && <AlertsTab />}
        {activeTab === 8 && <ProgramVisibilityTab />}
        {activeTab === 9 && <AuditTab />}
      </div>

      <div className="flex gap-3 mt-4">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
      </div>
    </div>
  );
};

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const FormField = ({ label, children, readOnly }: { label: string; children?: React.ReactNode; readOnly?: boolean }) => (
  <div>
    <label className={labelCls}>{label} {readOnly && <span className="text-xs text-muted-foreground">(Read-only)</span>}</label>
    {children || <input className={inputCls} readOnly={readOnly} />}
  </div>
);

const BasicInfoTab = ({ product }: { product?: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Product ID" readOnly><input className={inputCls} value={product?.id || ""} readOnly /></FormField>
    <FormField label="Product Name"><input className={inputCls} defaultValue={product?.name || ""} /></FormField>
    <FormField label="Brand Name" />
    <FormField label="Supplier Name" />
    <FormField label="Supplier ID" />
    <FormField label="Category">
      <select className={inputCls}><option>Electronics</option><option>Accessories</option><option>Computing</option></select>
    </FormField>
    <FormField label="Subcategory">
      <select className={inputCls}><option>Peripherals</option><option>Audio</option><option>Adapters</option></select>
    </FormField>
    <FormField label="Item Group" />
    <FormField label="Location ID" />
    <FormField label="Physical Nature">
      <select className={inputCls}><option>Digital</option><option>Physical</option><option>Experience</option></select>
    </FormField>
    <FormField label="Status">
      <select className={inputCls}><option>Active</option><option>Inactive</option></select>
    </FormField>
    <FormField label="Model Number" />
    <div className="flex items-center gap-2 pt-6"><input type="checkbox" className="accent-primary" /><span className="text-sm">Shipped Product</span></div>
  </div>
);

const PricingTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Supplier Price"><input className={inputCls} type="number" placeholder="0.00" /></FormField>
    <FormField label="MSRP"><input className={inputCls} type="number" placeholder="0.00" /></FormField>
    <FormField label="Margin Table"><select className={inputCls}><option>Standard</option><option>Premium</option><option>Discount</option></select></FormField>
    <FormField label="Margin %"><input className={inputCls} type="number" placeholder="15" /></FormField>
    <FormField label="Calculated Retail Price" readOnly><input className={inputCls} readOnly placeholder="Auto-calculated" /></FormField>
    <FormField label="Currency"><select className={inputCls}><option>USD</option><option>EUR</option><option>GBP</option></select></FormField>
    <FormField label="Override Price"><input className={inputCls} type="number" placeholder="Optional" /></FormField>
    <FormField label="Override Points"><input className={inputCls} type="number" placeholder="Optional" /></FormField>
    <div className="flex items-center gap-6 col-span-2 pt-2">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Tax Included</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Shipping Included</label>
    </div>
  </div>
);

const ContentTab = () => (
  <div className="space-y-4">
    <FormField label="Overview"><textarea className={`${inputCls} min-h-[100px]`} placeholder="Product overview..." /></FormField>
    <FormField label="Product Description"><textarea className={`${inputCls} min-h-[100px]`} placeholder="Detailed product description..." /></FormField>
    <FormField label="Delivery Information"><textarea className={`${inputCls} min-h-[60px]`} placeholder="Delivery details..." /></FormField>
    <FormField label="Terms & Conditions"><textarea className={`${inputCls} min-h-[60px]`} /></FormField>
    <FormField label="Cancellation Policy"><textarea className={`${inputCls} min-h-[60px]`} /></FormField>
    <FormField label="Keywords"><input className={inputCls} placeholder="keyword1, keyword2, keyword3" /></FormField>
  </div>
);

const MediaTab = () => (
  <div className="space-y-4">
    <FormField label="Primary Image Upload">
      <div className="border-2 border-dashed border-input rounded-lg p-8 text-center text-muted-foreground text-sm">
        Drag & drop an image or click to browse
      </div>
    </FormField>
    <FormField label="Image URL"><input className={inputCls} placeholder="https://..." /></FormField>
    <FormField label="Image Alt Text"><input className={inputCls} placeholder="Descriptive alt text" /></FormField>
  </div>
);

const FlagsTab = () => (
  <div className="space-y-3">
    {["Best Seller", "Featured", "New Product", "Discount Available", "Great Deal"].map((f) => (
      <label key={f} className="flex items-center gap-3 text-sm p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <input type="checkbox" className="accent-primary w-4 h-4" /> {f}
      </label>
    ))}
  </div>
);

const DisplayControlTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Display Start Date"><input className={inputCls} type="date" /></FormField>
    <FormField label="Display End Date"><input className={inputCls} type="date" /></FormField>
    <div className="col-span-2">
      <label className={labelCls}>Recurring Days</label>
      <div className="flex gap-2 flex-wrap">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <button key={d} className="px-3 py-1.5 rounded-full text-xs border border-input hover:bg-accent transition-colors">{d}</button>
        ))}
      </div>
    </div>
    <FormField label="Max Quantity Per User"><input className={inputCls} type="number" placeholder="0" /></FormField>
    <FormField label="Age Restriction"><input className={inputCls} placeholder="None" /></FormField>
    <div className="col-span-2 space-y-2">
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Purchase Acknowledgement Required</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> Hide If Out of Stock</label>
    </div>
  </div>
);

const RulesTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Rule Type"><select className={inputCls}><option>None</option><option>Country Restriction</option><option>State Restriction</option></select></FormField>
    <FormField label="Enforcement Type"><select className={inputCls}><option>Hard Block</option><option>Soft Warning</option></select></FormField>
    <FormField label="Country Restriction"><input className={inputCls} /></FormField>
    <FormField label="State Restriction"><input className={inputCls} /></FormField>
    <FormField label="Postal Code Restriction"><input className={inputCls} /></FormField>
    <FormField label="Program Restriction"><input className={inputCls} /></FormField>
    <div className="col-span-2"><FormField label="Warning Message"><textarea className={`${inputCls} min-h-[60px]`} /></FormField></div>
  </div>
);

const AlertsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Alert Title"><input className={inputCls} /></FormField>
    <FormField label="Display Position"><select className={inputCls}><option>Top</option><option>Bottom</option><option>Inline</option></select></FormField>
    <div className="col-span-2"><FormField label="Alert Message"><textarea className={`${inputCls} min-h-[60px]`} /></FormField></div>
    <FormField label="Page Scope"><input className={inputCls} /></FormField>
    <FormField label="Start Date"><input className={inputCls} type="date" /></FormField>
    <FormField label="End Date"><input className={inputCls} type="date" /></FormField>
    <div className="flex items-center gap-2 pt-6"><input type="checkbox" className="accent-primary" /><span className="text-sm">Active</span></div>
  </div>
);

const ProgramVisibilityTab = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm"><input type="radio" name="pv" className="accent-primary" defaultChecked /> Visible to All Programs</label>
      <label className="flex items-center gap-2 text-sm"><input type="radio" name="pv" className="accent-primary" /> Visible to Selected Programs</label>
    </div>
    <FormField label="Selected Programs"><select className={inputCls} multiple><option>Program A</option><option>Program B</option><option>Program C</option></select></FormField>
    <FormField label="Excluded Programs"><select className={inputCls} multiple><option>Program D</option><option>Program E</option></select></FormField>
  </div>
);

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
      <div className="space-y-2 mt-2">
        {[
          { date: "2026-02-20 14:22", user: "manager@ontra.com", change: "Updated pricing - MSRP changed from $29.99 to $34.99" },
          { date: "2026-02-18 10:15", user: "admin@ontra.com", change: "Activated product for EMEA region" },
          { date: "2026-01-15 09:30", user: "admin@ontra.com", change: "Product created" },
        ].map((log, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50 text-sm">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{log.date}</span>
            <span className="text-xs text-primary">{log.user}</span>
            <span className="text-foreground">{log.change}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
