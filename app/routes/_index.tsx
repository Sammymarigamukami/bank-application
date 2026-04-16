import { CTASection } from "~/components/home/cta-section";
import { FeaturesSection } from "~/components/home/features-section";
import { Footer } from "~/components/home/footer";
import { HeroSection } from "~/components/home/hero-section";
import { Navbar } from "~/components/home/navbar";
import { ServicesSection } from "~/components/home/services-section";
import { TrustSection } from "~/components/home/trust-section";


export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
