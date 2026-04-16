'use client'

import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { ArrowRight, Check, X } from 'lucide-react'
import type { TransferApproval } from '~/lib/type'

interface ApprovalCardProps {
  approval: TransferApproval
}

export function ApprovalCard({ approval }: ApprovalCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-blue-600">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 font-medium">Transfer Approval ID: {approval.id}</p>
            <p className="text-slate-600 mt-2">{approval.date}</p>
          </div>
          <Badge variant={approval.status === 'pending' ? 'secondary' : approval.status === 'approved' ? 'default' : 'destructive'}>
            {approval.status}
          </Badge>
        </div>

        {/* Transfer Details */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">From</p>
            <p className="font-semibold text-slate-900">{approval.fromCustomer}</p>
            <p className="text-sm text-slate-500 font-mono">{approval.fromAccount}</p>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-400" />

          <div>
            <p className="text-sm text-slate-600 mb-1">To</p>
            <p className="font-semibold text-slate-900">{approval.toCustomer}</p>
            <p className="text-sm text-slate-500 font-mono">{approval.toAccount}</p>
          </div>
        </div>

        {/* Amount and Reason */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-600">Amount</p>
            <p className="text-2xl font-bold text-slate-900">
              ${approval.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {approval.reason && (
            <p className="text-sm text-slate-600 mt-3">
              <strong>Reason:</strong> {approval.reason}
            </p>
          )}
        </div>

        {/* Actions */}
        {approval.status === 'pending' && (
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4" />
              Approve
            </Button>
            <Button variant="outline" className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <X className="w-4 h-4" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
