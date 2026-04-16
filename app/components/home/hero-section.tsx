import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router"

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32 flex items-center">
      {/* --- Background Layer --- */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          alt="Cyber Security Dark Background"
          className="h-full w-full object-cover object-center"
        />
        {/* Darker Overlay Strategy:
           Using a gradient ensures the text side (left) is darker than the image side (right)
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40 backdrop-blur-[1px]" />
      </div>

      {/* --- Content Layer --- */}
      <div className="mx-auto max-w-7xl w-full relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Banking built for the <span className="text-primary">digital generation</span>
            </h1>
            
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-zinc-300">
              Secure, fast, and intelligent financial services designed to help individuals and businesses grow in an ever-changing digital landscape.
            </p>

            <div className="flex flex-col gap-4 mt-4 sm:flex-row">
              <Button 
                size="lg" 
                className="gap-2 shadow-xl shadow-primary/20"
                onClick={() => navigate("/RegisterAccount")}
              >
                Open an Account
                <ArrowRight className="size-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-zinc-700 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md"
              >
                Learn More
              </Button>
            </div>

            {/* Social proof / Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                FDIC Insured
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                256-bit Encryption
              </div>
            </div>
          </div>

          {/* Right Side - Visual Space */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}