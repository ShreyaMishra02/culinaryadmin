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
const LocationRestrictionsTab = () => {
  const [appliesTo, setAppliesTo] = useState("This Product Only");
  const [restrictionLevel, setRestrictionLevel] = useState("Country");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [behavior, setBehavior] = useState("Hide Product Completely");
  const [active, setActive] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const targetOptions = useMemo(() => {
    switch (appliesTo) {
      case "Entire Category":
        return categories;
      case "Entire Subcategory":
        return subcategories;
      case "Entire Category Group":
        return categoryGroups;
      default:
        return [];
    }
  }, [appliesTo]);

  const filteredLocations = useMemo(() => {
    const opts = locationOptionsByLevel[restrictionLevel] || [];
    return opts.filter(
      (o) =>
        o.toLowerCase().includes(locationSearch.toLowerCase()) &&
        !selectedLocations.includes(o)
    );
  }, [restrictionLevel, locationSearch, selectedLocations]);

  const showWarning = behavior !== "Hide Product Completely";

  return (
    <div className="space-y-4">
      {/* Restriction Configuration */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Restriction Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Applies To</label>
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value)}
              className={inputBase}
            >
              <option>This Product Only</option>
              <option>Entire Subcategory</option>
              <option>Entire Category</option>
              <option>Entire Category Group</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Target Selection</label>
            {appliesTo === "This Product Only" ? (
              <input type="text" disabled value="Current Product" className={`${inputBase} ${disabledCls}`} />
            ) : (
              <select className={inputBase}>
                <option value="">Select...</option>
                {targetOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Restriction Level</label>
            <select
              value={restrictionLevel}
              onChange={(e) => {
                setRestrictionLevel(e.target.value);
                setSelectedLocations([]);
              }}
              className={inputBase}
            >
              <option>Country</option>
              <option>State / Province</option>
              <option>City</option>
              <option>Postal Code</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Restriction Behavior</label>
            <select
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              className={inputBase}
            >
              <option>Hide Product Completely</option>
              <option>Show Warning Message</option>
              <option>Hide Product Completely and Show Warning Message</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground block mb-1.5">Restricted Locations</label>
            <div className="border border-input rounded-md bg-background p-2">
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                    >
                      {loc}
                      <button
                        type="button"
                        onClick={() => setSelectedLocations(selectedLocations.filter((l) => l !== loc))}
                        className="hover:bg-primary/20 rounded"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder={`Search ${restrictionLevel.toLowerCase()}...`}
                className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none"
              />
              {locationSearch && filteredLocations.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border-t border-border pt-2">
                  {filteredLocations.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedLocations([...selectedLocations, opt]);
                        setLocationSearch("");
                      }}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Messaging */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Location Messaging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {showWarning && (
            <FieldRenderer
              field={{ name: "Warning Message", type: "richtext", source: "Ontra Upload", colSpan: 2 }}
            />
          )}

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Active</label>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-2 text-sm text-muted-foreground">{active ? "Active" : "Inactive"}</span>
          </div>

          <div className="hidden md:block" />

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Effective Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(inputBase, "flex items-center justify-between text-left", !effectiveDate && "text-muted-foreground")}
                >
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
                <button
                  type="button"
                  className={cn(inputBase, "flex items-center justify-between text-left", !endDate && "text-muted-foreground")}
                >
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
    if (currentLabel === "Location Restrictions") return <LocationRestrictionsTab />;

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
