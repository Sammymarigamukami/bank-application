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
import { MoreHorizontal, Eye, Lock, Key, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

// Using the structure from your actual API response
interface Customer {
  customerId: number
  name: string
  email: string
  phone: string
  account_type: string
  customerStatus: string
  accountStatus: string
  currentBalance: string | number
}

interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">All Customers</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-600 font-semibold">Name</TableHead>
              <TableHead className="text-slate-600 font-semibold">Contact Info</TableHead>
              <TableHead className="text-slate-600 font-semibold">Account Type</TableHead>
              <TableHead className="text-slate-600 font-semibold">Status</TableHead>
              <TableHead className="text-slate-600 font-semibold">Balance</TableHead>
              <TableHead className="text-slate-600 font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.customerId} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="text-slate-900 font-medium">
                    {customer.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-slate-600 text-sm">{customer.email}</span>
                      <span className="text-slate-400 text-xs">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-normal">
                      {customer.account_type || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        customer.customerStatus === 'active'
                          ? 'default' 
                          : 'destructive'
                      }
                    >
                      {customer.customerStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-900 font-mono font-medium">
                    {/* Handling string balance from SQL Decimal */}
                    KES {Number(customer.currentBalance).toLocaleString('en-KE', { 
                      minimumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Customer Management</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                       <DropdownMenuItem asChild>
                        <Link 
                          to={`/adminPortal/customers/${customer.customerId}`}
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                          View Full Profile
                        </Link>
                      </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Lock className="w-4 h-4 text-slate-500" />
                          {customer.accountStatus === 'active' ? 'Freeze Account' : 'Unfreeze Account'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Key className="w-4 h-4 text-slate-500" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                          Deactivate User
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