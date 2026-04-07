
import React from 'react'
import ChangePasswordForm from './_components/change-password-form'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'

const SettingsPage = () => {
  return (
    <div className=''>
       <DashboardOverviewHeader
        title="Settings"
        description="Manage your account preferences and system settings in one place."
      />
      <ChangePasswordForm/>
    </div>
  )
}

export default SettingsPage