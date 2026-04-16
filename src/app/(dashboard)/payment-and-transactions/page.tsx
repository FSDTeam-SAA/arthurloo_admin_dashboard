import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import ReportsContainer from './_components/reports-container'

const ReportsManagement = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="Reports Management"
        description="Welcome back! Here's what's happening with Naturopath.ai today."
      />
      <ReportsContainer />
    </div>
  )
}

export default ReportsManagement