'use client'

import type { ReactNode } from 'react'
import { AdminNavbar } from './adminNavbar'
import { AdminSidebar } from './adminSidebar'


export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
    </div>
  )
}