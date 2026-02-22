import GenericLegalModule from "@/components/GenericLegalModule";

const TermsPage = () => (
  <GenericLegalModule
    title="Terms & Conditions"
    subtitle="Manage legal agreement documents"
    items={[
      { id: 1, title: "General Terms of Service", active: true },
      { id: 2, title: "Marketplace Terms of Use", active: true },
      { id: 3, title: "Vendor Agreement", active: false },
    ]}
  />
);

export default TermsPage;
