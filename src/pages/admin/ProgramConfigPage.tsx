import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, Search, Upload, Download, X, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

/* ── Master data ── */
const CATEGORIES = ["Beverages", "Goodies", "Grocery", "Meal Kits", "Order In", "Restaurants"];
const SUBCATEGORIES = [
  "Alcohol", "Chain Restaurants", "Coffee & Tea", "Edible Gifts", "Fast Food",
  "Food Delivery", "Meal Kit", "Mocktails", "Premium Items", "Restaurant Experiences",
  "Restaurants", "Smoothies", "Snacks", "Soda", "Treats",
];
const BRANDS = ["Barista Bros", "BrandX", "BrandY", "BrandZ", "Chef's Choice", "Gourmet Select", "Premium Co", "Urban Eats", "Value Inc", "Zesty Foods"];
const SUPPLIERS = ["Alpha Foods", "Global Distributors", "Metro Supply", "Prime Provisions", "Supplier A", "Supplier B", "Supplier C", "Supplier D"];
const GIFT_CARDS = [
  "Amazon eGift Card",
  "Cheesecake Factory eGift Card",
  "Fogo de Chão eGift Card",
  "Morton's The Steakhouse eGift Card",
  "Starbucks eGift Card",
  "Visa Prepaid Gift Card",
];

type Program = {
  number: string;
  name: string;
  alcoholEnabled: boolean;
  giftCardEnabled: boolean;
  excludedCategories: string[];
  excludedSubcategories: string[];
  excludedBrands: string[];
  excludedSuppliers: string[];
  includedGiftCards: string[];
};

const samplePrograms: Program[] = [
  { number: "PG-001", name: "Rewards Plus", alcoholEnabled: false, giftCardEnabled: true, excludedCategories: ["Grocery"], excludedSubcategories: [], excludedBrands: [], excludedSuppliers: [], includedGiftCards: [...GIFT_CARDS] },
  { number: "PG-002", name: "Corporate Perks", alcoholEnabled: true, giftCardEnabled: false, excludedCategories: [], excludedSubcategories: ["Fast Food"], excludedBrands: ["BrandX"], excludedSuppliers: [], includedGiftCards: [] },
  { number: "PG-003", name: "Employee Benefits", alcoholEnabled: false, giftCardEnabled: false, excludedCategories: [], excludedSubcategories: [], excludedBrands: [], excludedSuppliers: ["Supplier A"], includedGiftCards: [] },
  { number: "PG-004", name: "Partner Network", alcoholEnabled: true, giftCardEnabled: true, excludedCategories: ["Beverages", "Goodies"], excludedSubcategories: [], excludedBrands: [], excludedSuppliers: [], includedGiftCards: ["Amazon eGift Card", "Starbucks eGift Card"] },
];

const ProgramConfigPage = () => {
  const [editing, setEditing] = useState<Program | null>(null);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filtered, setFiltered] = useState<Program[]>(samplePrograms);
  const [showBulk, setShowBulk] = useState(false);

  const handleSearch = () => {
    setFiltered(samplePrograms.filter(p =>
      (!searchNumber || p.number.toLowerCase().includes(searchNumber.toLowerCase())) &&
      (!searchName || p.name.toLowerCase().includes(searchName.toLowerCase()))
    ));
  };

  if (editing) {
    return <ProgramEditPage program={editing} onBack={() => setEditing(null)} onOpenBulk={() => setShowBulk(true)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title">Program Configuration</h1>
          <p className="page-subtitle">Manage program-level product visibility and gift card availability</p>
        </div>
        <button onClick={() => setShowBulk(true)} className="flex items-center gap-1.5 px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-muted">
          <Upload size={14} /> Bulk Upload Configuration
        </button>
      </div>

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

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Program Number</th>
              <th>Program Name</th>
              <th>Alcohol</th>
              <th>Gift Cards</th>
              <th>Exclusions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const exCount = p.excludedCategories.length + p.excludedSubcategories.length + p.excludedBrands.length + p.excludedSuppliers.length;
              return (
                <tr key={p.number}>
                  <td className="font-medium">{p.number}</td>
                  <td>{p.name}</td>
                  <td><StatusDot on={p.alcoholEnabled} /></td>
                  <td><StatusDot on={p.giftCardEnabled} /></td>
                  <td className="text-xs text-muted-foreground">{exCount} exclusion{exCount === 1 ? "" : "s"}</td>
                  <td><button onClick={() => setEditing(p)} className="text-xs text-primary hover:underline">Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showBulk && <BulkUploadModal onClose={() => setShowBulk(false)} />}
    </div>
  );
};

const StatusDot = ({ on }: { on: boolean }) => (
  <span className="inline-flex items-center text-xs">
    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${on ? "bg-green-500" : "bg-muted-foreground/30"}`} />
    {on ? "Yes" : "No"}
  </span>
);

/* ── Edit page ── */

const ProgramEditPage = ({ program, onBack, onOpenBulk }: { program: Program; onBack: () => void; onOpenBulk: () => void }) => {
  const [name, setName] = useState(program.name);
  const [alcoholEnabled, setAlcoholEnabled] = useState(program.alcoholEnabled);
  const [giftCardEnabled, setGiftCardEnabled] = useState(program.giftCardEnabled);
  const [exCats, setExCats] = useState<string[]>(program.excludedCategories);
  const [exSubs, setExSubs] = useState<string[]>(program.excludedSubcategories);
  const [exBrands, setExBrands] = useState<string[]>(program.excludedBrands);
  const [exSuppliers, setExSuppliers] = useState<string[]>(program.excludedSuppliers);
  const [incGiftCards, setIncGiftCards] = useState<string[]>(
    program.includedGiftCards.length ? program.includedGiftCards : [...GIFT_CARDS]
  );
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "warning"; text: string } | null>(null);

  useEffect(() => { setDirty(true); }, [name, alcoholEnabled, giftCardEnabled, exCats, exSubs, exBrands, exSuppliers, incGiftCards]);
  useEffect(() => { setDirty(false); }, []);

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const handleBack = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    onBack();
  };

  const handleSave = () => {
    setDirty(false);
    setMsg({ type: "success", text: `Program ${program.number} configuration saved successfully.` });
    setTimeout(() => setMsg(null), 4000);
  };

  // Alcohol category visibility. Alcohol is a subcategory; if disabled, force-exclude it.
  const effectiveExSubs = useMemo(
    () => alcoholEnabled ? exSubs : Array.from(new Set([...exSubs, "Alcohol"])),
    [alcoholEnabled, exSubs]
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          <ArrowLeft size={15} /> Back to Programs
        </button>
        <h1 className="page-title">{program.name} – {program.number}</h1>
        <p className="page-subtitle">Configure product visibility using exclusions; gift cards use inclusions</p>
      </div>

      {msg && (
        <div className={`mb-4 admin-card flex items-start gap-2 border-l-4 ${msg.type === "success" ? "border-l-green-500" : "border-l-yellow-500"}`}>
          {msg.type === "success" ? <CheckCircle2 className="text-green-600 shrink-0" size={18} /> : <AlertTriangle className="text-yellow-600 shrink-0" size={18} />}
          <span className="text-sm">{msg.text}</span>
        </div>
      )}

      <div className="admin-card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Program Number</label>
            <input className={`${inputCls} bg-muted`} value={program.number} readOnly />
          </div>
          <div>
            <label className={labelCls}>Program Name</label>
            <input className={inputCls} value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Feature Toggles</h3>
          <div className="space-y-3">
            <ToggleRow
              label="Enable Alcohol Products"
              hint="When OFF, alcohol products and the Alcohol subcategory are hidden across marketplace."
              checked={alcoholEnabled} onChange={setAlcoholEnabled}
            />
            <ToggleRow
              label="Enable Gift Card Products"
              hint="When OFF, gift cards do not appear in marketplace and the inclusion list is hidden."
              checked={giftCardEnabled} onChange={setGiftCardEnabled}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Product Configuration</h3>
          <p className="text-xs text-muted-foreground mb-4">Select only the records to exclude. Anything not listed is automatically available (including future master data).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExclusionList title="Excluded Categories" options={CATEGORIES} selected={exCats} onChange={setExCats} />
            <ExclusionList title="Excluded Subcategories" options={SUBCATEGORIES} selected={effectiveExSubs} onChange={setExSubs} lockedItems={alcoholEnabled ? [] : ["Alcohol"]} />
            <ExclusionList title="Excluded Brands" options={BRANDS} selected={exBrands} onChange={setExBrands} />
            <ExclusionList title="Excluded Suppliers" options={SUPPLIERS} selected={exSuppliers} onChange={setExSuppliers} />
          </div>
        </div>

        {giftCardEnabled && (
          <div className="border-t border-border pt-4">
            <GiftCardInclusion selected={incGiftCards} onChange={setIncGiftCards} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3 mt-4 flex-wrap">
        <button onClick={onOpenBulk} className="flex items-center gap-1.5 px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-muted">
          <Upload size={14} /> Bulk Upload Configuration
        </button>
        <div className="flex gap-3">
          <button onClick={handleBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
        </div>
      </div>
    </div>
  );
};

/* ── Exclusion list (multi-select with search / select all / clear) ── */

const ExclusionList = ({
  title, options, selected, onChange, lockedItems = [],
}: { title: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; lockedItems?: string[] }) => {
  const [q, setQ] = useState("");
  const sorted = useMemo(() => [...options].sort((a, b) => a.localeCompare(b)), [options]);
  const filtered = useMemo(() => sorted.filter(o => o.toLowerCase().includes(q.toLowerCase())), [sorted, q]);

  const toggle = (item: string) => {
    if (lockedItems.includes(item)) return;
    const next = selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item];
    onChange(next.filter(x => !lockedItems.includes(x)));
  };
  const selectAll = () => onChange(Array.from(new Set([...filtered, ...selected])).filter(x => !lockedItems.includes(x)));
  const clear = () => onChange([]);

  return (
    <div className="border border-border rounded-lg p-3 bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{title} <span className="text-xs text-muted-foreground">({selected.length})</span></div>
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={selectAll} className="text-primary hover:underline">Select all</button>
          <button type="button" onClick={clear} className="text-muted-foreground hover:underline">Clear</button>
        </div>
      </div>
      <div className="relative mb-2">
        <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className={`${inputCls} pl-8 py-1.5 text-xs`} />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {filtered.map(opt => {
          const locked = lockedItems.includes(opt);
          return (
            <label key={opt} className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50"}`}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                disabled={locked}
                onChange={() => toggle(opt)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span>{opt}</span>
              {locked && <span className="ml-auto text-[10px] text-muted-foreground">Auto</span>}
            </label>
          );
        })}
        {filtered.length === 0 && <div className="text-xs text-muted-foreground px-2 py-3 text-center">No results</div>}
      </div>
    </div>
  );
};

/* ── Included gift cards (inclusion model) ── */

const GiftCardInclusion = ({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) => {
  const [q, setQ] = useState("");
  const sorted = useMemo(() => [...GIFT_CARDS].sort((a, b) => a.localeCompare(b)), []);
  const filtered = useMemo(() => sorted.filter(o => o.toLowerCase().includes(q.toLowerCase())), [sorted, q]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Included Gift Cards <span className="text-xs text-muted-foreground font-normal">({selected.length} of {GIFT_CARDS.length} active)</span>
        </h3>
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={() => onChange([...GIFT_CARDS])} className="text-primary hover:underline">Select all</button>
          <button type="button" onClick={() => onChange([])} className="text-muted-foreground hover:underline">Deselect all</button>
        </div>
      </div>
      <div className="relative mb-2 max-w-sm">
        <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search gift cards..." className={`${inputCls} pl-8`} />
      </div>
      <div className="border border-border rounded-lg p-3 bg-background max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1">
        {filtered.map(gc => (
          <label key={gc} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 px-2 py-1.5 rounded">
            <input
              type="checkbox"
              checked={selected.includes(gc)}
              onChange={() => onChange(selected.includes(gc) ? selected.filter(x => x !== gc) : [...selected, gc])}
              className="accent-primary w-3.5 h-3.5"
            />
            {gc}
          </label>
        ))}
        {filtered.length === 0 && <div className="text-xs text-muted-foreground px-2 py-3 text-center col-span-2">No results</div>}
      </div>
    </div>
  );
};

/* ── Toggle row ── */

const ToggleRow = ({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
    <div className="pr-4">
      <div className="text-sm font-medium text-foreground">{label}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 mt-0.5 w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

/* ── Bulk upload modal ── */

const BulkUploadModal = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<null | { ok: number; failed: number; errors: { row: number; programId: string; field: string; value: string; message: string }[] }>(null);
  const [history] = useState([
    { file: "programs_2026-06-05.xlsx", user: "admin@ontra.com", ts: "2026-06-05 14:12", ok: 12, failed: 0 },
    { file: "programs_2026-05-22.xlsx", user: "admin@ontra.com", ts: "2026-05-22 09:41", ok: 8, failed: 2 },
  ]);

  const onPick = (f: File | null) => {
    if (!f) return;
    const ok = /\.(xlsx|xls)$/i.test(f.name);
    if (!ok) { alert("Only .xlsx or .xls files are supported."); return; }
    if (f.size > 20 * 1024 * 1024) { alert("File exceeds 20 MB limit."); return; }
    setFile(f);
    setResult(null);
  };

  const downloadTemplate = () => {
    const headers = [
      "Program ID", "Program Name", "Excluded Categories", "Excluded Subcategories",
      "Excluded Brands", "Excluded Suppliers", "Alcohol Products", "Gift Card Products", "Included Gift Cards",
    ];
    const example = ["PG-001", "Rewards Plus", "Beverages, Grocery", "", "", "", "No", "Yes", "Fogo de Chão eGift Card, Starbucks eGift Card"];
    const csv = [headers.join(","), example.map(v => `"${v}"`).join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "program_configuration_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const process = () => {
    // Simulated validation output
    setResult({
      ok: 3,
      failed: 1,
      errors: [
        { row: 4, programId: "PG-099", field: "Program ID", value: "PG-099", message: "Program does not exist." },
      ],
    });
  };

  const downloadErrors = () => {
    if (!result) return;
    const headers = ["Row", "Program ID", "Field", "Invalid Value", "Error Description"];
    const rows = result.errors.map(e => [e.row, e.programId, e.field, e.value, e.message].map(v => `"${v}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "program_upload_errors.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-primary" />
            <h2 className="text-base font-semibold">Bulk Upload Configuration</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload size={22} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-foreground">Drop your Excel file here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Supported: .xlsx, .xls · Max size: 20 MB</p>
            <input id="bulk-file" type="file" accept=".xlsx,.xls" className="hidden" onChange={e => onPick(e.target.files?.[0] ?? null)} />
            <label htmlFor="bulk-file" className="inline-block mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">Choose file</label>
            {file && <div className="text-xs text-muted-foreground mt-2">Selected: {file.name}</div>}
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-4 py-2 border border-input rounded-lg text-sm hover:bg-muted">
              <Download size={14} /> Download Sample Template
            </button>
            <button disabled={!file} onClick={process} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              <Upload size={14} /> Validate & Upload
            </button>
          </div>

          {result && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm font-medium">Validation Summary</div>
                <div className="text-xs flex gap-3">
                  <span className="text-green-700">✓ {result.ok} updated</span>
                  <span className="text-red-700">✕ {result.failed} failed</span>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="p-3">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Row</th><th>Program ID</th><th>Field</th><th>Value</th><th>Error</th></tr>
                    </thead>
                    <tbody>
                      {result.errors.map((e, i) => (
                        <tr key={i}>
                          <td>{e.row}</td><td>{e.programId}</td><td>{e.field}</td><td>{e.value}</td>
                          <td className="text-red-700 text-xs">{e.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={downloadErrors} className="mt-3 flex items-center gap-1.5 px-3 py-1.5 border border-input rounded-lg text-xs hover:bg-muted">
                    <Download size={12} /> Download Error Report
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2">Upload History</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="admin-table">
                <thead>
                  <tr><th>File</th><th>Uploaded By</th><th>Timestamp</th><th>Updated</th><th>Failed</th></tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td className="text-xs">{h.file}</td>
                      <td className="text-xs">{h.user}</td>
                      <td className="text-xs">{h.ts}</td>
                      <td className="text-xs text-green-700">{h.ok}</td>
                      <td className="text-xs text-red-700">{h.failed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-input rounded-lg text-sm hover:bg-muted">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProgramConfigPage;
