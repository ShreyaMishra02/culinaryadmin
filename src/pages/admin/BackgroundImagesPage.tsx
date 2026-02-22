import { useState } from "react";
import { Plus, Trash2, Eye, ImageIcon } from "lucide-react";

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const pageOptions = ["Home", "Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery", "Checkout", "Login"];

const sampleImages = [
  { id: 1, page: "Home", url: "https://scene7.example.com/home-bg.jpg", active: true },
  { id: 2, page: "Beverages", url: "https://scene7.example.com/beverages-bg.jpg", active: true },
  { id: 3, page: "Checkout", url: "https://scene7.example.com/checkout-bg.jpg", active: false },
];

const BackgroundImagesPage = () => {
  const [images, setImages] = useState(sampleImages);
  const [editing, setEditing] = useState<typeof sampleImages[0] | null>(null);
  const [adding, setAdding] = useState(false);

  const toggleActive = (id: number) => setImages(prev => prev.map(img => img.id === id ? { ...img, active: !img.active } : img));
  const removeImage = (id: number) => setImages(prev => prev.filter(img => img.id !== id));

  if (editing || adding) {
    return (
      <ImageEditForm
        image={editing}
        onBack={() => { setEditing(null); setAdding(false); }}
        onSave={(img) => {
          if (editing) {
            setImages(prev => prev.map(i => i.id === editing.id ? { ...editing, ...img } : i));
          } else {
            setImages(prev => [...prev, { ...img, id: Date.now() }]);
          }
          setEditing(null);
          setAdding(false);
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Background Images</h1>
          <p className="page-subtitle">Manage site background imagery by page</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={14} /> New Image
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page Name</th>
              <th>Scene7 URL</th>
              <th>Preview</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td className="font-medium">{img.page}</td>
                <td className="text-xs text-muted-foreground max-w-[200px] truncate">{img.url}</td>
                <td>
                  <div className="w-16 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                    <ImageIcon size={16} className="text-muted-foreground/50" />
                  </div>
                </td>
                <td>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={img.active} onChange={() => toggleActive(img.id)} className="accent-primary w-4 h-4" />
                  </label>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(img)} className="text-xs text-primary hover:underline">Edit</button>
                    <button onClick={() => removeImage(img.id)} className="text-xs text-destructive hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ImageEditForm = ({ image, onBack, onSave }: { image: any; onBack: () => void; onSave: (data: any) => void }) => {
  const [page, setPage] = useState(image?.page || "");
  const [url, setUrl] = useState(image?.url || "");
  const [active, setActive] = useState(image?.active ?? true);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
          ← Back to Background Images
        </button>
        <h1 className="page-title">{image ? "Edit Background Image" : "New Background Image"}</h1>
      </div>

      <div className="admin-card space-y-4">
        <div>
          <label className={labelCls}>Page Name</label>
          <select className={inputCls} value={page} onChange={e => setPage(e.target.value)}>
            <option value="">Select page...</option>
            {pageOptions.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Scene7 URL</label>
          <input className={inputCls} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://scene7.example.com/..." />
        </div>

        <div>
          <label className={labelCls}>Upload Image</label>
          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
            Drag & drop an image or click to browse
          </div>
        </div>

        <div>
          <label className={labelCls}>Preview</label>
          <div className="w-full h-40 rounded-lg bg-muted flex items-center justify-center">
            {url ? (
              <img src={url} alt="Preview" className="max-h-full max-w-full object-contain rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <span className="text-muted-foreground text-sm flex items-center gap-2"><Eye size={16} /> No image to preview</span>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="accent-primary w-4 h-4" />
          Active
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onBack} className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button onClick={() => onSave({ page, url, active })} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

export default BackgroundImagesPage;
