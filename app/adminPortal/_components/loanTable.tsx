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
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Check, X } from 'lucide-react'
import type { Loan } from '~/lib/type'

interface LoanTableProps {
  loans: Loan[]
}

export function LoanTable({ loans }: LoanTableProps) {
  return (
    <Card>
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Loan Applications</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-600 font-semibold">Customer</TableHead>
              <TableHead className="text-slate-600 font-semibold">Type</TableHead>
              <TableHead className="text-slate-600 font-semibold">Amount Requested</TableHead>
              <TableHead className="text-slate-600 font-semibold">Duration (months)</TableHead>
              <TableHead className="text-slate-600 font-semibold">Applied Date</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
              <TableHead className="text-slate-600 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id} className="border-b border-slate-100 hover:bg-slate-50">
                <TableCell className="text-slate-900 font-medium">{loan.customerName}</TableCell>
                <TableCell className="text-slate-600 text-sm capitalize">{loan.type}</TableCell>
                <TableCell className="text-slate-900 font-semibold">
                  ${loan.amountRequested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-slate-600">{loan.duration}</TableCell>
                <TableCell className="text-slate-600 text-sm">{loan.applicationDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      loan.status === 'pending'
                        ? 'secondary'
                        : loan.status === 'approved' || loan.status === 'active'
                          ? 'default'
                          : 'destructive'
                    }
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      {loan.status === 'pending' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center gap-2 text-green-600">
                            <Check className="w-4 h-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <X className="w-4 h-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
