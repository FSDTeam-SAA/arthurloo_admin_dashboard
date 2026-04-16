import React from "react";
import ChatManagementContainer from "./_components/chat-management-container";
import DashboardOverviewHeader from "../_components/dashboard-overview-header";

const ChatManagementPage = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="Chat Management"
        description="Welcome back! Here's what's happening with Naturopath.ai today."
      />
      <ChatManagementContainer />
    </div>
  );
};

export default ChatManagementPage;
