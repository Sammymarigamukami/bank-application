"use client"

import { useState } from "react"
import { Menu, X, Landmark } from "lucide-react" // Swapped SVG for Landmark for consistency
import { Button } from "../ui/button"
import { useNavigate, Link } from "react-router"

export function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Landmark className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Nexus<span className="text-primary">Bank</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { name: "Home", href: "/" },
            { name: "Services", href: "#services" },
            { name: "Security", href: "#security" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 hover:text-white hover:bg-white/5"
            onClick={() => navigate("/EmployeeLogin")}
          >
            Employee Login
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-400 hover:text-white hover:bg-white/5"
            onClick={() => navigate("/CustomerLogin")}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="shadow-lg shadow-primary/20 transition-transform active:scale-95"
            onClick={() => navigate("/RegisterAccount")}
          >
            Open Account
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex size-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-white/5 bg-zinc-950/95 p-6 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {["Home", "Services", "Security", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`#${item.toLowerCase()}`}
                  className="text-lg font-medium text-zinc-300 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
            <hr className="border-white/5" />
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                onClick={() => { navigate("/EmployeeLogin"); setIsMenuOpen(false); }}
              >
                Employee Portal
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                onClick={() => { navigate("/CustomerLogin"); setIsMenuOpen(false); }}
              >
                Customer Login
              </Button>
              <Button
                className="w-full"
                onClick={() => { navigate("/RegisterAccount"); setIsMenuOpen(false); }}
              >
                Open Free Account
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
