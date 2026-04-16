'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Lock, Trash2, Calendar } from 'lucide-react'
import { Card } from '~/components/ui/card'


interface Account {
  customerId: number
  accountNumber: string
  holderName: string
  type: string
  balance: string | number
  status: string
  lastActivity: string
}

interface AccountTableProps {
  accounts: Account[]
}

export function AccountTable({ accounts }: AccountTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-900">Active Accounts Ledger</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-600 font-semibold">Account Number</TableHead>
              <TableHead className="text-slate-600 font-semibold">Account Holder</TableHead>
              <TableHead className="text-slate-600 font-semibold">Type</TableHead>
              <TableHead className="text-slate-600 font-semibold">Balance</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
              <TableHead className="text-slate-600 font-semibold">Last Activity</TableHead>
              <TableHead className="text-slate-600 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  No active accounts found.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.accountNumber} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-slate-900 font-mono text-sm font-bold tracking-tight">
                    {account.accountNumber}
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">
                    {account.holderName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-normal text-xs">
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-900 font-bold">
                    KES {Number(account.balance).toLocaleString('en-KE', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        account.status === 'active'
                          ? 'default'
                          : account.status === 'frozen'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {account.lastActivity}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Eye className="w-4 h-4 text-slate-400" />
                          Transaction History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Lock className="w-4 h-4 text-slate-400" />
                          Freeze Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                          Close Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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