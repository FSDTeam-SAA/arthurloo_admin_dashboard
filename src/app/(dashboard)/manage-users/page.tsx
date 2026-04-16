import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import ManageUserscontainer from './_components/manage-users-container'

const ManageUsers = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="User Management"
        description="Welcome back! Here's what's happening with Naturopath.ai today."
      />
      <ManageUserscontainer />
    </div>
  )
}

export default ManageUsers