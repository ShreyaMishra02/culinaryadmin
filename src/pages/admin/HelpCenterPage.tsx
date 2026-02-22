import GenericLegalModule from "@/components/GenericLegalModule";

const HelpCenterPage = () => (
  <GenericLegalModule
    title="Help Center"
    subtitle="Manage FAQs and support content"
    hasCategory
    items={[
      { id: 1, title: "How do I reset my password?", active: true, category: "Account" },
      { id: 2, title: "How to track my order?", active: true, category: "General" },
      { id: 3, title: "Return & refund policy", active: true, category: "Billing" },
      { id: 4, title: "How to redeem gift cards?", active: false, category: "General" },
      { id: 5, title: "Contact support options", active: true, category: "Technical" },
    ]}
  />
);

export default HelpCenterPage;
