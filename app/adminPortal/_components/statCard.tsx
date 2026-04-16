import type { ReactNode } from 'react'
import { Card } from '~/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: number
  unit?: string
}

export function StatCard({ title, value, icon, change, unit }: StatCardProps) {
  const isPositive = change && change >= 0
  const trend = change !== undefined && change !== 0

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {unit && <p className="text-sm text-slate-500">{unit}</p>}
          </div>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
        <div className="text-blue-600 bg-blue-50 p-3 rounded-lg">{icon}</div>
      </div>
    </Card>
  )
}
