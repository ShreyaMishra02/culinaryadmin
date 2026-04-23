import { useState } from "react";
import { ArrowLeft } from "lucide-react";

// ---- Excel-aligned field definitions ----
type FieldType = "text" | "textarea" | "select" | "checkbox" | "radio";
type Field = {
  name: string;
  type: FieldType;
  source: "Psoft API" | "Ontra Upload";
  options?: string[];
  colSpan?: 1 | 2;
};

const categories = ["Beverages", "Restaurants", "Order In", "Meal Kits", "Goodies", "Grocery"];
const subcategories = [
  "Alcohol", "Coffee & Tea", "Mocktails", "Soda", "Smoothies",
  "Restaurants", "Chain Restaurants", "Fast Food", "Restaurant Experiences",
  "Food Delivery", "Premium Items", "Meal Kit", "Snacks", "Treats", "Edible Gifts",
];

const tabs: { label: string; fields: Field[] }[] = [
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
  {
    label: "Product Rules & Alerts",
    fields: [
      { name: "Age Trigger", type: "checkbox", source: "Ontra Upload" },
      { name: "DROP SHIP FLAG", type: "checkbox", source: "Psoft API" },
      { name: "India Tax Flag?", type: "checkbox", source: "Ontra Upload" },
      { name: "Lead Days", type: "text", source: "Psoft API" },
      { name: "Max Order Qty", type: "text", source: "Psoft API" },
      { name: "Min Order Qty", type: "text", source: "Psoft API" },
      { name: "Product Rule Trigger", type: "checkbox", source: "Ontra Upload" },
      { name: "Location Alert", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Product Alert", type: "textarea", source: "Ontra Upload", colSpan: 2 },
      { name: "Product Rule Description", type: "textarea", source: "Ontra Upload", colSpan: 2 },
    ],
  },
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

const FieldRenderer = ({ field }: { field: Field }) => {
  const readOnly = field.source === "Psoft API";
  const spanCls = field.colSpan === 2 ? "md:col-span-2" : "";

  return (
    <div className={spanCls}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-foreground">{field.name}</label>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            readOnly
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {field.source}
        </span>
      </div>

      {field.type === "text" && (
        <input
          type="text"
          disabled={readOnly}
          className={`${inputBase} ${readOnly ? disabledCls : ""}`}
        />
      )}

      {field.type === "textarea" && (
        <textarea
          disabled={readOnly}
          rows={3}
          className={`${inputBase} ${readOnly ? disabledCls : ""}`}
        />
      )}

      {field.type === "select" && (
        <select
          disabled={readOnly}
          className={`${inputBase} ${readOnly ? disabledCls : ""}`}
        >
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}

      {field.type === "checkbox" && (
        <label className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            disabled={readOnly}
            className="w-4 h-4 rounded border-input"
          />
          <span className="text-sm text-muted-foreground">Enable</span>
        </label>
      )}

      {field.type === "radio" && (
        <div className="flex flex-wrap gap-4 mt-1">
          {field.options?.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={field.name}
                disabled={readOnly}
                className="w-4 h-4"
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = ({ product, onBack }: { product?: any; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = tabs[activeTab];

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
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-base font-semibold text-foreground mb-4">
          {currentTab.label}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {currentTab.fields.map((f) => (
            <FieldRenderer key={f.name} field={f} />
          ))}
        </div>
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
