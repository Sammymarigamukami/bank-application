'use client'

import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card } from '~/components/ui/card'
import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface TransactionFiltersProps {
  onApply: (filters: { type: string, status: string, fromDate: string, toDate: string, minAmount: string, maxAmount: string }) => void
  onReset: () => void
}
export function TransactionFilters({ onApply, onReset }: TransactionFiltersProps) {
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')

  const handleApply = () => {
    onApply({ type, status, fromDate, toDate, minAmount, maxAmount })
  }

  const handleReset = () => {
    setType('all'); setStatus('all'); setFromDate(''); setToDate(''); setMinAmount(''); setMaxAmount('');
    onReset()
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">From Date</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">To Date</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="lg:col-span-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Amount Range</label>
          <div className="flex items-center gap-4">
            <Input type="number" placeholder="Min" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
            <Input type="number" placeholder="Max" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4 flex gap-2 pt-2">
          <Button className="flex-1" onClick={handleApply}>Apply Filters</Button>
          <Button variant="outline" className="flex-1" onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </Card>
  )
}