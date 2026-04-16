import { Zap, Shield, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const features = [
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send and receive money instantly with secure real-time transactions.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
  },
{
  icon: Shield,
  title: "Advanced Security",
  description: "Multi-layer encryption, biometric authentication, and fraud protection.",
  image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
},
  {
    icon: BarChart3,
    title: "Smart Financial Insights",
    description: "AI-powered analytics that help customers track spending and manage savings.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
]

export function FeaturesSection() {
  return (
    // Dark Theme: using bg-zinc-950 and dark mode classes
    <section id="security" className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose NexusBank
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Experience banking that puts your needs first with cutting-edge technology and security.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-primary/50 hover:bg-zinc-900 shadow-2xl"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay for better blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>

              <CardHeader className="relative mt-[-2rem]">
                {/* Floating Icon Container */}
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg ring-4 ring-zinc-900">
                  <feature.icon className="size-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-zinc-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}