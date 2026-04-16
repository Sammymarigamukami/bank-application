
import { Plus } from 'lucide-react'
import { getLoans } from '~/lib/adminMockData'
import { AdminLayout } from '../_components/layouts/adminLayout'
import { Button } from '~/components/ui/button'
import { LoanTable } from '../_components/loanTable'

export const metadata = {
  title: 'Loans | NexusBank Admin',
  description: 'Loan application management',
}

export default function LoansPage() {
  const loans = getLoans()

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Loans</h1>
            <p className="text-slate-600 mt-2">Manage loan applications and approvals</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Loan
          </Button>
        </div>

        {/* Table */}
        <LoanTable loans={loans} />
      </div>
  )
}
