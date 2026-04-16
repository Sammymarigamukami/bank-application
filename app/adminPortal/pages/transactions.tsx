'use client' // Required for state and effects

import { useState, useEffect } from 'react'
import { TransactionFilters } from "../_components/transaction/transactionFilter"
import { TransactionTable } from "../_components/transaction/transactionTable"
import { getAdminAllTransactions } from '~/api/auth' // Your real API call

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Define the fetcher function
  const handleFilterApply = async (filterValues?: any) => {
    setLoading(true)
    try {
      const data = await getAdminAllTransactions(filterValues)
      setTransactions(data)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  // 2. Load initial data on page mount
  useEffect(() => {
    handleFilterApply()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600 mt-2">Monitor all account transactions across NexusBank</p>
      </div>

      {/* 3. Pass the function to Filters */}
      <TransactionFilters 
        onApply={handleFilterApply} 
        onReset={() => handleFilterApply()} 
      />

      {/* 4. Show Loading state or Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg border border-slate-200">
          <div className="text-slate-500 animate-pulse">Fetching global ledger...</div>
        </div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  )
}
