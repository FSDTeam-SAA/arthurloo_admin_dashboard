import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import ManagePlanContainer from './_components/manage-plan-container'

const ManagePlan = () => {
  return (
    <div>
        <DashboardOverviewHeader
        title="Manage Plan"
        description="View, upgrade, or modify your current subscription plan"
      />
      <ManagePlanContainer/>
    </div>
  )
}

export default ManagePlan