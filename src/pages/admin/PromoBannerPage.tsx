import { useMemo, useState } from "react";
import { Plus, Pencil, ArrowLeft, Search, X, Check } from "lucide-react";
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
const templateTypes = ["Image Right, Content Left", "Image Left, Content Right"] as const;
type TemplateType = typeof templateTypes[number];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const languages = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Chinese", "Japanese"];

const mockBanners = [
  { id: 1, name: "Spring Promo", template: "Image Right, Content Left" as TemplateType, active: true, rank: 1 },
  { id: 2, name: "Welcome Banner", template: "Image Left, Content Right" as TemplateType, active: true, rank: 2 },
  { id: 3, name: "Holiday Deal", template: "Image Right, Content Left" as TemplateType, active: false, rank: 3 },
];

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";

/* ------------------------------- List Page ------------------------------- */
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

/* --------------------------- Translation Modal --------------------------- */
interface TranslationModalProps {
  open: boolean;
  title: string;
  translations: Record<string, string>;
  onChange: (lang: string, html: string) => void;
  onClose: () => void;
}

const TranslationModal = ({ open, title, translations, onChange, onClose }: TranslationModalProps) => {
  const [activeLang, setActiveLang] = useState(languages[0]);
  if (!open) return null;

  const translateAll = () => {
    // Placeholder: in real impl would call translation API.
    const source = translations[languages[0]] || "";
    languages.slice(1).forEach(l => {
      if (!translations[l]) onChange(l, source);
    });
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
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              className={`px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
                activeLang === l ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <label className={labelCls}>Content ({activeLang})</label>
          <RichTextEditor
            value={translations[activeLang] || ""}
            onChange={(html) => onChange(activeLang, html)}
            minHeight={200}
          />
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Done</button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Edit Form ------------------------------- */
const PromoEditForm = ({ banner, onBack }: { banner?: any; onBack: () => void }) => {
  const [name, setName] = useState(banner?.name || "");
  const [template, setTemplate] = useState<TemplateType>(banner?.template || templateTypes[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [bannerText, setBannerText] = useState("<p>A name that focuses on personal growth and reflection that travel can inspire.</p>");
  const [buttonLabel, setButtonLabel] = useState("<p>Shop Now</p>");
  const [buttonAlign, setButtonAlign] = useState<"left" | "center" | "right">("left");
  const [bgColor, setBgColor] = useState("#f4f6fa");
  const [textBgColor, setTextBgColor] = useState("#ffffff");
  const [active, setActive] = useState(banner?.active ?? true);
  const [rank, setRank] = useState<number>(banner?.rank || 1);

  // Multi-selects
  const [selectedPages, setSelectedPages] = useState<string[]>(["Home"]);
  const [pageSearch, setPageSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["USA"]);
  const [regionSearch, setRegionSearch] = useState("");

  // Timing
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState<string[]>([]);

  // Translations
  const [textTranslations, setTextTranslations] = useState<Record<string, string>>({});
  const [labelTranslations, setLabelTranslations] = useState<Record<string, string>>({});
  const [translateTarget, setTranslateTarget] = useState<null | "text" | "label">(null);

  // Errors
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Banner Name is required";
    if (!imageUrl.trim()) e.imageUrl = "Image URL is required";
    else {
      try { new URL(imageUrl); } catch { e.imageUrl = "Enter a valid URL"; }
    }
    if (selectedPages.length === 0) e.pages = "At least one Display Page is required";
    if (selectedRegions.length === 0) e.regions = "At least one Region is required";
    if (startDate && endDate) {
      const s = new Date(`${startDate}T${startTime || "00:00"}`);
      const en = new Date(`${endDate}T${endTime || "23:59"}`);
      if (en < s) e.date = "End Date/Time cannot be earlier than Start Date/Time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onBack(); };

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
            <h1 className="page-title">{banner ? "Edit Promotional Banner" : "New Promotional Banner"}</h1>
            <p className="page-subtitle">Configure banner content, targeting, and schedule</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* -------------------- FORM COLUMNS -------------------- */}
        <div className="xl:col-span-2 space-y-4">
          {/* Banner Information */}
          <div className="admin-card">
            <h3 className="font-heading font-semibold text-foreground mb-4">Banner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Banner Name <span className="text-destructive">*</span></label>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Rank</label>
                <input className={inputCls} type="number" min={1} value={rank} onChange={(e) => setRank(Number(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Template Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templateTypes.map(t => (
                    <label
                      key={t}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                        template === t ? "border-primary bg-primary/5 text-primary" : "border-input hover:bg-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        className="accent-primary"
                        checked={template === t}
                        onChange={() => setTemplate(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Image URL <span className="text-destructive">*</span></label>
                <input
                  className={inputCls}
                  placeholder="https://cdn.example.com/banner.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {errors.imageUrl && <p className="text-xs text-destructive mt-1">{errors.imageUrl}</p>}
              </div>
            </div>
          </div>

          {/* Banner Text */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground">Banner Text</h3>
            </div>
            <RichTextEditor
              value={bannerText}
              onChange={setBannerText}
              onTranslate={() => setTranslateTarget("text")}
              minHeight={180}
            />
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
          </div>

          {/* CTA */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground">CTA (Button)</h3>
              <span className="text-xs text-muted-foreground">Leave label empty to hide the button</span>
            </div>
            <label className={labelCls}>Button Label</label>
            <RichTextEditor
              value={buttonLabel}
              onChange={setButtonLabel}
              onTranslate={() => setTranslateTarget("label")}
              minHeight={120}
            />
            <div className="mt-4">
              <label className={labelCls}>Button Alignment</label>
              <div className="inline-flex rounded-lg border border-input overflow-hidden">
                {(["left", "center", "right"] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setButtonAlign(a)}
                    className={`px-4 py-2 text-sm capitalize transition-colors ${
                      buttonAlign === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    {a}
                  </button>
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
              <input
                className={`${inputCls} pl-9`}
                placeholder="Search pages..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredPages.map(p => {
                const on = selectedPages.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => toggle(selectedPages, setSelectedPages, p)}
                    className={`px-3 py-1.5 rounded-full text-xs border inline-flex items-center gap-1.5 transition-colors ${
                      on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
                    }`}
                  >
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
              <input
                className={`${inputCls} pl-9`}
                placeholder="Search regions..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredRegions.map(r => {
                const on = selectedRegions.includes(r.code);
                return (
                  <button
                    key={r.code}
                    onClick={() => toggle(selectedRegions, setSelectedRegions, r.code)}
                    className={`px-3 py-1.5 rounded-full text-xs border inline-flex items-center gap-1.5 transition-colors ${
                      on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
                    }`}
                  >
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
                    <button
                      key={d}
                      onClick={() => toggle(days, setDays, d)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        on ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="admin-card">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-primary" /> Active
            </label>
          </div>
        </div>

        {/* -------------------- LIVE PREVIEW -------------------- */}
        <div className="xl:col-span-1">
          <div className="admin-card sticky top-16">
            <h3 className="font-heading font-semibold text-foreground mb-3">Live Preview</h3>
            <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: bgColor }}>
              <div className={`flex flex-col ${template === "Image Left, Content Right" ? "md:flex-row-reverse" : "md:flex-row"}`}>
                <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                  ) : (
                    <span className="text-xs text-muted-foreground p-4">Image preview</span>
                  )}
                </div>
                <div className="md:w-1/2 p-5 flex flex-col justify-center gap-3" style={{ backgroundColor: textBgColor }}>
                  <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: bannerText }} />
                  {hasButton && (
                    <div
                      className="flex mt-2"
                      style={{ justifyContent: buttonAlign === "left" ? "flex-start" : buttonAlign === "right" ? "flex-end" : "center" }}
                    >
                      <button
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                        dangerouslySetInnerHTML={{ __html: buttonLabel }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Preview updates automatically as you edit.</p>
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
        onChange={(lang, html) => {
          if (lang === "English") setBannerText(html);
          else setTextTranslations(prev => ({ ...prev, [lang]: html }));
        }}
        onClose={() => setTranslateTarget(null)}
      />
      <TranslationModal
        open={translateTarget === "label"}
        title="Button Label"
        translations={{ English: buttonLabel, ...labelTranslations }}
        onChange={(lang, html) => {
          if (lang === "English") setButtonLabel(html);
          else setLabelTranslations(prev => ({ ...prev, [lang]: html }));
        }}
        onClose={() => setTranslateTarget(null)}
      />
    </div>
  );
};

export default PromoBannerPage;
