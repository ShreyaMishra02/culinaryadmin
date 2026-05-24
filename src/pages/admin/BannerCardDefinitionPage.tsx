import { useState, useMemo } from "react";
import { Search, Copy, ExternalLink, Check, Image as ImageIcon, Tag, FolderTree, Layers, Package } from "lucide-react";

const mockBanners = [
  { id: 1, name: "Spring Promo", active: true },
  { id: 2, name: "Holiday Deal", active: true },
  { id: 3, name: "Wine Collection Banner", active: false },
  { id: 4, name: "Welcome Banner", active: true },
];

const popularKeywords = ["Wine", "Organic", "Cheese", "Coffee", "Snacks"];
const mockCategories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const mockSubcategories = ["Red Wine", "Coffee & Tea", "Chocolates", "Bakery", "Fast Food", "Snacks"];
const mockProducts = [
  { id: 12345, name: "Premium Red Wine", sku: "WN-001", category: "Beverages", price: "$45.00", active: true },
  { id: 12346, name: "Organic Coffee Beans", sku: "CF-014", category: "Beverages", price: "$22.00", active: true },
  { id: 12347, name: "Artisan Cheese Box", sku: "CH-302", category: "Goodies", price: "$38.00", active: true },
  { id: 12348, name: "Gourmet Chocolate Set", sku: "CO-198", category: "Goodies", price: "$28.00", active: false },
  { id: 12349, name: "Fresh Bakery Bundle", sku: "BK-077", category: "Grocery", price: "$18.00", active: true },
  { id: 12350, name: "Sparkling Mocktail Pack", sku: "BV-455", category: "Beverages", price: "$15.00", active: true },
];

type ConfigType = "keyword" | "category" | "subcategory" | "product";

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";

const BannerCardDefinitionPage = () => {
  const [bannerQuery, setBannerQuery] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<typeof mockBanners[0] | null>(null);
  const [configType, setConfigType] = useState<ConfigType>("keyword");
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredBanners = mockBanners.filter(b => b.name.toLowerCase().includes(bannerQuery.toLowerCase()));
  const filteredProducts = useMemo(() =>
    mockProducts.filter(p =>
      p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productQuery.toLowerCase())
    ), [productQuery]);

  const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

  const generatedUrl = useMemo(() => {
    if (configType === "keyword" && keyword) return `/marketplace/search?keyword=${encodeURIComponent(keyword.toLowerCase())}`;
    if (configType === "category" && selectedCategory) return `/marketplace/category/${slug(selectedCategory)}`;
    if (configType === "subcategory" && selectedSubcategory) return `/marketplace/subcategory/${slug(selectedSubcategory)}`;
    if (configType === "product" && selectedProductIds.length > 0) return `/product/${selectedProductIds[0]}`;
    return "";
  }, [configType, keyword, selectedCategory, selectedSubcategory, selectedProductIds]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggleProduct = (id: number) =>
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const configTabs: { id: ConfigType; label: string; icon: any }[] = [
    { id: "keyword", label: "Search Keyword", icon: Tag },
    { id: "category", label: "Category", icon: FolderTree },
    { id: "subcategory", label: "Subcategory", icon: Layers },
    { id: "product", label: "Product", icon: Package },
  ];

  const showProductGrid = configType === "category" || configType === "subcategory" || configType === "product";

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Banner Card Definition</h1>
        <p className="page-subtitle">Configure banner click behavior and marketplace mappings</p>
      </div>

      {/* Step 1: Search Banner */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-3">Step 1 — Select Banner</h3>
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
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={16} />
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
                <button key={t.id} onClick={() => setConfigType(t.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    configType === t.id ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-primary/30 hover:bg-accent/40 text-foreground"
                  }`}>
                  <t.icon size={20} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration body */}
          <div className="admin-card mb-4">
            {configType === "keyword" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Search Keyword</h3>
                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter keyword e.g. Wine" className={inputCls} />
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-2">Popular keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {popularKeywords.map(k => (
                      <button key={k} onClick={() => setKeyword(k)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${keyword === k ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {configType === "category" && (
              <>
                <h3 className="font-heading font-semibold text-foreground mb-3">Select Category</h3>
                <div className="flex flex-wrap gap-2">
                  {mockCategories.map(c => (
                    <button key={c} onClick={() => setSelectedCategory(c)}
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
                    <button key={c} onClick={() => setSelectedSubcategory(c)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedSubcategory === c ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}

            {configType === "product" && (
              <h3 className="font-heading font-semibold text-foreground mb-3">Select Product(s)</h3>
            )}
          </div>

          {/* Product results */}
          {showProductGrid && (
            <div className="admin-card mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-foreground">
                  {configType === "product" ? "Products" : "Associated Products"}
                </h3>
                <div className="text-xs text-muted-foreground">{selectedProductIds.length} selected</div>
              </div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={productQuery} onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Search by name, SKU, or category" className={`${inputCls} pl-9`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map(p => {
                  const sel = selectedProductIds.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => toggleProduct(p.id)}
                      className={`text-left rounded-lg border transition-all overflow-hidden ${sel ? "border-primary ring-2 ring-primary/20" : "border-input hover:border-primary/30"}`}>
                      <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground relative">
                        <ImageIcon size={24} />
                        {sel && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm text-foreground truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">SKU: {p.sku}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{p.category}</span>
                          <span className="text-sm font-semibold text-foreground">{p.price}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${p.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-success" : "bg-muted-foreground/50"}`} />
                            {p.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">No products found</div>
              )}
              <div className="flex justify-center mt-4">
                <button className="px-4 py-2 text-xs border border-input rounded-lg text-muted-foreground hover:bg-muted">Load more</button>
              </div>
            </div>
          )}

          {/* URL Preview */}
          <div className="admin-card mb-4">
            <h3 className="font-heading font-semibold text-foreground mb-3">Redirect URL Preview</h3>
            <div className="flex items-center gap-2">
              <input readOnly value={generatedUrl || "Configure above to generate URL"}
                className={`${inputCls} font-mono text-xs bg-muted/50`} />
              <button onClick={handleCopy} disabled={!generatedUrl}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed">
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button disabled={!generatedUrl}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                <ExternalLink size={14} /> Preview
              </button>
            </div>
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
