import GenericLegalModule from "@/components/GenericLegalModule";

const CookiePolicyPage = () => (
  <GenericLegalModule
    title="Cookie Policy"
    subtitle="Manage website cookie usage policies"
    items={[
      { id: 1, title: "Cookie Consent Policy", active: true },
      { id: 2, title: "Analytics Cookies Disclosure", active: true },
    ]}
  />
);

export default CookiePolicyPage;
