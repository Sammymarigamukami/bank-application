import { Link } from "react-router";
import { ArrowLeft, UserPlus } from "lucide-react";
import RegisterForm from "~/components/forms/authForms/RegisterAccount";
import { Button } from "~/components/ui/button";

export default function RegisterAccount() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-zinc-950 py-12">
      
      {/* --- Background Image Layer --- */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
          alt="Digital Growth Background"
          className="h-full w-full object-cover opacity-20 grayscale"
        />
        {/* Deep radial gradient to focus on the registration form */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950/90 to-zinc-950" />
      </div>

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          asChild 
          className="text-zinc-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Centered Registration Content */}
      <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center">
        
        {/* Branding/Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4 transition-transform hover:scale-110">
            <UserPlus className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join Nexus<span className="text-primary">Bank</span>
          </h1>
          <p className="text-zinc-400 mt-2 max-w-sm text-balance">
            Start your journey with secure, intelligent banking designed for your digital life.
          </p>
        </div>

        {/* The Registration Form Container 
            We use a wider max-w (max-w-3xl) as registration forms usually have more fields.
        */}
        <div className="w-full rounded-3xl border border-white/10 bg-zinc-900/50 p-1 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="p-2 sm:p-4">
            <RegisterForm />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          <span>Secure Setup</span>
          <span className="size-1 rounded-full bg-zinc-700" />
          <span>No Initial Deposit Required</span>
          <span className="size-1 rounded-full bg-zinc-700" />
          <span>256-Bit SSL</span>
        </div>
      </div>

      {/* Subtle Background Glows */}
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-[120px]" />
    </div>
  );
}