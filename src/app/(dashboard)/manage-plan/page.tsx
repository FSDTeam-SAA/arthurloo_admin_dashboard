import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import RequestsContainer from './_components/requests-container'

const RequestsManagement = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="Requests Management"
        description="Welcome back! Here's what's happening with Naturopath.ai today."
      />
      <RequestsContainer />
    </div>
  )
}

export default RequestsManagement