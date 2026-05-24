import { useState, useMemo } from "react";
import { Search, Image as ImageIcon, Tag, FolderTree, Layers, Package, ChevronUp, ChevronDown } from "lucide-react";

const mockBanners = [
  { id: 1, name: "Spring Promo", active: true },
  { id: 2, name: "Holiday Deal", active: true },
  { id: 3, name: "Wine Collection Banner", active: false },
  { id: 4, name: "Welcome Banner", active: true },
];

const mockCategories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const mockSubcategories = ["Red Wine", "Coffee & Tea", "Chocolates", "Bakery", "Fast Food", "Snacks"];

const mockProducts = [
  { id: 12345, sku: "WN-001", name: "Premium Red Wine", category: "Beverages", subcategory: "Red Wine" },
  { id: 12346, sku: "CF-014", name: "Organic Coffee Beans", category: "Beverages", subcategory: "Coffee & Tea" },
  { id: 12347, sku: "CH-302", name: "Artisan Cheese Box", category: "Goodies", subcategory: "Snacks" },
  { id: 12348, sku: "CO-198", name: "Gourmet Chocolate Set", category: "Goodies", subcategory: "Chocolates" },
  { id: 12349, sku: "BK-077", name: "Fresh Bakery Bundle", category: "Grocery", subcategory: "Bakery" },
  { id: 12350, sku: "BV-455", name: "Sparkling Mocktail Pack", category: "Beverages", subcategory: "Red Wine" },
  { id: 12351, sku: "WN-002", name: "Reserve Cabernet", category: "Beverages", subcategory: "Red Wine" },
  { id: 12352, sku: "SN-110", name: "Organic Trail Mix", category: "Goodies", subcategory: "Snacks" },
  { id: 12353, sku: "FF-220", name: "Fast Food Combo", category: "Restaurants", subcategory: "Fast Food" },
  { id: 12354, sku: "CO-205", name: "Dark Chocolate Truffles", category: "Goodies", subcategory: "Chocolates" },
  { id: 12355, sku: "BK-080", name: "Sourdough Loaf", category: "Grocery", subcategory: "Bakery" },
  { id: 12356, sku: "CF-018", name: "Cold Brew Concentrate", category: "Beverages", subcategory: "Coffee & Tea" },
];

type ConfigType = "keyword" | "category" | "subcategory" | "product";
type SortKey = "id" | "name" | "category" | "subcategory";

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";

const BannerCardDefinitionPage = () => {
  const [bannerQuery, setBannerQuery] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<typeof mockBanners[0] | null>(null);
  const [configType, setConfigType] = useState<ConfigType>("keyword");
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tableSearch, setTableSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredBanners = mockBanners.filter(b => b.name.toLowerCase().includes(bannerQuery.toLowerCase()));

  const associated = useMemo(() => {
    let list: typeof mockProducts = [];
    if (configType === "keyword" && keyword.trim()) {
      const k = keyword.toLowerCase();
      list = mockProducts.filter(p =>
        p.name.toLowerCase().includes(k) || p.category.toLowerCase().includes(k) || p.subcategory.toLowerCase().includes(k)
      );
    } else if (configType === "category" && selectedCategory) {
      list = mockProducts.filter(p => p.category === selectedCategory);
    } else if (configType === "subcategory" && selectedSubcategory) {
      list = mockProducts.filter(p => p.subcategory === selectedSubcategory);
    } else if (configType === "product" && productSearch.trim()) {
      const k = productSearch.toLowerCase();
      list = mockProducts.filter(p =>
        p.name.toLowerCase().includes(k) || p.sku.toLowerCase().includes(k) || String(p.id).includes(k)
      );
    }
    return list;
  }, [configType, keyword, selectedCategory, selectedSubcategory, productSearch]);

  const tableFiltered = useMemo(() => {
    const k = tableSearch.toLowerCase();
    const list = k
      ? associated.filter(p =>
          p.name.toLowerCase().includes(k) || String(p.id).includes(k) ||
          p.category.toLowerCase().includes(k) || p.subcategory.toLowerCase().includes(k)
        )
      : associated;
    const sorted = [...list].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [associated, tableSearch, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(tableFiltered.length / pageSize));
  const pageItems = tableFiltered.slice((page - 1) * pageSize, page * pageSize);
  const allPageSelected = pageItems.length > 0 && pageItems.every(p => selectedIds.includes(p.id));

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };
  const toggleOne = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAllPage = () => {
    const ids = pageItems.map(p => p.id);
    setSelectedIds(prev => allPageSelected ? prev.filter(x => !ids.includes(x)) : Array.from(new Set([...prev, ...ids])));
  };

  const configTabs: { id: ConfigType; label: string; icon: any }[] = [
    { id: "keyword", label: "Search Keyword", icon: Tag },
    { id: "category", label: "Category", icon: FolderTree },
    { id: "subcategory", label: "Subcategory", icon: Layers },
    { id: "product", label: "Product", icon: Package },
  ];

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 font-medium text-foreground">
      {label}
      {sortKey === k ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronDown size={12} className="opacity-30" />}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Banner Card Definition</h1>
        <p className="page-subtitle">Map products to existing promotional banners</p>
      </div>

      {/* Step 1: Search Banner */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-3">Step 1 — Select Promotional Banner</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={bannerQuery}
            onChange={(e) => setBannerQuery(e.target.value)}
            placeholder="Search promotional banner"
            className={`${inputCls} pl-9`}
          />
        </div>
        {bannerQuery && !selectedBanner && (
          <div className="mt-3 border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
            {filteredBanners.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No banners found</div>
            ) : filteredBanners.map(b => (
              <button key={b.id} onClick={() => { setSelectedBanner(b); setBannerQuery(""); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-accent text-left transition-colors">
                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{b.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${b.active ? "bg-success" : "bg-muted-foreground/40"}`} />
                    <span className="text-xs text-muted-foreground">{b.active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        {selectedBanner && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-accent/40 rounded-lg border border-border">
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              <ImageIcon size={18} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-foreground">{selectedBanner.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${selectedBanner.active ? "bg-success" : "bg-muted-foreground/40"}`} />
                <span className="text-xs text-muted-foreground">{selectedBanner.active ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <button onClick={() => setSelectedBanner(null)} className="text-xs text-primary hover:underline">Change</button>
          </div>
        )}
      </div>

      {selectedBanner && (
        <>
          {/* Step 2: Config type */}
          <div className="admin-card mb-4">
            <h3 className="font-heading font-semibold text-foreground mb-3">Step 2 — Configuration Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {configTabs.map(t => (
                <button key={t.id} onClick={() => { setConfigType(t.id); setPage(1); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    configType === t.id ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/30 hover:bg-accent/40 text-foreground"
                  }`}>
                  <t.icon size={20} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input per config type */}
          <div className="admin-card mb-4">
            {configType === "keyword" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Search Keyword</h3>
                <input value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                  placeholder="Enter keyword e.g. Wine, Organic, Cheese" className={inputCls} />
              </>
            )}
            {configType === "category" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Select Category</h3>
                <div className="flex flex-wrap gap-2">
                  {mockCategories.map(c => (
                    <button key={c} onClick={() => { setSelectedCategory(c); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
            {configType === "subcategory" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Select Subcategory</h3>
                <div className="flex flex-wrap gap-2">
                  {mockSubcategories.map(c => (
                    <button key={c} onClick={() => { setSelectedSubcategory(c); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedSubcategory === c ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
            {configType === "product" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Search Product</h3>
                <input value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Product Name, Product ID, or SKU" className={inputCls} />
              </>
            )}
          </div>

          {/* Associated Products Table */}
          <div className="admin-card mb-4">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <h3 className="font-heading font-semibold text-foreground">Associated Products</h3>
              <div className="text-xs text-muted-foreground">{selectedIds.length} selected · {tableFiltered.length} results</div>
            </div>
            <div className="relative mb-4 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={tableSearch} onChange={(e) => { setTableSearch(e.target.value); setPage(1); }}
                placeholder="Search within results" className={`${inputCls} pl-9`} />
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="max-h-[480px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 sticky top-0 z-10">
                    <tr className="text-left">
                      <th className="px-3 py-2 w-10">
                        <input type="checkbox" checked={allPageSelected} onChange={toggleAllPage} />
                      </th>
                      <th className="px-3 py-2"><SortHeader k="id" label="Product ID" /></th>
                      <th className="px-3 py-2"><SortHeader k="name" label="Product Name" /></th>
                      <th className="px-3 py-2"><SortHeader k="category" label="Category" /></th>
                      <th className="px-3 py-2"><SortHeader k="subcategory" label="Subcategory" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pageItems.length === 0 ? (
                      <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">No products to display. Refine your selection above.</td></tr>
                    ) : pageItems.map(p => (
                      <tr key={p.id} className="hover:bg-accent/40">
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleOne(p.id)} />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.id}</td>
                        <td className="px-3 py-2 text-foreground">{p.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{p.category}</td>
                        <td className="px-3 py-2 text-muted-foreground">{p.subcategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {tableFiltered.length > 0 && (
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-muted-foreground">Page {page} of {totalPages}</div>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-input rounded-lg hover:bg-accent disabled:opacity-50">Previous</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs border border-input rounded-lg hover:bg-accent disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save Mapping</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCardDefinitionPage;
