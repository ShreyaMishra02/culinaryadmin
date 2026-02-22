import { useState } from "react";
import { Search, RotateCcw, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ProductDetailPage from "./ProductDetailPage";

const mockProducts = Array.from({ length: 25 }, (_, i) => ({
  id: `PRD-${String(1000 + i).padStart(5, "0")}`,
  name: ["Wireless Mouse", "Bluetooth Speaker", "USB-C Hub", "Smart Watch", "Laptop Stand", "Mechanical Keyboard", "Monitor Light", "Webcam Pro", "Desk Mat", "Power Bank"][i % 10] + (i >= 10 ? ` v${Math.floor(i / 10) + 1}` : ""),
  category: ["Electronics", "Accessories", "Computing", "Wearables", "Office"][i % 5],
  subcategory: ["Peripherals", "Audio", "Adapters", "Watches", "Furniture"][i % 5],
  active: i % 4 !== 0,
}));

const ProductManagementPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
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
    if (status === "active" && !p.active) return false;
    if (status === "inactive" && p.active) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Product ID / Name / Keyword" className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Categories</option>
            <option>Electronics</option><option>Accessories</option><option>Computing</option><option>Wearables</option><option>Office</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Search size={14} /> Search</button>
            <button onClick={() => { setSearch(""); setCategory(""); setStatus(""); }} className="flex items-center justify-center gap-1.5 px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"><RotateCcw size={14} /></button>
          </div>
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
                    <button
                      onClick={() => setProducts(products.map(prod => prod.id === p.id ? { ...prod, active: !prod.active } : prod))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${p.active ? "bg-success" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${p.active ? "left-5" : "left-0.5"}`} />
                    </button>
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
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
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
