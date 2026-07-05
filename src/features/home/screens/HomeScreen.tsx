import {
  BenefitsSection,
  FooterHome,
  HeaderHome,
  HeroSection,
  HomeCtaSection,
  HowItWorksSection,
} from "../components"

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderHome />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <HomeCtaSection />
      </main>
      <FooterHome />
    </div>
  )
}
