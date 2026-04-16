import { Card } from '~/components/ui/card'
import { AlertTriangle, Lock, TrendingUp } from 'lucide-react'

interface FraudDashboardProps {
  highRiskCount: number
  flaggedAccounts: number
  blockedTransfers: number
}

export function FraudDashboard({ highRiskCount, flaggedAccounts, blockedTransfers }: FraudDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 border-l-4 border-l-red-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">High Risk Transactions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{highRiskCount}</p>
            <p className="text-xs text-red-600 font-semibold mt-2">Requires immediate attention</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Flagged Accounts</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{flaggedAccounts}</p>
            <p className="text-xs text-yellow-600 font-semibold mt-2">Under investigation</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-l-4 border-l-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Blocked Transfers</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{blockedTransfers}</p>
            <p className="text-xs text-blue-600 font-semibold mt-2">This month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  )
}
