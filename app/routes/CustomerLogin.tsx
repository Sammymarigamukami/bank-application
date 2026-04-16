import { Link } from "react-router";
import CustomerLoginForm from "~/components/forms/authForms/CustomerLoginForm";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CustomerLogin() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-zinc-950">
      
      {/* --- Background Image Layer --- */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          alt="Secure Network Background"
          className="h-full w-full object-cover opacity-30 grayscale"
        />
        {/* Radial gradient creates a 'spotlight' effect in the center for the login form */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950/90 to-zinc-950" />
      </div>

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          asChild 
          className="text-zinc-400 hover:text-white hover:bg-white/10 backdrop-blur-md"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Centered Content Wrapper */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Optional Branding above the form */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4">
            <ShieldCheck className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-white">Secure Sign In</h1>
          <p className="text-zinc-400 text-sm mt-2">Access your NexusBank dashboard</p>
        </div>

        {/* The Login Form 
            Note: If you have control over CustomerLoginForm, 
            ensure its internal classes use bg-zinc-900 or transparent 
        */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-1 backdrop-blur-xl shadow-2xl">
           <CustomerLoginForm />
        </div>

        {/* Support Footer */}
        <p className="mt-8 text-center text-xs text-zinc-500">
          Protected by Nexus-Shield Encryption. <br />
          Having trouble? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
        </p>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-[120px]" />
    </div>
  );
}