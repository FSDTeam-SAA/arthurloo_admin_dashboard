import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import ManageUserscontainer from './_components/manage-users-container'
import { ManageUsersOverview } from './_components/manage-users-overview'

const ManageUsers = () => {
  return (
    <div>
        <DashboardOverviewHeader
        title="Manage Users"
        description="View, organize, and update all user accounts from one place."
      />
      <ManageUsersOverview/>
      <ManageUserscontainer/>
    </div>
  )
}

export default ManageUsers