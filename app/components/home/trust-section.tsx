const stats = [
  { value: "..", label: "Customers" },
  { value: "50+", label: "Countries Supported" },
  { value: "99.99%", label: "Platform Uptime" },
  { value: "Bank-Grade", label: "Security" },
]

export function TrustSection() {
  return (
    <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 border-y border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-3xl bg-zinc-900/40 p-12 backdrop-blur-sm border border-white/5 shadow-2xl">
          
          {/* Subtle background glow to pull focus to the stats */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="h-20 w-full max-w-4xl rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="relative text-center group">
                {/* Visual separator for desktop (except last item) */}
                {index !== stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
                )}

                <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl transition-colors group-hover:text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-zinc-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}