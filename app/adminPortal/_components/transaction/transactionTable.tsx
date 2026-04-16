'use client'

import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { ArrowDownLeft, ArrowUpRight, Replace, CreditCard, Smartphone } from 'lucide-react'

// Using a local interface since we added customerName
interface AdminTransaction {
  id: number;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'mpesa';
  accountNumber: string;
  customerName: string;
  description: string;
  amount: string | number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionTableProps {
  transactions: AdminTransaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'mpesa':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'transfer':
        return <Replace className="w-4 h-4 text-blue-600" />
      case 'payment':
        return <CreditCard className="w-4 h-4 text-purple-600" />
      default:
        return <Smartphone className="w-4 h-4 text-slate-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-900">Global Bank Ledger</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Customer / Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pl-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No transactions found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-slate-50">
                  <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 capitalize">{tx.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{tx.accountNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(tx.type)}
                      <span className="capitalize text-sm font-medium">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                    {tx.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${tx.type === 'withdrawal' || tx.type === 'payment' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'withdrawal' || tx.type === 'payment' ? '-' : '+'}
                      {Number(tx.amount).toLocaleString('en-KE', { 
                        style: 'currency', 
                        currency: 'KES' 
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="pl-6">
                    <Badge
                      className="capitalize"
                      variant={
                        tx.status === 'completed'
                          ? 'default' 
                          : tx.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}