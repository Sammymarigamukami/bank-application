"use client"

import { Menu } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"

import { useEffect, useState } from "react"
import { isAuth, logout, type User } from "~/api/auth"
import { EmployeeDropdown } from "../emloyeeUserDropdown"

const navLinks = [
  { name: "Dashboard", path: "/adminPortal" },
  { name: "Customers", path: "/adminPortal/customers" },
  { name: "Accounts", path: "/adminPortal/accounts" },
  { name: "Transactions", path: "/adminPortal/transactions" },
  // { name: "Approvals", path: "/adminPortal/approvals" },
  { name: "Loans", path: "/adminPortal/loans" },
  { name: "Fraud Detection", path: "/adminPortal/fraud" },
  { name: "Reports", path: "/adminPortal/reports" },
  { name: "Settings", path: "/adminPortal/settings" },
]

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await isAuth();
      setUser(userData)
      setLoading(false)
      console.log("Authenticated user:", userData)
    };
    checkAuth();
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu */}
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <div className="mb-6 text-lg font-bold">
                NexusBank
              </div>

              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm hover:text-blue-600 transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/adminPortal" className="text-lg font-semibold">
            NexusBank
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link
          to="/adminPortal"
          className="hidden text-xl font-semibold lg:block"
        >
          NexusBank
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
           {!loading && user && (
            <EmployeeDropdown
              accountId={user.id}
              username={user.username}
            />
          )} 
        </div>
      </div>
    </header>
  )
}