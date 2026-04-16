'use client'


import {
  BarChart3,
  Users,
  CreditCard,
  ArrowLeftRight,
  ClipboardCheck,
  Banknote,
  AlertTriangle,
  FileText,
  Settings,
} from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '~/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/adminPortal',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Customers',
    href: '/adminPortal/customers',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Accounts',
    href: '/adminPortal/accounts',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: 'Transactions',
    href: '/adminPortal/transactions',
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    label: 'Approvals',
    href: '/adminPortal/approvals',
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    label: 'Loans',
    href: '/adminPortal/loans',
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    label: 'Fraud Detection',
    href: '/adminPortal/fraud',
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    label: 'Reports',
    href: '/adminPortal/reports',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/adminPortal/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-slate-50 flex flex-col pt-20',
        className
      )}
    >
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          return (
            <Link
              key={item.href}
              to={item.href}
              className=
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors'
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <p className="text-xs text-slate-400">NexusBank Admin v1.0</p>
      </div>
    </aside>
  )
}
