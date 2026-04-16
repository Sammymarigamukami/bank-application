import { User, Briefcase, PiggyBank, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const services = [
  {
    icon: User,
    title: "Personal Banking",
    description: "Everyday accounts with digital tools and easy payments.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Briefcase,
    title: "Business Banking",
    description: "Powerful financial tools designed for growing businesses.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: PiggyBank,
    title: "Investment Accounts",
    description: "Build long-term wealth with guided investment options.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: GraduationCap,
    title: "Youth Accounts",
    description: "Teach financial responsibility with accounts designed for young savers.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Financial Solutions
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-400 text-lg">
            Comprehensive banking solutions tailored to your unique needs in a digital-first world.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-zinc-800 bg-zinc-900/40 transition-all duration-300 hover:border-primary/50 hover:bg-zinc-900 shadow-xl"
            >
              {/* Card Image with Dark Gradient */}
              <div className="relative h-40 w-full overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
              </div>

              <CardHeader className="relative mt-[-2.5rem] pt-0">
                {/* Icon Circle */}
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg ring-4 ring-zinc-900 transition-transform group-hover:scale-110">
                  <service.icon className="size-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-zinc-400">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}