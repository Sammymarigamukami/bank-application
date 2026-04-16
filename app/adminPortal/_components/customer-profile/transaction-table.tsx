'use client';

import { useMemo, useState } from 'react';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Empty, EmptyDescription, EmptyTitle } from '~/components/ui/empty';

// Interface matching your backend transaction structure
interface Transaction {
  id: number;
  date: string;
  type: string;
  amount: string | number;
  status: string;
  description: string | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

const getTransactionTypeColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('deposit')) return 'bg-emerald-100 text-emerald-800';
  if (t.includes('withdrawal')) return 'bg-rose-100 text-rose-800';
  if (t.includes('transfer')) return 'bg-blue-100 text-blue-800';
  if (t.includes('m-pesa')) return 'bg-green-100 text-green-800';
  return 'bg-slate-100 text-slate-800';
};

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'success') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (s === 'failed') return 'bg-rose-100 text-rose-800 border-rose-200';
  return 'bg-slate-100 text-slate-800';
};

const formatKES = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(numericAmount);
};

export function TransactionTable({ transactions = [], loading = false }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const description = tx.description?.toLowerCase() || '';
      const idStr = tx.id.toString();
      const search = searchTerm.toLowerCase();

      const matchesSearch = description.includes(search) || idStr.includes(search);
      const matchesType = typeFilter === 'all' || tx.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || tx.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        <p className="text-sm text-slate-500 font-medium">Loading transaction ledger...</p>
      </div>
    );
  }

  const FilterControls = (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Search</label>
          <Input
            placeholder="Search ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Type</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {FilterControls}

      {filteredTransactions.length === 0 ? (
        <Empty className="border-2 border-dashed border-slate-100 rounded-xl py-12">
          <EmptyTitle>No records found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any transactions matching your current filters.
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-bold text-slate-700">Date</TableHead>
                <TableHead className="font-bold text-slate-700">Details</TableHead>
                <TableHead className="font-bold text-slate-700">Type</TableHead>
                <TableHead className="text-right font-bold text-slate-700">Amount</TableHead>
                <TableHead className="text-center font-bold text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-xs font-medium text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-KE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {tx.description || `${tx.type} Transaction`}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Ref: {tx.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getTransactionTypeColor(tx.type)} border-transparent font-bold text-[10px] px-2 py-0`}>
                      {tx.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'deposit' ? '+' : '-'} {formatKES(tx.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getStatusColor(tx.status)} font-bold text-[10px]`}>
                      {tx.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}