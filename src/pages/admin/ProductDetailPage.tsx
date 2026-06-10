import { useMemo, useState } from "react";
import { ArrowLeft, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ---- Excel-aligned field definitions ----
type FieldType = "text" | "textarea" | "select" | "checkbox" | "radio" | "richtext";
type Field = {
  name: string;
  type: FieldType;
  source: "Psoft API" | "Ontra Upload" | "Backend";
  options?: string[];
  colSpan?: 1 | 2;
  showWhen?: () => boolean;
};

const categories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const subcategories = [
  "Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies",
  "Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences",
  "Food Delivery", "Premium Items", "Meal Kit", "Snacks", "Treats", "Edible Gifts",
];
const categoryGroups = ["Wine", "Omaha Steaks", "Starbucks", "Coffee Roasters", "Premium Meals"];

const locationOptionsByLevel: Record<string, string[]> = {
  Country: ["United States", "Canada", "India", "China", "United Kingdom", "Mexico", "Germany", "France", "Japan", "Australia"],
  "State / Province": ["Alabama", "Arkansas", "Delaware", "Kentucky", "Massachusetts", "Mississippi", "Montana", "Oklahoma", "Rhode Island", "South Dakota", "Utah", "Vermont", "California", "New York", "Texas"],
  City: ["Toronto", "Vancouver", "Mumbai", "Delhi", "New York", "Los Angeles", "Chicago", "Houston", "London", "Paris"],
  "Postal Code": ["10001", "90210", "60601", "M5V 3A8", "V6B 1A1", "400001", "110001", "SW1A 1AA"],
};

const staticTabs: { label: string; fields: Field[] }[] = [
  {
    label: "Product Information",
    fields: [
      { name: "Status", type: "select", source: "Psoft API", options: ["Active", "Inactive"] },
      { name: "Product ID", type: "text", source: "Psoft API" },
      { name: "Product Display Name", type: "text", source: "Ontra Upload" },
      { name: "Brand", type: "text", source: "Psoft API" },
      { name: "Category Group", type: "text", source: "Ontra Upload" },
      { name: "Category", type: "select", source: "Ontra Upload", options: categories },
      { name: "SubCategory", type: "select", source: "Ontra Upload", options: subcategories },
      { name: "Category Group Anchor Product", type: "text", source: "Ontra Upload" },
      { name: "Product Role", type: "radio", source: "Ontra Upload", options: ["Primary", "Add On"] },
      { name: "Shipped Item?", type: "select", source: "Ontra Upload", options: ["TRUE", "FALSE"] },
      { name: "Search Keywords", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Overview Description", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Ingredients", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Preparation & Handling", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Delivery, Shipping Information", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Purchase Acknowledgement", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Signature Required", type: "checkbox", source: "Ontra Upload" },
      { name: "Terms & Conditions", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Product Page Layout", type: "radio", source: "Ontra Upload", options: ["Standalone", "Compact", "Expanded"] },
    ],
  },
  {
    label: "Product Images",
    fields: [
      { name: "Image URL 1", type: "text", source: "Ontra Upload" },
      { name: "Image alt text 1", type: "text", source: "Ontra Upload" },
      { name: "Image URL 2", type: "text", source: "Ontra Upload" },
      { name: "Image alt text 2", type: "text", source: "Ontra Upload" },
      { name: "Image URL 3", type: "text", source: "Ontra Upload" },
      { name: "Image alt text 3", type: "text", source: "Ontra Upload" },
      { name: "Image URL 4", type: "text", source: "Ontra Upload" },
      { name: "Image alt text 4", type: "text", source: "Ontra Upload" },
      { name: "Image URL 5", type: "text", source: "Ontra Upload" },
      { name: "Image alt text 5", type: "text", source: "Ontra Upload" },
    ],
  },
];

const trailingTabs: { label: string; fields: Field[] }[] = [
  {
    label: "Flags",
    fields: [
      { name: "Best Seller", type: "checkbox", source: "Ontra Upload" },
      { name: "Discount Available", type: "checkbox", source: "Ontra Upload" },
      { name: "Featured", type: "checkbox", source: "Ontra Upload" },
      { name: "Great Deals", type: "checkbox", source: "Ontra Upload" },
      { name: "New Product", type: "checkbox", source: "Ontra Upload" },
      { name: "Popular Product", type: "checkbox", source: "Ontra Upload" },
      { name: "You May Like", type: "checkbox", source: "Ontra Upload" },
    ],
  },
  {
    label: "Supplier Details",
    fields: [
      { name: "Supplier Name", type: "text", source: "Ontra Upload" },
      { name: "Supplier Support Email", type: "text", source: "Ontra Upload" },
      { name: "Supplier Support Phone", type: "text", source: "Ontra Upload" },
      { name: "Suppliers Consumer URL", type: "text", source: "Ontra Upload" },
      { name: "UPC Code", type: "text", source: "Psoft API" },
      { name: "Model Number", type: "text", source: "Psoft API" },
    ],
  },
  {
    label: "Buyer & Customer Service",
    fields: [
      { name: "PrimaryBuyer", type: "text", source: "Psoft API" },
      { name: "Customer Service Team", type: "text", source: "Ontra Upload" },
      { name: "Customer Service Contact Email", type: "text", source: "Ontra Upload" },
    ],
  },
  {
    label: "Pricing & Catalogs",
    fields: [
      { name: "Additional Cost-1", type: "text", source: "Psoft API" },
      { name: "Catalog", type: "text", source: "Psoft API" },
      { name: "Category 2", type: "text", source: "Psoft API" },
      { name: "Category 3", type: "text", source: "Psoft API" },
      { name: "Category 4", type: "text", source: "Psoft API" },
      { name: "Denomination", type: "text", source: "Psoft API" },
      { name: "Drop Ship Fee-1", type: "text", source: "Psoft API" },
      { name: "Freight Amount-1", type: "text", source: "Psoft API" },
      { name: "GL Product", type: "text", source: "Psoft API" },
      { name: "List Price", type: "text", source: "Psoft API" },
      { name: "Set ID", type: "text", source: "Psoft API" },
      { name: "Tax Amount-1", type: "text", source: "Psoft API" },
    ],
  },
  {
    label: "Psoft Data",
    fields: [
      { name: "Additional Information", type: "textarea", source: "Psoft API", colSpan: 2 },
      { name: "City", type: "text", source: "Psoft API" },
      { name: "Country", type: "text", source: "Psoft API" },
      { name: "Country Code-1", type: "text", source: "Psoft API" },
      { name: "CountryOrigin", type: "text", source: "Psoft API" },
      { name: "Currency_CD", type: "text", source: "Psoft API" },
      { name: "CurrentStatus", type: "text", source: "Psoft API" },
      { name: "Item ID", type: "text", source: "Psoft API" },
      { name: "Item Type", type: "text", source: "Psoft API" },
      { name: "Item-Group", type: "text", source: "Psoft API" },
      { name: "Location_ID", type: "text", source: "Psoft API" },
      { name: "Primary Description", type: "textarea", source: "Psoft API", colSpan: 2 },
      { name: "Primary Name", type: "text", source: "Psoft API" },
      { name: "Product Id Description", type: "textarea", source: "Psoft API", colSpan: 2 },
      { name: "Product Size", type: "text", source: "Psoft API" },
      { name: "Product Group", type: "text", source: "Psoft API" },
    ],
  },
];

const inputBase =
  "w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring";
const disabledCls = "bg-muted/60 text-muted-foreground cursor-not-allowed";

const SourceBadge = ({ source }: { source: Field["source"] }) => {
  const readOnly = source === "Psoft API";
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded ${
        readOnly ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      {source}
    </span>
  );
};

const FieldRenderer = ({ field }: { field: Field }) => {
  const readOnly = field.source === "Psoft API";
  const spanCls = field.colSpan === 2 ? "md:col-span-2" : "";

  return (
    <div className={spanCls}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-foreground">{field.name}</label>
        <SourceBadge source={field.source} />
      </div>

      {field.type === "text" && (
        <input type="text" disabled={readOnly} className={`${inputBase} ${readOnly ? disabledCls : ""}`} />
      )}
      {field.type === "textarea" && (
        <textarea disabled={readOnly} rows={3} className={`${inputBase} ${readOnly ? disabledCls : ""}`} />
      )}
      {field.type === "richtext" && (
        <div className="border border-input rounded-md overflow-hidden">
          <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-input bg-muted/40 text-xs">
            {["B", "I", "U", "• List", "1. List", "Link"].map((t) => (
              <button
                key={t}
                type="button"
                className="px-2 py-0.5 rounded hover:bg-background border border-transparent hover:border-input"
              >
                {t}
              </button>
            ))}
          </div>
          <textarea rows={4} className="w-full px-3 py-2 text-sm bg-background focus:outline-none" />
        </div>
      )}
      {field.type === "select" && (
        <select disabled={readOnly} className={`${inputBase} ${readOnly ? disabledCls : ""}`}>
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}
      {field.type === "checkbox" && (
        <label className="flex items-center gap-2 mt-1">
          <input type="checkbox" disabled={readOnly} className="w-4 h-4 rounded border-input" />
          <span className="text-sm text-muted-foreground">Enable</span>
        </label>
      )}
      {field.type === "radio" && (
        <div className="flex flex-wrap gap-4 mt-1">
          {field.options?.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm">
              <input type="radio" name={field.name} disabled={readOnly} className="w-4 h-4" />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Product Rules tab ----
const ProductRulesTab = () => {
  const [ruleTrigger, setRuleTrigger] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <FieldRenderer field={{ name: "Age Trigger", type: "checkbox", source: "Ontra Upload" }} />
      <FieldRenderer field={{ name: "India Tax Flag", type: "checkbox", source: "Backend" }} />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-foreground">Product Rule Trigger</label>
          <SourceBadge source="Ontra Upload" />
        </div>
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={ruleTrigger}
            onChange={(e) => setRuleTrigger(e.target.checked)}
            className="w-4 h-4 rounded border-input"
          />
          <span className="text-sm text-muted-foreground">Enable rule messaging</span>
        </label>
      </div>

      <div className="hidden md:block" />

      {ruleTrigger && (
        <FieldRenderer
          field={{ name: "Product Rule Description", type: "richtext", source: "Ontra Upload", colSpan: 2 }}
        />
      )}

      <FieldRenderer field={{ name: "Lead Days", type: "text", source: "Psoft API" }} />
      <FieldRenderer field={{ name: "Max Order Qty", type: "text", source: "Psoft API" }} />
      <FieldRenderer field={{ name: "Min Order Qty", type: "text", source: "Psoft API" }} />
      <FieldRenderer field={{ name: "Drop Ship Flag", type: "checkbox", source: "Psoft API" }} />
    </div>
  );
};

// ---- Location Restrictions tab ----
const subcategoriesByCategory: Record<string, string[]> = {
  Beverages: ["Wine", "Coffee & Tea", "Mocktails", "Soda", "Smoothies"],
  Restaurants: ["Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences"],
  "Order In": ["Food Delivery"],
  "Meal Kits": ["Premium Items", "Meal Kit"],
  Goodies: ["Snacks", "Treats", "Edible Gifts"],
  Grocery: [],
};

const productCatalog = [
  { id: "PRD-01001", name: "California Wine Collection", category: "Beverages", subcategory: "Wine" },
  { id: "PRD-01002", name: "Red Wine Gift Box", category: "Beverages", subcategory: "Wine" },
  { id: "PRD-01003", name: "White Wine Bundle", category: "Beverages", subcategory: "Wine" },
  { id: "PRD-01004", name: "Premium Wine Sampler", category: "Beverages", subcategory: "Wine" },
  { id: "PRD-01005", name: "Omaha Steaks Deluxe Package", category: "Meal Kits", subcategory: "Premium Items" },
  { id: "PRD-01006", name: "Espresso Gift Set", category: "Beverages", subcategory: "Coffee & Tea" },
  { id: "PRD-01007", name: "Keto Meal Kit", category: "Meal Kits", subcategory: "Meal Kit" },
  { id: "PRD-01008", name: "Gourmet Popcorn", category: "Goodies", subcategory: "Snacks" },
  { id: "PRD-01009", name: "Organic Juice Pack", category: "Beverages", subcategory: "Smoothies" },
  { id: "PRD-01010", name: "Trail Mix Gift", category: "Goodies", subcategory: "Edible Gifts" },
];

const countryMaster = ["United States", "Canada", "India", "Australia", "United Kingdom", "Mexico", "Germany", "France", "Japan", "China"];
const stateMaster: Record<string, string[]> = {
  "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Florida", "Georgia", "Hawaii", "Kansas", "Kentucky", "Maine", "Massachusetts", "Michigan", "Mississippi", "Montana", "New York", "Ohio", "Oklahoma", "Rhode Island", "South Dakota", "Texas", "Utah", "Vermont"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"],
  Australia: ["New South Wales", "Victoria", "Queensland"],
};
const cityMaster = ["Miami", "Toronto", "Mumbai", "London", "New York", "Los Angeles", "Chicago", "Houston", "Vancouver", "Delhi"];
const postalMaster = ["10001", "33101", "90210", "60601", "M5V 3A8", "400001", "110001", "SW1A 1AA"];

// Tag input: dropdown + manual entry → removable chips
const TagMultiSelect = ({
  label,
  options,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      options.filter(
        (o) => o.toLowerCase().includes(query.toLowerCase()) && !values.includes(o),
      ),
    [options, query, values],
  );

  const add = (v: string) => {
    const t = v.trim();
    if (!t || values.includes(t)) return;
    onChange([...values, t]);
    setQuery("");
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="border border-input rounded-md bg-background p-2">
        {values.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {values.map((v) => (
              <span key={v} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                {v}
                <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:bg-primary/20 rounded">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              e.preventDefault();
              add(query);
            }
          }}
          placeholder={placeholder || "Search or type and press Enter..."}
          className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none"
        />
        {open && query && filtered.length > 0 && (
          <div className="mt-2 max-h-40 overflow-y-auto border-t border-border pt-2">
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { add(opt); setOpen(false); }}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LocationGroup = ({
  title,
  countries, setCountries,
  states, setStates,
  cities, setCities,
  postals, setPostals,
  countryScope,
}: {
  title: string;
  countries: string[]; setCountries: (v: string[]) => void;
  states: string[]; setStates: (v: string[]) => void;
  cities: string[]; setCities: (v: string[]) => void;
  postals: string[]; setPostals: (v: string[]) => void;
  countryScope: string[];
}) => {
  const stateOpts = useMemo(() => {
    if (countryScope.length === 0) return Object.values(stateMaster).flat();
    return countryScope.flatMap((c) => stateMaster[c] || []);
  }, [countryScope]);

  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <TagMultiSelect label="Countries" options={countryMaster} values={countries} onChange={setCountries} />
        <TagMultiSelect label="States / Provinces" options={stateOpts} values={states} onChange={setStates} />
        <TagMultiSelect label="Cities" options={cityMaster} values={cities} onChange={setCities} />
        <TagMultiSelect label="Postal Codes (single, multiple, or ranges e.g. 10001-10050)" options={postalMaster} values={postals} onChange={setPostals} />
      </div>
    </div>
  );
};

const LocationRestrictionsTab = ({ product }: { product?: any }) => {
  const [appliesTo, setAppliesTo] = useState("This Product Only");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [targetSubcategory, setTargetSubcategory] = useState("");
  const [restrictionLevel, setRestrictionLevel] = useState("Country");

  const [availCountries, setAvailCountries] = useState<string[]>([]);
  const [availStates, setAvailStates] = useState<string[]>([]);
  const [availCities, setAvailCities] = useState<string[]>([]);
  const [availPostals, setAvailPostals] = useState<string[]>([]);

  const [exclCountries, setExclCountries] = useState<string[]>([]);
  const [exclStates, setExclStates] = useState<string[]>([]);
  const [exclCities, setExclCities] = useState<string[]>([]);
  const [exclPostals, setExclPostals] = useState<string[]>([]);

  const [active, setActive] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [availabilityType, setAvailabilityType] = useState<"everywhere" | "selected">("everywhere");
  const [restrictionBehavior, setRestrictionBehavior] = useState<"hide" | "warn" | "hide_warn">("hide");
  const showMessage = restrictionBehavior !== "hide";

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    if (!q) return productCatalog;
    return productCatalog.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q),
    );
  }, [productSearch]);

  const toggleProduct = (id: string) =>
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectedProductNames = selectedProducts
    .map((id) => productCatalog.find((p) => p.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Restriction Configuration */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Restriction Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Applies To</label>
              <select value={appliesTo} onChange={(e) => setAppliesTo(e.target.value)} className={inputBase}>
                <option>This Product Only</option>
                <option>Multiple Products</option>
                <option>Entire Category</option>
                <option>Entire Subcategory</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Restriction Level</label>
              <select value={restrictionLevel} onChange={(e) => setRestrictionLevel(e.target.value)} className={inputBase}>
                <option>Country</option>
                <option>State / Province</option>
                <option>City</option>
                <option>Postal Code</option>
              </select>
            </div>

            {/* Target Selection */}
            {appliesTo === "This Product Only" && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Target Selection</label>
                <input
                  type="text"
                  disabled
                  value={`${product?.id || "—"} — ${product?.name || "Current Product"}`}
                  className={`${inputBase} ${disabledCls}`}
                />
              </div>
            )}

            {appliesTo === "Entire Category" && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Target Category</label>
                <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)} className={inputBase}>
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}

            {appliesTo === "Entire Subcategory" && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
                  <select
                    value={targetCategory}
                    onChange={(e) => { setTargetCategory(e.target.value); setTargetSubcategory(""); }}
                    className={inputBase}
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Subcategory</label>
                  <select
                    value={targetSubcategory}
                    onChange={(e) => setTargetSubcategory(e.target.value)}
                    className={inputBase}
                    disabled={!targetCategory}
                  >
                    <option value="">Select subcategory...</option>
                    {(subcategoriesByCategory[targetCategory] || []).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}

            {appliesTo === "Multiple Products" && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Target Products</label>
                <div className="border border-input rounded-md bg-background p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search by Product ID, Name, Category, Subcategory..."
                      className="flex-1 px-2 py-1.5 text-sm border border-input rounded bg-background focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedProducts(filteredProducts.map((p) => p.id))}
                      className="text-xs px-2 py-1 border border-input rounded hover:bg-muted"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProducts([])}
                      className="text-xs px-2 py-1 border border-input rounded hover:bg-muted"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-border rounded">
                    {filteredProducts.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted cursor-pointer border-b border-border last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(p.id)}
                          onChange={() => toggleProduct(p.id)}
                          className="accent-primary"
                        />
                        <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                        <span className="flex-1">{p.name}</span>
                        <span className="text-xs text-muted-foreground">{p.category} / {p.subcategory}</span>
                      </label>
                    ))}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1.5">Total Selected: {selectedProducts.length} Product(s)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProducts.map((id) => {
                          const p = productCatalog.find((x) => x.id === id);
                          return (
                            <span key={id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                              {p?.name || id}
                              <button type="button" onClick={() => toggleProduct(id)} className="hover:bg-primary/20 rounded">
                                <X size={12} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Locations */}
        <div className="rounded-lg border border-border p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Availability Type</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="availabilityType"
                  checked={availabilityType === "everywhere"}
                  onChange={() => setAvailabilityType("everywhere")}
                  className="accent-primary"
                />
                Available Everywhere
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="availabilityType"
                  checked={availabilityType === "selected"}
                  onChange={() => setAvailabilityType("selected")}
                  className="accent-primary"
                />
                Available Only In Selected Locations
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {availabilityType === "everywhere"
                ? "Product is available in all locations."
                : "Configure allowed countries, states, cities, and postal codes below."}
            </p>
          </div>

          {availabilityType === "selected" && (
            <LocationGroup
              title="Available Locations"
              countries={availCountries} setCountries={setAvailCountries}
              states={availStates} setStates={setAvailStates}
              cities={availCities} setCities={setAvailCities}
              postals={availPostals} setPostals={setAvailPostals}
              countryScope={availCountries}
            />
          )}
        </div>

        {/* Excluded Locations */}
        <LocationGroup
          title="Excluded Locations"
          countries={exclCountries} setCountries={setExclCountries}
          states={exclStates} setStates={setExclStates}
          cities={exclCities} setCities={setExclCities}
          postals={exclPostals} setPostals={setExclPostals}
          countryScope={availCountries}
        />

        {/* Restriction Behavior */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Restriction Behavior</h3>
          <div className="space-y-2">
            {[
              { id: "hide", label: "Hide Product Completely", desc: "Product is hidden from customers. No warning message displayed." },
              { id: "warn", label: "Show Warning Message Only", desc: "Product remains visible. Customer sees restriction warning message." },
              { id: "hide_warn", label: "Hide Product Completely + Show Warning Message", desc: "Product is hidden; warning message stored for future integrations." },
            ].map((opt) => (
              <label key={opt.id} className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded hover:bg-muted/50">
                <input
                  type="radio"
                  name="restrictionBehavior"
                  checked={restrictionBehavior === opt.id}
                  onChange={() => setRestrictionBehavior(opt.id as any)}
                  className="accent-primary mt-0.5"
                />
                <div>
                  <div className="font-medium text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Restriction Message */}
        {showMessage && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Restriction Message (Optional)</h3>
            <p className="text-xs text-muted-foreground mb-3">
              This warning message is shown to customers based on the selected Restriction Behavior.
            </p>
            <FieldRenderer field={{ name: "Restriction Message", type: "richtext", source: "Ontra Upload", colSpan: 2 }} />
          </div>
        )}

        {/* Restriction Status */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Restriction Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Active</label>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className="ml-2 text-sm text-muted-foreground">{active ? "Active" : "Inactive"}</span>
            </div>
            <div className="hidden md:block" />
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Effective Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(inputBase, "flex items-center justify-between text-left", !effectiveDate && "text-muted-foreground")}>
                    {effectiveDate ? format(effectiveDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={effectiveDate} onSelect={setEffectiveDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(inputBase, "flex items-center justify-between text-left", !endDate && "text-muted-foreground")}>
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

const tabLabels = [
  "Product Information",
  "Product Images",
  "Product Rules",
  "Location Restrictions",
  "Flags",
  "Supplier Details",
  "Buyer & Customer Service",
  "Pricing & Catalogs",
  "Psoft Data",
];

const ProductDetailPage = ({ product, onBack }: { product?: any; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const currentLabel = tabLabels[activeTab];

  const renderTabContent = () => {
    if (currentLabel === "Product Rules") return <ProductRulesTab />;
    if (currentLabel === "Location Restrictions") return <LocationRestrictionsTab product={product} />;

    const staticTab =
      staticTabs.find((t) => t.label === currentLabel) ||
      trailingTabs.find((t) => t.label === currentLabel);
    if (!staticTab) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {staticTab.fields.map((f) => (
          <FieldRenderer key={f.name} field={f} />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2"
        >
          <ArrowLeft size={15} /> Back to Products
        </button>
        <h1 className="page-title">
          {product?.name || "New Product"} – {product?.id || "—"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-4 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabLabels.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-base font-semibold text-foreground mb-4">{currentLabel}</h2>
        {renderTabContent()}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          Save
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
