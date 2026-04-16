'use client'


import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { AlertTriangle, Shield } from 'lucide-react'
import type { FraudAlert } from '~/lib/type'

interface FraudAlertCardProps {
  alert: FraudAlert
}

export function FraudAlertCard({ alert }: FraudAlertCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Card className={`p-6 border-l-4 ${
      alert.riskLevel === 'high'
        ? 'border-l-red-600'
        : alert.riskLevel === 'medium'
          ? 'border-l-yellow-500'
          : 'border-l-blue-600'
    }`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {alert.riskLevel === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{alert.customerName}</p>
              <p className="text-sm text-slate-600 mt-1 font-mono">{alert.accountNumber}</p>
            </div>
          </div>
          <Badge variant={getRiskColor(alert.riskLevel)}>
            {alert.riskLevel} Risk
          </Badge>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <p className="text-sm font-medium text-slate-900 capitalize">
            {alert.type.replace(/_/g, ' ')}
          </p>
          <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
        </div>

        {alert.amount && (
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600">Amount</p>
            <p className="text-lg font-semibold text-slate-900">
              ${alert.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500 text-right">{alert.date}</p>
      </div>
    </Card>
  )
}
