
'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CustomerTable } from '../_components/customerTable';
import { getAllAdminCustomers } from '~/api/auth';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        // Using the API we just wrote
        const data = await getAllAdminCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-2">Manage and view all customers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* State Handling */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-500">Loading customers...</span>
        </div>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
}
