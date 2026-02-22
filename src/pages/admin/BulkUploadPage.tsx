import { useState } from "react";
import { Upload, Pencil, AlertTriangle, CheckCircle2 } from "lucide-react";
import ProductDetailPage from "./ProductDetailPage";

const mockUploaded = [
  { id: "PRD-01000", name: "Craft Beer Bundle", status: "success", errors: "" },
  { id: "PRD-01001", name: "Espresso Gift Set", status: "success", errors: "" },
  { id: "PRD-01002", name: "Sushi Platter", status: "error", errors: "Missing image URL, Invalid category" },
  { id: "PRD-01003", name: "Steak Dinner", status: "warning", errors: "Margin % exceeds threshold" },
  { id: "PRD-01004", name: "Pizza Delivery", status: "success", errors: "" },
];

const BulkUploadPage = () => {
  const [uploaded, setUploaded] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  if (editingProduct) {
    const prod = mockUploaded.find(p => p.id === editingProduct);
    return <ProductDetailPage product={prod ? { id: prod.id, name: prod.name } : undefined} onBack={() => setEditingProduct(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Bulk Upload</h1>
        <p className="page-subtitle">Import products and data in bulk via Excel file</p>
      </div>

      {/* Upload Section */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Upload Excel File</h3>
        <div className="flex items-center gap-4">
          <label className="flex-1 border-2 border-dashed border-input rounded-lg p-8 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
            <Upload size={24} className="mx-auto mb-2 text-muted-foreground/60" />
            <span>Drag & drop an Excel file or click to browse</span>
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={() => setUploaded(true)} />
          </label>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setUploaded(true)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <span className="flex items-center gap-2"><Upload size={14} /> Upload</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Supported: .xlsx, .xls, .csv — System maps by Product ID automatically.</p>
        <p className="text-xs text-muted-foreground">Fields mapped: Images, Description, Keywords, Flags, Active, Alerts, Delivery Info, Purchase Acknowledgement, and more.</p>
      </div>

      {/* Results Grid */}
      {uploaded && (
        <div className="admin-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading font-semibold text-foreground">Upload Results</h3>
            <p className="text-xs text-muted-foreground">5 products processed — 3 success, 1 warning, 1 error</p>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr><th>Product ID</th><th>Product Name</th><th>Status</th><th>Errors</th><th>Action</th></tr>
              </thead>
              <tbody>
                {mockUploaded.map(p => (
                  <tr key={p.id}>
                    <td><span className="font-mono text-xs text-muted-foreground">{p.id}</span></td>
                    <td className="font-medium text-foreground">{p.name}</td>
                    <td>
                      {p.status === "success" && <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={13} /> Success</span>}
                      {p.status === "error" && <span className="inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle size={13} /> Error</span>}
                      {p.status === "warning" && <span className="inline-flex items-center gap-1 text-xs text-warning"><AlertTriangle size={13} /> Warning</span>}
                    </td>
                    <td className="text-xs text-muted-foreground max-w-[200px] truncate">{p.errors || "—"}</td>
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
        </div>
      )}
    </div>
  );
};

export default BulkUploadPage;
