import { Link } from "react-router";
import { Landmark, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8 border-t border-white/5">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
          alt="World Map Texture" 
          className="h-full w-full object-cover grayscale"
        />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 md:grid-cols-3">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Landmark className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nexus<span className="text-primary">Bank</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
              A digital banking platform built for the modern generation. Empowering individuals and businesses with secure, intelligent financial services worldwide.
            </p>
          </div>

          {/* Products Column */}
          <div className="md:ml-auto">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              Products
            </h3>
            <ul className="space-y-4">
              {["Personal Banking", "Business Banking", "Investments", "Savings"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:ml-auto">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Mail className="size-5 text-zinc-500" />
                <div>
                  <span className="block font-medium text-white">Email</span>
                  <a href="mailto:support@nexusbank.com" className="text-zinc-400 hover:text-primary transition-colors">
                    support@nexusbank.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone className="size-5 text-zinc-500" />
                <div>
                  <span className="block font-medium text-white">Phone</span>
                  <a href="tel:+1-800-123-4567" className="text-zinc-400 hover:text-primary transition-colors">
                    +1 (800) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="size-5 text-zinc-500" />
                <div>
                  <span className="block font-medium text-white">Headquarters</span>
                  <span className="text-zinc-400">100 Financial Plaza, Nairobi, Kenya</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © 2026 NexusBank. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}