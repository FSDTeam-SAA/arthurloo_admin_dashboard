import React from 'react'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'
import PaymentAndTransactionsContainer from './_components/payment-and-transactions-container'
import { PaymentOverview } from './_components/payment-overview'

const PaymentAndTransactions = () => {
  return (
    <div>
        <DashboardOverviewHeader
        title="Payments & Transactions "
        description="Seamlessly handle payments and gain full visibility into every transaction."
      />
      <PaymentOverview/>
      <PaymentAndTransactionsContainer/>
    </div>
  )
}

export default PaymentAndTransactions