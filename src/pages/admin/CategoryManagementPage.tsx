import { useState, useMemo, useRef } from "react";
import { Search, RotateCcw, Pencil, Plus, ArrowLeft, Upload, Download, Trash2, ArrowUpDown } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";

const mainCategories = [
  { id: 1, name: "Beverages", code: "BEV", active: true, region: "USA, EMEA", subcategories: ["Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies"] },
  { id: 2, name: "Restaurants", code: "REST", active: true, region: "All", subcategories: ["Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences"] },
  { id: 3, name: "Order In", code: "ORDR", active: true, region: "USA, Canada", subcategories: ["Food Delivery"] },
  { id: 4, name: "Meal Kits", code: "MEAL", active: true, region: "All", subcategories: ["Premium Items", "Meal Kit"] },
  { id: 5, name: "Goodies", code: "GOOD", active: true, region: "EMEA, APAC", subcategories: ["Snacks", "Treats", "Edible Gifts"] },
  { id: 6, name: "Grocery", code: "GROC", active: false, region: "USA", subcategories: [] },
];

const allRegions = ["All", "USA", "Canada", "EMEA", "India", "APAC", "Latin America", "China", "Oceania"];
const programs = ["Program Alpha", "Program Beta", "Program Gamma", "Program Delta", "Program Epsilon"];

const CategoryManagementPage = () => {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categories, setCategories] = useState(mainCategories);
  const [editingId, setEditingId] = useState<number | null>(null);

  if (editingId !== null) {
    const cat = categories.find((c) => c.id === editingId);
    return (
      <CategoryEditForm
        category={cat}
        onBack={() => setEditingId(null)}
        onSave={(updated) => {
          setCategories(categories.map(c => c.id === updated.id ? updated : c));
          setEditingId(null);
        }}
      />
    );
  }

  const filtered = categories.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (regionFilter && !c.region.includes(regionFilter)) return false;
    if (statusFilter === "active" && !c.active) return false;
    if (statusFilter === "inactive" && c.active) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Control visibility and structure of marketplace categories</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Category Name / Code" className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Regions</option>
            {allRegions.filter(r => r !== "All").map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Search size={14} /> Search</button>
            <button onClick={() => { setSearch(""); setRegionFilter(""); setStatusFilter(""); }} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"><RotateCcw size={14} /></button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th><th>Code</th><th>Active</th><th>Region</th><th>Action</th>
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

/* ─── Edit Form ─── */
interface CategoryData {
  id: number;
  name: string;
  code: string;
  active: boolean;
  region: string;
  subcategories: string[];
}

const CategoryEditForm = ({ category, onBack, onSave }: { category?: CategoryData; onBack: () => void; onSave: (c: CategoryData) => void }) => {
  const [active, setActive] = useState(category?.active ?? true);
  const [showInNav, setShowInNav] = useState(true);
  const [defaultExpanded, setDefaultExpanded] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    category?.region === "All" ? allRegions.filter(r => r !== "All") : (category?.region.split(", ") || ["USA"])
  );
  const [programVisibility, setProgramVisibility] = useState("all");
  const [selectedPrograms, setSelectedPrograms] = useState<ProgramRow[]>([]);
  const [excludedPrograms, setExcludedPrograms] = useState<ProgramRow[]>([]);

  const toggleRegion = (r: string) => {
    if (r === "All") {
      setSelectedRegions(prev => prev.length === allRegions.length - 1 ? [] : allRegions.filter(x => x !== "All"));
      return;
    }
    setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };


  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          <ArrowLeft size={15} /> Back to Categories
        </button>
        <h1 className="page-title">Edit Category: {category?.name}</h1>
        <p className="page-subtitle">Configure category details and visibility settings</p>
      </div>

      {/* Basic Section */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category Name <span className="text-xs text-muted-foreground">(Read-only)</span></label>
            <input value={category?.name || ""} readOnly className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category Code <span className="text-xs text-muted-foreground">(Read-only)</span></label>
            <input value={category?.code || ""} readOnly className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={() => setActive(!active)} className="accent-primary" /> Active</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showInNav} onChange={() => setShowInNav(!showInNav)} className="accent-primary" /> Show in Navigation</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={defaultExpanded} onChange={() => setDefaultExpanded(!defaultExpanded)} className="accent-primary" /> Default Expanded in Menu</label>
        </div>
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">Subcategories</label>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map(s => (
                <span key={s} className="px-3 py-1 rounded-full text-xs bg-muted text-foreground border border-border">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visibility Section */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Region Selection</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleRegion("All")}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              selectedRegions.length === allRegions.length - 1 ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
            }`}
          >
            ☐ All
          </button>
          {allRegions.filter(r => r !== "All").map(r => (
            <button
              key={r}
              onClick={() => toggleRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                selectedRegions.includes(r) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
              }`}
            >
              {selectedRegions.includes(r) ? "☑" : "☐"} {r}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Program Visibility</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="prog" checked={programVisibility === "all"} onChange={() => setProgramVisibility("all")} className="accent-primary" />
            Visible for All Programs
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="prog" checked={programVisibility === "selected"} onChange={() => setProgramVisibility("selected")} className="accent-primary" />
            Selected Programs
          </label>
        </div>
      </div>

      {programVisibility === "selected" && (
        <ProgramUploadSection
          title="Included Programs"
          status="Included"
          statusClass="bg-success/15 text-success"
          rows={selectedPrograms}
          setRows={setSelectedPrograms}
          uploadLabel="Upload Included Programs"
          sampleRows={[["P1001","Program Alpha"],["P1002","Program Beta"],["P1003","Program Gamma"]]}
          sampleName="included_programs_template"
        />
      )}

      <ProgramUploadSection
        title="Excluded Programs"
        status="Excluded"
        statusClass="bg-destructive/15 text-destructive"
        rows={excludedPrograms}
        setRows={setExcludedPrograms}
        uploadLabel="Upload Excluded Programs"
        sampleRows={[["P2001","Program Delta"],["P2002","Program Epsilon"]]}
        sampleName="excluded_programs_template"
      />


      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
        <button onClick={() => { if (category) onSave({ ...category, active, region: selectedRegions.join(", ") }); }} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save</button>
      </div>
    </div>
  );
};

/* ─── Program Upload Section ─── */
interface ProgramRow { id: string; name: string }

interface UploadSectionProps {
  title: string;
  status: string;
  statusClass: string;
  rows: ProgramRow[];
  setRows: (r: ProgramRow[]) => void;
  uploadLabel: string;
  sampleRows: string[][];
  sampleName: string;
}

const PAGE_SIZE = 10;

const ProgramUploadSection = ({ title, status, statusClass, rows, setRows, uploadLabel, sampleRows, sampleName }: UploadSectionProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<"id" | "name">("id");
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Program ID", "Program Name"], ...sampleRows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${sampleName}.xlsx`);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      toast({ title: "Invalid file format", description: "Only .xlsx, .xls, .csv files are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10 MB.", variant: "destructive" });
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (!data.length) throw new Error("empty");
      const first = data[0];
      const keys = Object.keys(first).map(k => k.toLowerCase().trim());
      if (!keys.some(k => k.includes("program id")) || !keys.some(k => k.includes("program name"))) {
        toast({ title: "Invalid file format", description: "Program ID and Program Name are mandatory.", variant: "destructive" });
        return;
      }
      const parsed: ProgramRow[] = data.map(r => {
        const idKey = Object.keys(r).find(k => k.toLowerCase().trim().includes("program id")) || "";
        const nameKey = Object.keys(r).find(k => k.toLowerCase().trim().includes("program name")) || "";
        return { id: String(r[idKey]).trim(), name: String(r[nameKey]).trim() };
      }).filter(r => r.id && r.name);

      const seen = new Set<string>();
      for (const r of parsed) {
        if (seen.has(r.id)) {
          toast({ title: "Duplicate Program ID found", description: r.id, variant: "destructive" });
          return;
        }
        seen.add(r.id);
      }
      setRows(parsed);
      setPage(1);
      toast({ title: "Upload successful", description: `${parsed.length} programs loaded.` });
    } catch {
      toast({ title: "Upload failed", description: "Could not read the file.", variant: "destructive" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const filtered = useMemo(() => {
    const f = rows.filter(r =>
      !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())
    );
    return [...f].sort((a, b) => {
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [rows, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: "id" | "name") => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));

  return (
    <div className="admin-card mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="font-heading font-semibold text-foreground">
          {title} <span className="text-xs text-muted-foreground font-normal">({rows.length} Records)</span>
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={downloadTemplate} type="button" className="flex items-center gap-1.5 px-3 py-2 border border-input rounded-lg text-xs text-muted-foreground hover:bg-muted">
            <Download size={13} /> Download Sample Template
          </button>
          <button onClick={() => fileRef.current?.click()} type="button" className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
            <Upload size={13} /> {uploadLabel}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <div className="mb-3 relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search Program ID / Name" className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><button onClick={() => toggleSort("id")} className="flex items-center gap-1 hover:text-primary">Program ID <ArrowUpDown size={12} /></button></th>
                  <th><button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-primary">Program Name <ArrowUpDown size={12} /></button></th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs">{r.id}</td>
                    <td>{r.name}</td>
                    <td><span className={`px-2 py-0.5 rounded text-xs ${statusClass}`}>{status}</span></td>
                    <td>
                      <button onClick={() => removeRow(r.id)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-destructive hover:bg-destructive/10">
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-muted-foreground text-sm py-6">No matching records</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2.5 py-1 border border-input rounded disabled:opacity-40 hover:bg-muted">Prev</button>
                <span className="px-2.5 py-1">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2.5 py-1 border border-input rounded disabled:opacity-40 hover:bg-muted">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
          No programs uploaded yet. Use the upload button to add programs.
        </p>
      )}
    </div>
  );
};

export default CategoryManagementPage;

