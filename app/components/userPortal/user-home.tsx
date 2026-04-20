
import { BalanceCard } from "./dashboard/balance-card"
import { QuickActions } from "./dashboard/quick-action"
import { TransactionTable } from "./dashboard/transaction-table"
import { CardPreview } from "./dashboard/card-preview"

export default function UserHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Balance and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard className="lg:col-span-2" />
        <QuickActions />
      </div>

      {/* Transactions and Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <TransactionTable className="lg:col-span-2" />
        <CardPreview />
      </div>
    </div>
  )
}