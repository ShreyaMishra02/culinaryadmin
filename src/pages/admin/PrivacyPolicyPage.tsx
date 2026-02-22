import GenericLegalModule from "@/components/GenericLegalModule";

const PrivacyPolicyPage = () => (
  <GenericLegalModule
    title="Privacy Policy"
    subtitle="Manage data privacy disclosure documents"
    items={[
      { id: 1, title: "Global Privacy Policy", active: true },
      { id: 2, title: "GDPR Compliance Notice", active: true },
      { id: 3, title: "CCPA Privacy Notice", active: false },
    ]}
  />
);

export default PrivacyPolicyPage;
