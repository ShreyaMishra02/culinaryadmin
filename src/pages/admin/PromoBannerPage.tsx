import { useMemo, useRef, useState, useEffect } from "react";
import {
  Plus, Pencil, ArrowLeft, Search, X, Check, MoreHorizontal, Copy, Eye, Power, PowerOff, Trash2,
  Image as ImageIcon, AlertTriangle, ChevronDown, ChevronUp, Filter, LayoutGrid
} from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

const regionList = [
  { name: "Australia & Pacific", code: "APAC" },
  { name: "Canada", code: "CA" },
  { name: "Europe, Middle East & Africa", code: "EMEA" },
  { name: "Greater China", code: "GC" },
  { name: "India", code: "IND" },
  { name: "Latin America", code: "LATAM" },
  { name: "North Asia", code: "NA" },
  { name: "Southeast Asia", code: "SEA" },
  { name: "United States", code: "USA" },
];

const displayPages = ["Home", "Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];

const templateTypes = [
  "Image Right, Content Left",
  "Image Left, Content Right",
  "Full Background Image",
  "Full Text Banner",
] as const;
type TemplateType = typeof templateTypes[number];

const bannerTypes = ["Promotional Banner", "Product Banner"] as const;
type BannerType = typeof bannerTypes[number];

const statusList = ["Draft", "Active", "Scheduled", "Expired", "Inactive"] as const;
type BannerStatus = typeof statusList[number];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const languages = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Chinese", "Japanese"];
const MAX_RANK = 50;

interface BannerRecord {
  id: number;
  name: string;
  type: BannerType;
  template: TemplateType;
  status: BannerStatus;
  pages: string[];
  regions: string[];
  rank: number;
  startDate: string;
  endDate: string;
  lastModified: string;
  createdBy: string;
  thumbnail?: string;
  bgColor?: string;
}

const mockBanners: BannerRecord[] = [
  { id: 1, name: "Spring Promo", type: "Promotional Banner", template: "Image Right, Content Left", status: "Active", pages: ["Home"], regions: ["USA"], rank: 1, startDate: "2026-03-01", endDate: "2026-05-31", lastModified: "2026-06-20", createdBy: "Sarah Chen", thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200" },
  { id: 2, name: "Welcome Banner", type: "Promotional Banner", template: "Image Left, Content Right", status: "Active", pages: ["Home"], regions: ["USA", "EMEA"], rank: 2, startDate: "2026-01-01", endDate: "2026-12-31", lastModified: "2026-06-15", createdBy: "Mike Ross", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200" },
  { id: 3, name: "Holiday Deal", type: "Product Banner", template: "Full Background Image", status: "Scheduled", pages: ["Home"], regions: ["APAC"], rank: 4, startDate: "2026-11-01", endDate: "2026-12-31", lastModified: "2026-05-30", createdBy: "Ana Silva", thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200" },
  { id: 4, name: "Wine Collection", type: "Product Banner", template: "Image Right, Content Left", status: "Active", pages: ["Restaurants"], regions: ["EMEA"], rank: 1, startDate: "2026-02-01", endDate: "2026-08-31", lastModified: "2026-06-10", createdBy: "Sarah Chen", thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200" },
  { id: 5, name: "Summer Sale Text", type: "Promotional Banner", template: "Full Text Banner", status: "Draft", pages: ["Restaurants"], regions: ["USA"], rank: 2, startDate: "", endDate: "", lastModified: "2026-06-25", createdBy: "Mike Ross", bgColor: "#fde68a" },
  { id: 6, name: "Legacy Offer", type: "Promotional Banner", template: "Image Left, Content Right", status: "Expired", pages: ["Beverages"], regions: ["USA"], rank: 1, startDate: "2025-11-01", endDate: "2025-12-31", lastModified: "2026-01-05", createdBy: "Ana Silva", thumbnail: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=200" },
];

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

const statusStyles: Record<BannerStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Active: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Expired: "bg-rose-100 text-rose-700",
  Inactive: "bg-zinc-200 text-zinc-700",
};

/* ============================== LIST PAGE ============================== */
const PromoBannerPage = () => {
  const [banners, setBanners] = useState<BannerRecord[]>(mockBanners);
  const [editing, setEditing] = useState<BannerRecord | null | "new">(null);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fStatus, setFStatus] = useState<BannerStatus | "">("");
  const [fTemplate, setFTemplate] = useState<TemplateType | "">("");
  const [fPage, setFPage] = useState<string>("");
  const [fRegion, setFRegion] = useState<string>("");
  const [fCreatedBy, setFCreatedBy] = useState<string>("");
  const [fModified, setFModified] = useState<string>("");
  const [sortKey, setSortKey] = useState<keyof BannerRecord>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const creators = useMemo(() => Array.from(new Set(banners.map(b => b.createdBy))), [banners]);

  if (editing !== null) {
    return (
      <PromoEditForm
        banner={editing === "new" ? undefined : editing}
        allBanners={banners}
        onBack={() => setEditing(null)}
        onSave={(rec) => {
          setBanners(prev => {
            const idx = prev.findIndex(b => b.id === rec.id);
            if (idx >= 0) { const cp = [...prev]; cp[idx] = rec; return cp; }
            return [...prev, rec];
          });
          setEditing(null);
        }}
      />
    );
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return banners.filter(b => {
      if (q && !(
        b.name.toLowerCase().includes(q) ||
        b.pages.some(p => p.toLowerCase().includes(q)) ||
        b.regions.some(r => r.toLowerCase().includes(q)) ||
        b.status.toLowerCase().includes(q)
      )) return false;
      if (fStatus && b.status !== fStatus) return false;
      if (fTemplate && b.template !== fTemplate) return false;
      if (fPage && !b.pages.includes(fPage)) return false;
      if (fRegion && !b.regions.includes(fRegion)) return false;
      if (fCreatedBy && b.createdBy !== fCreatedBy) return false;
      if (fModified && b.lastModified < fModified) return false;
      return true;
    });
  }, [banners, query, fStatus, fTemplate, fPage, fRegion, fCreatedBy, fModified]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] as any; const bv = b[sortKey] as any;
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const allSelectedOnPage = pageRows.length > 0 && pageRows.every(r => selected.includes(r.id));

  const toggleSort = (k: keyof BannerRecord) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const bulk = (op: "activate" | "deactivate" | "delete" | "duplicate") => {
    setBanners(prev => {
      if (op === "delete") return prev.filter(b => !selected.includes(b.id));
      if (op === "duplicate") {
        const dup = prev.filter(b => selected.includes(b.id)).map(b => ({ ...b, id: Date.now() + b.id, name: `${b.name} (Copy)`, status: "Draft" as BannerStatus }));
        return [...prev, ...dup];
      }
      return prev.map(b => selected.includes(b.id)
        ? { ...b, status: (op === "activate" ? "Active" : "Inactive") as BannerStatus } : b);
    });
    setSelected([]);
  };

  const rowAction = (b: BannerRecord, op: string) => {
    setOpenMenu(null);
    if (op === "edit") setEditing(b);
    else if (op === "duplicate") setBanners(prev => [...prev, { ...b, id: Date.now(), name: `${b.name} (Copy)`, status: "Draft" }]);
    else if (op === "activate") setBanners(prev => prev.map(x => x.id === b.id ? { ...x, status: "Active" } : x));
    else if (op === "deactivate") setBanners(prev => prev.map(x => x.id === b.id ? { ...x, status: "Inactive" } : x));
    else if (op === "delete") setBanners(prev => prev.filter(x => x.id !== b.id));
  };

  const SortHead = ({ k, label }: { k: keyof BannerRecord; label: string }) => (
    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 hover:text-foreground">
      {label}
      {sortKey === k ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronDown size={12} className="opacity-30" />}
    </button>
  );

  const clearFilters = () => { setFStatus(""); setFTemplate(""); setFPage(""); setFRegion(""); setFCreatedBy(""); setFModified(""); };
  const activeFilterCount = [fStatus, fTemplate, fPage, fRegion, fCreatedBy, fModified].filter(Boolean).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Promotional Banners</h1>
          <p className="page-subtitle">Manage all promotional and product banners across pages and regions</p>
        </div>
        <button onClick={() => setEditing("new")} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Create Banner
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className={`${inputCls} pl-9`} placeholder="Search banner name, page, region, status" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
          </div>
          <button onClick={() => setShowFilters(v => !v)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${showFilters || activeFilterCount ? "border-primary text-primary bg-primary/5" : "border-input hover:bg-accent"}`}>
            <Filter size={14} /> Filters {activeFilterCount > 0 && <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5">{activeFilterCount}</span>}
          </button>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-4 pt-4 border-t border-border">
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={fStatus} onChange={e => setFStatus(e.target.value as BannerStatus)}>
                <option value="">All</option>
                {statusList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Template</label>
              <select className={inputCls} value={fTemplate} onChange={e => setFTemplate(e.target.value as TemplateType)}>
                <option value="">All</option>
                {templateTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Display Page</label>
              <select className={inputCls} value={fPage} onChange={e => setFPage(e.target.value)}>
                <option value="">All</option>
                {displayPages.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <select className={inputCls} value={fRegion} onChange={e => setFRegion(e.target.value)}>
                <option value="">All</option>
                {regionList.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Created By</label>
              <select className={inputCls} value={fCreatedBy} onChange={e => setFCreatedBy(e.target.value)}>
                <option value="">All</option>
                {creators.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Modified after</label>
              <input type="date" className={inputCls} value={fModified} onChange={e => setFModified(e.target.value)} />
            </div>
            <div className="col-span-full flex justify-end">
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear filters</button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="admin-card mb-4 flex items-center justify-between flex-wrap gap-3 bg-primary/5 border-primary/20">
          <div className="text-sm font-medium text-foreground">{selected.length} selected</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => bulk("activate")} className="px-3 py-1.5 text-xs border border-input rounded-md hover:bg-accent flex items-center gap-1"><Power size={12} /> Activate</button>
            <button onClick={() => bulk("deactivate")} className="px-3 py-1.5 text-xs border border-input rounded-md hover:bg-accent flex items-center gap-1"><PowerOff size={12} /> Deactivate</button>
            <button onClick={() => bulk("duplicate")} className="px-3 py-1.5 text-xs border border-input rounded-md hover:bg-accent flex items-center gap-1"><Copy size={12} /> Duplicate</button>
            <button onClick={() => bulk("delete")} className="px-3 py-1.5 text-xs border border-destructive text-destructive rounded-md hover:bg-destructive/10 flex items-center gap-1"><Trash2 size={12} /> Delete</button>
            <button onClick={() => setSelected([])} className="px-3 py-1.5 text-xs text-muted-foreground hover:underline">Clear</button>
          </div>
        </div>
      )}

      {/* Table / Empty */}
      {sorted.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <LayoutGrid size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">No Promotional Banners Found</h3>
          <p className="text-sm text-muted-foreground mb-4">Get started by creating your first banner.</p>
          <button onClick={() => setEditing("new")} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <Plus size={16} /> Create Your Banner
          </button>
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 w-8">
                    <input type="checkbox" checked={allSelectedOnPage} onChange={() => {
                      const ids = pageRows.map(r => r.id);
                      setSelected(prev => allSelectedOnPage ? prev.filter(i => !ids.includes(i)) : Array.from(new Set([...prev, ...ids])));
                    }} />
                  </th>
                  <th className="px-3 py-3 text-left">Preview</th>
                  <th className="px-3 py-3 text-left"><SortHead k="name" label="Banner Name" /></th>
                  <th className="px-3 py-3 text-left"><SortHead k="type" label="Banner Type" /></th>
                  <th className="px-3 py-3 text-left">Template</th>
                  <th className="px-3 py-3 text-left">Display Pages</th>
                  <th className="px-3 py-3 text-left">Regions</th>
                  <th className="px-3 py-3 text-left"><SortHead k="rank" label="Rank" /></th>
                  <th className="px-3 py-3 text-left"><SortHead k="status" label="Status" /></th>
                  <th className="px-3 py-3 text-left"><SortHead k="startDate" label="Start" /></th>
                  <th className="px-3 py-3 text-left"><SortHead k="endDate" label="End" /></th>
                  <th className="px-3 py-3 text-left">Last Modified</th>
                  <th className="px-3 py-3 text-left">Created By</th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageRows.map(b => (
                  <tr key={b.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selected.includes(b.id)} onChange={() => setSelected(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])} />
                    </td>
                    <td className="px-3 py-2">
                      {b.thumbnail ? (
                        <img src={b.thumbnail} alt="" className="w-14 h-9 object-cover rounded border border-border" />
                      ) : (
                        <div className="w-14 h-9 rounded border border-border flex items-center justify-center text-[9px] font-medium text-foreground" style={{ backgroundColor: b.bgColor || "#f4f6fa" }}>
                          Text Banner
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">{b.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{b.type}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.template}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.pages.join(", ")}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.regions.join(", ")}</td>
                    <td className="px-3 py-2 text-muted-foreground">{b.rank}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.startDate || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.endDate || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.lastModified}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{b.createdBy}</td>
                    <td className="px-3 py-2 relative">
                      <button onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)} className="p-1.5 rounded hover:bg-accent"><MoreHorizontal size={14} /></button>
                      {openMenu === b.id && (
                        <div className="absolute right-2 top-8 z-20 w-40 bg-background border border-border rounded-lg shadow-lg py-1 text-sm">
                          {[
                            { op: "edit", icon: Pencil, label: "Edit" },
                            { op: "duplicate", icon: Copy, label: "Duplicate" },
                            { op: "preview", icon: Eye, label: "Preview" },
                            { op: b.status === "Active" ? "deactivate" : "activate", icon: b.status === "Active" ? PowerOff : Power, label: b.status === "Active" ? "Deactivate" : "Activate" },
                            { op: "delete", icon: Trash2, label: "Delete", danger: true },
                          ].map((a: any) => (
                            <button key={a.op} onClick={() => rowAction(b, a.op)} className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent text-left ${a.danger ? "text-destructive" : "text-foreground"}`}>
                              <a.icon size={13} /> {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs">
            <div className="text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
            </div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-input rounded-md hover:bg-accent disabled:opacity-50">Previous</button>
              <span className="text-muted-foreground">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-input rounded-md hover:bg-accent disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --------------------------- Translation Modal --------------------------- */
interface TranslationModalProps {
  open: boolean;
  title: string;
  translations: Record<string, string>;
  onChange: (lang: string, html: string) => void;
  onClose: () => void;
  simple?: boolean;
}

const TranslationModal = ({ open, title, translations, onChange, onClose, simple }: TranslationModalProps) => {
  const [activeLang, setActiveLang] = useState(languages[0]);
  if (!open) return null;
  const translateAll = () => {
    const source = translations[languages[0]] || "";
    languages.slice(1).forEach(l => { if (!translations[l]) onChange(l, source); });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-heading font-semibold text-foreground">Translate: {title}</h3>
            <p className="text-xs text-muted-foreground">Manage translations for each supported language</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={translateAll} className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90">Translate All</button>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent"><X size={16} /></button>
          </div>
        </div>
        <div className="flex gap-2 px-5 pt-3 border-b border-border overflow-x-auto">
          {languages.map(l => (
            <button key={l} onClick={() => setActiveLang(l)}
              className={`px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${activeLang === l ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <label className={labelCls}>{simple ? title : "Content"} ({activeLang})</label>
          {simple ? (
            <input className={inputCls} value={translations[activeLang] || ""} onChange={e => onChange(activeLang, e.target.value)} />
          ) : (
            <RichTextEditor value={translations[activeLang] || ""} onChange={html => onChange(activeLang, html)} minHeight={200} />
          )}
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Done</button>
        </div>
      </div>
    </div>
  );
};

/* ================================ EDIT FORM ================================ */
interface EditProps {
  banner?: BannerRecord;
  allBanners: BannerRecord[];
  onBack: () => void;
  onSave: (b: BannerRecord) => void;
}

const PromoEditForm = ({ banner, allBanners, onBack, onSave }: EditProps) => {
  const [name, setName] = useState(banner?.name || "");
  const [type, setType] = useState<BannerType>(banner?.type || "Promotional Banner");
  const [template, setTemplate] = useState<TemplateType>(banner?.template || templateTypes[0]);
  const [imageUrl, setImageUrl] = useState(banner?.thumbnail || "");
  const [altText, setAltText] = useState("");
  const [bannerText, setBannerText] = useState("<p>A name that focuses on personal growth and reflection that travel can inspire.</p>");
  const [buttonLabel, setButtonLabel] = useState("<p>Shop Now</p>");
  const [buttonAlign, setButtonAlign] = useState<"left" | "center" | "right">("left");
  const [bgColor, setBgColor] = useState(banner?.bgColor || "#f4f6fa");
  const [textBgColor, setTextBgColor] = useState("#ffffff");

  // Full Background Image config
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [verticalPos, setVerticalPos] = useState<"top" | "center" | "bottom">("center");
  const [textWidth, setTextWidth] = useState(50);

  // Full Text Banner config
  const [textColor, setTextColor] = useState("#111827");
  const [padding, setPadding] = useState(40);
  const [ctaPosition, setCtaPosition] = useState<"below" | "inline">("below");
  const [bgGradientTo, setBgGradientTo] = useState("");
  const [status, setStatus] = useState<BannerStatus>(banner?.status || "Draft");
  const [rank, setRank] = useState<number>(banner?.rank || 1);

  const [selectedPages, setSelectedPages] = useState<string[]>(banner?.pages || ["Home"]);
  const [pageSearch, setPageSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(banner?.regions || ["USA"]);
  const [regionSearch, setRegionSearch] = useState("");

  const [startDate, setStartDate] = useState(banner?.startDate || "");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(banner?.endDate || "");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState<string[]>([]);

  const [textTranslations, setTextTranslations] = useState<Record<string, string>>({});
  const [labelTranslations, setLabelTranslations] = useState<Record<string, string>>({});
  const [altTranslations, setAltTranslations] = useState<Record<string, string>>({});
  const [translateTarget, setTranslateTarget] = useState<null | "text" | "label" | "alt">(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPages = useMemo(
    () => displayPages.filter(p => p.toLowerCase().includes(pageSearch.toLowerCase())),
    [pageSearch]
  );
  const filteredRegions = useMemo(
    () => regionList.filter(r => r.name.toLowerCase().includes(regionSearch.toLowerCase()) || r.code.toLowerCase().includes(regionSearch.toLowerCase())),
    [regionSearch]
  );

  const toggle = <T,>(arr: T[], setter: (v: T[]) => void, value: T) =>
    setter(arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value]);

  // Intelligent rank: compute taken ranks across selected pages
  const takenRanksByPage = useMemo(() => {
    const map: Record<string, Set<number>> = {};
    allBanners.forEach(b => {
      if (banner && b.id === banner.id) return;
      b.pages.forEach(p => {
        if (!map[p]) map[p] = new Set();
        map[p].add(b.rank);
      });
    });
    return map;
  }, [allBanners, banner]);

  const availableRanks = useMemo(() => {
    const list: number[] = [];
    for (let r = 1; r <= MAX_RANK; r++) {
      const conflict = selectedPages.some(p => takenRanksByPage[p]?.has(r));
      if (!conflict) list.push(r);
    }
    return list;
  }, [selectedPages, takenRanksByPage]);

  const rankConflictPage = useMemo(() => {
    return selectedPages.find(p => takenRanksByPage[p]?.has(rank));
  }, [rank, selectedPages, takenRanksByPage]);

  // Reset rank if it conflicts on page change
  useEffect(() => {
    if (rankConflictPage && availableRanks.length > 0) setRank(availableRanks[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPages.join(",")]);

  const needsImage = template !== "Full Text Banner";
  const showTextBgControl = template === "Image Right, Content Left" || template === "Image Left, Content Right";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Banner Name is required";
    if (!type) e.type = "Banner Type is required";
    if (needsImage) {
      if (!imageUrl.trim()) e.imageUrl = "Image URL is required";
      else { try { new URL(imageUrl); } catch { e.imageUrl = "Enter a valid URL"; } }
      if (!altText.trim()) e.altText = "Image Alt Text is required for accessibility";
    }
    if (selectedPages.length === 0) e.pages = "At least one Display Page is required";
    if (selectedRegions.length === 0) e.regions = "At least one Region is required";
    if (rankConflictPage) e.rank = `Banner Rank ${rank} is already assigned on the ${rankConflictPage} page. Please select another available rank.`;
    if (startDate && endDate) {
      const s = new Date(`${startDate}T${startTime || "00:00"}`);
      const en = new Date(`${endDate}T${endTime || "23:59"}`);
      if (en < s) e.date = "End Date/Time cannot be earlier than Start Date/Time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const rec: BannerRecord = {
      id: banner?.id ?? Date.now(),
      name, type, template, status, rank,
      pages: selectedPages, regions: selectedRegions,
      startDate, endDate,
      lastModified: new Date().toISOString().slice(0, 10),
      createdBy: banner?.createdBy || "You",
      thumbnail: needsImage ? imageUrl : undefined,
      bgColor: !needsImage ? bgColor : undefined,
    };
    onSave(rec);
  };

  const setDayQuick = (kind: "weekdays" | "weekends" | "everyday") => {
    if (kind === "weekdays") setDays(daysOfWeek.slice(0, 5));
    else if (kind === "weekends") setDays(daysOfWeek.slice(5));
    else setDays(daysOfWeek);
  };

  const hasButton = buttonLabel.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"><ArrowLeft size={15} /> Back to Banners</button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{banner ? "Edit Banner" : "New Banner"}</h1>
            <p className="page-subtitle">Configure banner content, targeting, and schedule</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          {/* Banner Information */}
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-4">Banner Information</h3>

            {/* Banner Type */}
            <div className="mb-4">
              <label className={labelCls}>Banner Type <span className="text-destructive">*</span></label>
              <div className="inline-flex rounded-lg border border-input overflow-hidden">
                {bannerTypes.map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`px-4 py-2 text-sm transition-colors ${type === t ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Banner Name <span className="text-destructive">*</span></label>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Rank</label>
                <select className={inputCls} value={rank} onChange={(e) => setRank(Number(e.target.value))}>
                  {availableRanks.length === 0 && <option value={rank}>{rank}</option>}
                  {availableRanks.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Available ranks are filtered by selected Display Pages.</p>
                {errors.rank && <p className="text-xs text-destructive mt-1">{errors.rank}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Template Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templateTypes.map(t => (
                    <label key={t}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${template === t ? "border-primary bg-primary/5 text-primary" : "border-input hover:bg-accent"}`}>
                      <input type="radio" name="template" className="accent-primary" checked={template === t} onChange={() => setTemplate(t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {needsImage && (
                <>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Image URL <span className="text-destructive">*</span></label>
                    <input className={inputCls} placeholder="https://cdn.example.com/banner.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {errors.imageUrl && <p className="text-xs text-destructive mt-1">{errors.imageUrl}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>
                      Image Alt Text <span className="text-destructive">*</span>
                      <span className="ml-1 text-xs font-normal text-muted-foreground">(WCAG accessibility)</span>
                    </label>
                    <div className="flex gap-2">
                      <input className={inputCls} placeholder="Describe the image for screen readers" value={altText} onChange={e => setAltText(e.target.value)} />
                      <button type="button" onClick={() => setTranslateTarget("alt")} title="Translate" className="px-3 rounded-lg border border-input hover:bg-accent text-pink-500">🌐</button>
                    </div>
                    {!altText.trim() && imageUrl.trim() && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> Alt text is missing. Required for WCAG compliance.</p>
                    )}
                    {errors.altText && <p className="text-xs text-destructive mt-1">{errors.altText}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Banner Text */}
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-3">Banner Text</h3>
            <RichTextEditor value={bannerText} onChange={setBannerText} onTranslate={() => setTranslateTarget("text")} minHeight={180} />

            {/* Template-specific text controls */}
            {showTextBgControl && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelCls}>Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Text Area Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textBgColor} onChange={(e) => setTextBgColor(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={textBgColor} onChange={(e) => setTextBgColor(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {template === "Full Background Image" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelCls}>Text Alignment</label>
                  <div className="inline-flex rounded-lg border border-input overflow-hidden w-full">
                    {(["left", "center", "right"] as const).map(a => (
                      <button key={a} type="button" onClick={() => setTextAlign(a)} className={`flex-1 px-3 py-2 text-sm capitalize ${textAlign === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Vertical Position</label>
                  <div className="inline-flex rounded-lg border border-input overflow-hidden w-full">
                    {(["top", "center", "bottom"] as const).map(a => (
                      <button key={a} type="button" onClick={() => setVerticalPos(a)} className={`flex-1 px-3 py-2 text-sm capitalize ${verticalPos === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Overlay Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={overlayColor} onChange={e => setOverlayColor(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={overlayColor} onChange={e => setOverlayColor(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Overlay Opacity ({overlayOpacity}%)</label>
                  <input type="range" min={0} max={100} value={overlayOpacity} onChange={e => setOverlayOpacity(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Text Width ({textWidth}%)</label>
                  <input type="range" min={20} max={100} value={textWidth} onChange={e => setTextWidth(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>
            )}

            {template === "Full Text Banner" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelCls}>Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={bgColor} onChange={e => setBgColor(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Gradient To (optional)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgGradientTo || "#ffffff"} onChange={e => setBgGradientTo(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={bgGradientTo} placeholder="Leave empty for solid" onChange={e => setBgGradientTo(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-10 w-14 rounded border border-input" />
                    <input value={textColor} onChange={e => setTextColor(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Padding ({padding}px)</label>
                  <input type="range" min={16} max={96} value={padding} onChange={e => setPadding(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className={labelCls}>Text Alignment</label>
                  <div className="inline-flex rounded-lg border border-input overflow-hidden w-full">
                    {(["left", "center", "right"] as const).map(a => (
                      <button key={a} type="button" onClick={() => setTextAlign(a)} className={`flex-1 px-3 py-2 text-sm capitalize ${textAlign === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Vertical Alignment</label>
                  <div className="inline-flex rounded-lg border border-input overflow-hidden w-full">
                    {(["top", "center", "bottom"] as const).map(a => (
                      <button key={a} type="button" onClick={() => setVerticalPos(a)} className={`flex-1 px-3 py-2 text-sm capitalize ${verticalPos === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>CTA Position</label>
                  <div className="inline-flex rounded-lg border border-input overflow-hidden">
                    {(["below", "inline"] as const).map(a => (
                      <button key={a} type="button" onClick={() => setCtaPosition(a)} className={`px-4 py-2 text-sm capitalize ${ctaPosition === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground">CTA (Button)</h3>
              <span className="text-xs text-muted-foreground">Leave label empty to hide the button</span>
            </div>
            <label className={labelCls}>Button Label</label>
            <RichTextEditor value={buttonLabel} onChange={setButtonLabel} onTranslate={() => setTranslateTarget("label")} minHeight={120} />
            <div className="mt-4">
              <label className={labelCls}>Button Alignment</label>
              <div className="inline-flex rounded-lg border border-input overflow-hidden">
                {(["left", "center", "right"] as const).map(a => (
                  <button key={a} type="button" onClick={() => setButtonAlign(a)}
                    className={`px-4 py-2 text-sm capitalize transition-colors ${buttonAlign === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Pages */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground">Display Pages</h3>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setSelectedPages([...displayPages])} className="text-primary hover:underline">Select All</button>
                <span className="text-muted-foreground">·</span>
                <button onClick={() => setSelectedPages([])} className="text-muted-foreground hover:underline">Clear All</button>
              </div>
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} placeholder="Search pages..." value={pageSearch} onChange={(e) => setPageSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredPages.map(p => {
                const on = selectedPages.includes(p);
                return (
                  <button key={p} onClick={() => toggle(selectedPages, setSelectedPages, p)}
                    className={`px-3 py-1.5 rounded-full text-xs border inline-flex items-center gap-1.5 transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                    {on && <Check size={12} />} {p}
                  </button>
                );
              })}
            </div>
            {errors.pages && <p className="text-xs text-destructive mt-2">{errors.pages}</p>}
          </div>

          {/* Region */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground">Region Selection</h3>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setSelectedRegions(regionList.map(r => r.code))} className="text-primary hover:underline">Select All</button>
                <span className="text-muted-foreground">·</span>
                <button onClick={() => setSelectedRegions([])} className="text-muted-foreground hover:underline">Clear All</button>
              </div>
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} placeholder="Search regions..." value={regionSearch} onChange={(e) => setRegionSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredRegions.map(r => {
                const on = selectedRegions.includes(r.code);
                return (
                  <button key={r.code} onClick={() => toggle(selectedRegions, setSelectedRegions, r.code)}
                    className={`px-3 py-1.5 rounded-full text-xs border inline-flex items-center gap-1.5 transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                    {on && <Check size={12} />} {r.name} <span className="opacity-70">({r.code})</span>
                  </button>
                );
              })}
            </div>
            {errors.regions && <p className="text-xs text-destructive mt-2">{errors.regions}</p>}
          </div>

          {/* Timing */}
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-4">Banner Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className={labelCls}>Start Date</label><input className={inputCls} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div><label className={labelCls}>Start Time</label><input className={inputCls} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>
              <div><label className={labelCls}>End Date</label><input className={inputCls} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
              <div><label className={labelCls}>End Time</label><input className={inputCls} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>
            </div>
            {errors.date && <p className="text-xs text-destructive mb-3">{errors.date}</p>}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelCls} mb-0`}>Days of Week</label>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setDayQuick("weekdays")} className="text-primary hover:underline">Weekdays</button>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={() => setDayQuick("weekends")} className="text-primary hover:underline">Weekends</button>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={() => setDayQuick("everyday")} className="text-primary hover:underline">Everyday</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(d => {
                  const on = days.includes(d);
                  return (
                    <button key={d} onClick={() => toggle(days, setDays, d)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="admin-card">
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={status} onChange={e => setStatus(e.target.value as BannerStatus)}>
              {statusList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* -------------------- LIVE PREVIEW -------------------- */}
        <div className="xl:col-span-1">
          <div className="admin-card sticky top-16">
            <h3 className="font-heading font-semibold text-foreground mb-3">Live Preview</h3>

            {template === "Image Right, Content Left" || template === "Image Left, Content Right" ? (
              <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: bgColor }}>
                <div className={`flex flex-col ${template === "Image Left, Content Right" ? "md:flex-row-reverse" : "md:flex-row"}`}>
                  <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={altText} className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    ) : (
                      <span className="text-xs text-muted-foreground p-4">Image preview</span>
                    )}
                  </div>
                  <div className="md:w-1/2 p-5 flex flex-col justify-center gap-3" style={{ backgroundColor: textBgColor }}>
                    <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: bannerText }} />
                    {hasButton && (
                      <div className="flex mt-2" style={{ justifyContent: buttonAlign === "left" ? "flex-start" : buttonAlign === "right" ? "flex-end" : "center" }}>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium" dangerouslySetInnerHTML={{ __html: buttonLabel }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : template === "Full Background Image" ? (
              <div className="rounded-lg overflow-hidden border border-border relative aspect-video bg-muted">
                {imageUrl && <img src={imageUrl} alt={altText} className="absolute inset-0 w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
                <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />
                <div className="absolute inset-0 flex p-5"
                  style={{
                    alignItems: verticalPos === "top" ? "flex-start" : verticalPos === "bottom" ? "flex-end" : "center",
                    justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
                  }}>
                  <div style={{ width: `${textWidth}%`, textAlign, color: "#fff" }}>
                    <div className="text-sm prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{ __html: bannerText }} />
                    {hasButton && (
                      <div className="flex mt-3" style={{ justifyContent: buttonAlign === "left" ? "flex-start" : buttonAlign === "right" ? "flex-end" : "center" }}>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium" dangerouslySetInnerHTML={{ __html: buttonLabel }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg overflow-hidden border border-border flex"
                style={{
                  background: bgGradientTo ? `linear-gradient(135deg, ${bgColor}, ${bgGradientTo})` : bgColor,
                  padding: `${padding}px`,
                  minHeight: 200,
                  color: textColor,
                  alignItems: verticalPos === "top" ? "flex-start" : verticalPos === "bottom" ? "flex-end" : "center",
                  justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
                }}
              >
                <div style={{ textAlign, width: "100%" }}>
                  <div className={`text-sm prose prose-sm max-w-none ${ctaPosition === "inline" ? "inline" : ""}`} style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: bannerText }} />
                  {hasButton && (
                    <div className={ctaPosition === "inline" ? "inline-flex ml-3" : "flex mt-3"} style={{ justifyContent: buttonAlign === "left" ? "flex-start" : buttonAlign === "right" ? "flex-end" : "center" }}>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium" dangerouslySetInnerHTML={{ __html: buttonLabel }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-3">Preview updates automatically as you edit.</p>
            {needsImage && !altText.trim() && imageUrl.trim() && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Missing alt text — fails WCAG.</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>

      <TranslationModal
        open={translateTarget === "text"}
        title="Banner Text"
        translations={{ English: bannerText, ...textTranslations }}
        onChange={(lang, html) => { if (lang === "English") setBannerText(html); else setTextTranslations(prev => ({ ...prev, [lang]: html })); }}
        onClose={() => setTranslateTarget(null)}
      />
      <TranslationModal
        open={translateTarget === "label"}
        title="Button Label"
        translations={{ English: buttonLabel, ...labelTranslations }}
        onChange={(lang, html) => { if (lang === "English") setButtonLabel(html); else setLabelTranslations(prev => ({ ...prev, [lang]: html })); }}
        onClose={() => setTranslateTarget(null)}
      />
      <TranslationModal
        open={translateTarget === "alt"}
        title="Image Alt Text"
        translations={{ English: altText, ...altTranslations }}
        onChange={(lang, val) => { if (lang === "English") setAltText(val); else setAltTranslations(prev => ({ ...prev, [lang]: val })); }}
        onClose={() => setTranslateTarget(null)}
        simple
      />
    </div>
  );
};

export default PromoBannerPage;
