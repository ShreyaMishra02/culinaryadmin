import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";

const allProducts = Array.from({ length: 20 }, (_, i) => ({
  id: `PRD-${String(1000 + i).padStart(5, "0")}`,
  name: ["Craft Beer Bundle", "Espresso Gift Set", "Sushi Platter", "Steak Dinner", "Pizza Delivery", "Keto Meal Kit", "Gourmet Popcorn", "Organic Juice Pack", "Smoothie Box", "Trail Mix Gift"][i % 10] + (i >= 10 ? ` v${Math.floor(i / 10) + 1}` : ""),
}));

const countries = ["USA", "Canada", "UK", "Germany", "France", "Australia", "India", "China", "Japan", "Brazil"];
const states = ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Oregon", "Nevada", "Arizona", "Colorado"];

const PopularProductsPage = () => {
  const [selected, setSelected] = useState<typeof allProducts>([allProducts[0], allProducts[2], allProducts[5]]);
  const [available, setAvailable] = useState(allProducts.filter(p => ![0, 2, 5].includes(allProducts.indexOf(p))));
  const [availableSelected, setAvailableSelected] = useState<string[]>([]);
  const [selectedSelected, setSelectedSelected] = useState<string[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [excludedStates, setExcludedStates] = useState<string[]>([]);
  const [applyLocationRules, setApplyLocationRules] = useState(false);

  const addToSelected = () => {
    const toAdd = available.filter(p => availableSelected.includes(p.id));
    setSelected([...selected, ...toAdd]);
    setAvailable(available.filter(p => !availableSelected.includes(p.id)));
    setAvailableSelected([]);
  };

  const removeFromSelected = () => {
    const toRemove = selected.filter(p => selectedSelected.includes(p.id));
    setAvailable([...available, ...toRemove]);
    setSelected(selected.filter(p => !selectedSelected.includes(p.id)));
    setSelectedSelected([]);
  };

  const moveUp = () => {
    if (selectedSelected.length !== 1) return;
    const idx = selected.findIndex(p => p.id === selectedSelected[0]);
    if (idx <= 0) return;
    const copy = [...selected];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    setSelected(copy);
  };

  const moveDown = () => {
    if (selectedSelected.length !== 1) return;
    const idx = selected.findIndex(p => p.id === selectedSelected[0]);
    if (idx >= selected.length - 1) return;
    const copy = [...selected];
    [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
    setSelected(copy);
  };

  const toggleItem = (id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Popular Products</h1>
        <p className="page-subtitle">Manage featured popular product listings</p>
      </div>

      {/* Dual List */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 mb-6">
        {/* Available */}
        <div className="admin-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30"><h3 className="text-sm font-semibold text-foreground">Available Products</h3></div>
          <div className="max-h-[400px] overflow-y-auto">
            {available.map(p => (
              <button key={p.id} onClick={() => toggleItem(p.id, availableSelected, setAvailableSelected)}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-border/50 transition-colors ${availableSelected.includes(p.id) ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}>
                <span className="font-mono text-xs text-muted-foreground mr-2">{p.id}</span>{p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex lg:flex-col items-center justify-center gap-2 py-4">
          <button onClick={addToSelected} disabled={!availableSelected.length} className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-30 transition-colors" title="Add">
            <ChevronRight size={18} />
          </button>
          <button onClick={removeFromSelected} disabled={!selectedSelected.length} className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-30 transition-colors" title="Remove">
            <ChevronLeft size={18} />
          </button>
          <button onClick={moveUp} disabled={selectedSelected.length !== 1} className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-30 transition-colors" title="Up">
            <ChevronUp size={18} />
          </button>
          <button onClick={moveDown} disabled={selectedSelected.length !== 1} className="p-2 rounded-lg border border-input hover:bg-accent disabled:opacity-30 transition-colors" title="Down">
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Selected */}
        <div className="admin-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30"><h3 className="text-sm font-semibold text-foreground">Selected Popular Products</h3></div>
          <div className="max-h-[400px] overflow-y-auto">
            {selected.map((p, i) => (
              <button key={p.id} onClick={() => toggleItem(p.id, selectedSelected, setSelectedSelected)}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-border/50 transition-colors ${selectedSelected.includes(p.id) ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}>
                <span className="text-xs text-muted-foreground mr-2">#{i + 1}</span>
                <span className="font-mono text-xs text-muted-foreground mr-2">{p.id}</span>{p.name}
              </button>
            ))}
            {!selected.length && <p className="p-4 text-sm text-muted-foreground text-center">No products selected</p>}
          </div>
        </div>
      </div>

      {/* Location Exclusion */}
      <div className="admin-card mb-4">
        <h3 className="font-heading font-semibold text-foreground mb-4">Location Exclusion — Not Available In</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <div className="flex flex-wrap gap-2">
              {countries.map(c => (
                <button key={c} onClick={() => toggleItem(c, excludedCountries, setExcludedCountries)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${excludedCountries.includes(c) ? "bg-destructive text-destructive-foreground border-destructive" : "border-input hover:bg-accent"}`}>
                  {excludedCountries.includes(c) ? "☑" : "☐"} {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">State</label>
            <div className="flex flex-wrap gap-2">
              {states.map(s => (
                <button key={s} onClick={() => toggleItem(s, excludedStates, setExcludedStates)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${excludedStates.includes(s) ? "bg-destructive text-destructive-foreground border-destructive" : "border-input hover:bg-accent"}`}>
                  {excludedStates.includes(s) ? "☑" : "☐"} {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm mt-4">
          <input type="checkbox" checked={applyLocationRules} onChange={() => setApplyLocationRules(!applyLocationRules)} className="accent-primary" />
          Apply Product Location Rules
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save</button>
      </div>
    </div>
  );
};

export default PopularProductsPage;
