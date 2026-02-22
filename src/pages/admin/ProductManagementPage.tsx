import { useState } from "react";
import { Search, RotateCcw, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ProductDetailPage from "./ProductDetailPage";

const categories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const subcategoriesMap: Record<string, string[]> = {
  Beverages: ["Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies"],
  Restaurants: ["Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences"],
  "Order In": ["Food Delivery"],
  "Meal Kits": ["Premium Items", "Meal Kit"],
  Goodies: ["Snacks", "Treats", "Edible Gifts"],
  Grocery: [],
};
const flagOptions = ["Best Seller", "Featured", "New Product", "Discount Available", "Great Deal"];

const mockProducts = Array.from({ length: 50 }, (_, i) => {
  const cat = categories[i % categories.length];
  const subs = subcategoriesMap[cat];
  return {
    id: `PRD-${String(1000 + i).padStart(5, "0")}`,
    name: ["Craft Beer Bundle", "Espresso Gift Set", "Sushi Platter", "Steak Dinner", "Pizza Delivery", "Keto Meal Kit", "Gourmet Popcorn", "Organic Juice Pack", "Smoothie Box", "Trail Mix Gift"][i % 10] + (i >= 10 ? ` v${Math.floor(i / 10) + 1}` : ""),
    category: cat,
    subcategory: subs.length ? subs[i % subs.length] : "—",
    active: i % 4 !== 0,
    dataSource: i % 3 === 0 ? "Viator" : "PeopleSoft",
    flags: [flagOptions[i % 5]],
  };
});

const ProductManagementPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [flagFilter, setFlagFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);

  if (editingProduct) {
    const product = products.find(p => p.id === editingProduct);
    return <ProductDetailPage product={product} onBack={() => setEditingProduct(null)} />;
  }

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (subcategory && p.subcategory !== subcategory) return false;
    if (status === "active" && !p.active) return false;
    if (status === "inactive" && p.active) return false;
    if (dataSource && p.dataSource !== dataSource) return false;
    if (flagFilter && !p.flags.includes(flagFilter)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const currentSubs = category ? (subcategoriesMap[category] || []) : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">Central control panel for all products</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Product ID / Name / Keyword" className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Subcategories</option>
            {currentSubs.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={dataSource} onChange={(e) => setDataSource(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Data Sources</option>
            <option>PeopleSoft</option>
            <option>Viator</option>
          </select>
          <select value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Flags</option>
            {flagOptions.map(f => <option key={f}>{f}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="Display From" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="Display To" />
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Search size={14} /> Search</button>
          <button onClick={() => { setSearch(""); setCategory(""); setSubcategory(""); setStatus(""); setDataSource(""); setFlagFilter(""); setDateFrom(""); setDateTo(""); }} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"><RotateCcw size={14} /> Reset</button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr><th>Product ID</th><th>Product Name</th><th>Category</th><th>Subcategory</th><th>Active</th><th>Action</th></tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td><span className="font-mono text-xs text-muted-foreground">{p.id}</span></td>
                  <td className="font-medium text-foreground">{p.name}</td>
                  <td className="text-muted-foreground">{p.category}</td>
                  <td className="text-muted-foreground">{p.subcategory}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={() => setProducts(products.map(prod => prod.id === p.id ? { ...prod, active: !prod.active } : prod))}
                      className="accent-primary w-4 h-4"
                    />
                  </td>
                  <td>
                    <button onClick={() => setEditingProduct(p.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-primary hover:bg-accent transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="px-2 py-1 rounded border border-input bg-background text-xs">
              {[10, 25, 50, 100, 250].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ml-2">{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          </div>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded hover:bg-muted disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded hover:bg-muted disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementPage;
