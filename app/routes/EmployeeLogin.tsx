import { Link } from "react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import AdminLoginForm from "~/components/forms/authForms/AdminLoginForm";
import { Button } from "~/components/ui/button";

export default function EmployeeLogin() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-zinc-950">
      
      {/* --- Background Image Layer --- */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2070&auto=format&fit=crop" 
          alt="Server Room Infrastructure"
          className="h-full w-full object-cover opacity-20 grayscale brightness-50"
        />
        {/* Deep vignette effect to focus on the admin portal */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/30 via-zinc-950/90 to-zinc-950" />
      </div>

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          asChild 
          className="text-zinc-500 hover:text-white hover:bg-white/5 backdrop-blur-md transition-all"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Terminal Home
          </Link>
        </Button>
      </div>

      {/* Centered Admin Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        {/* Admin Header Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-800 border border-white/10 shadow-2xl mb-4 group transition-all hover:border-primary/50">
            <ShieldAlert className="size-7 text-zinc-400 group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">
              Internal Access
            </h1>
            <p className="text-zinc-500 text-xs mt-1 font-mono">
              NEXUS-CORP // EMPLOYEE TERMINAL
            </p>
          </div>
        </div>

        {/* The Admin Login Form Wrapper */}
        <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-1 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="p-2">
            <AdminLoginForm />
          </div>
        </div>

        {/* Security Warning Footer */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p>
          <div className="flex justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-zinc-800" />
            <div className="h-1 w-8 rounded-full bg-zinc-800" />
            <div className="h-1 w-8 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Background scan-line effect for that 'Terminal' feel */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}