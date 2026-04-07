import React from "react";
import ContactManagementContainer from "./_components/contact-management-container";
import DashboardOverviewHeader from "../_components/dashboard-overview-header";

const ContactManagementPage = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="Contact Management"
        description="Efficiently store, update, and manage your contact information."
      />
      <ContactManagementContainer />
    </div>
  );
};

export default ContactManagementPage;
