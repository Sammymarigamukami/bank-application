import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router"

export function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-16 text-center sm:px-12 sm:py-24 border border-white/5 shadow-2xl">
          
          {/* --- Background Image & Overlay --- */}
          <div className="absolute inset-0 -z-10">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
              alt="Digital Connectivity Background"
              className="h-full w-full object-cover opacity-40"
            />
            {/* Darker gradient to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-900/40 to-zinc-950/80" />
          </div>

          {/* Glowing decorations (increased opacity for the final section) */}
          <div className="absolute -left-20 -top-20 size-80 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative z-10">
            <h2 className="mx-auto mb-6 max-w-2xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start your financial journey <span className="text-primary">today</span>
            </h2>
            
            <p className="mx-auto mb-10 max-w-lg text-pretty text-lg text-zinc-400">
              Join millions of users who trust NexusBank for their everyday banking needs. Secure your future in minutes.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="h-14 px-8 gap-2 text-lg shadow-xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
                onClick={() => navigate("/RegisterAccount")}
              >
                Create Free Account
                <ArrowRight className="size-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="h-14 px-8 text-white hover:bg-white/5 hover:text-white"
              >
                Talk to Sales
              </Button>
            </div>

            {/* Micro-text for trust */}
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-zinc-500">
              No credit card required • Instant setup • 24/7 Support
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}