import {
  BenefitsSection,
  FaqSection,
  FooterHome,
  HeaderHome,
  HeroSection,
  HomeCtaSection,
  HowItWorksSection,
  TrustSignalsSection,
  UseCasesSection,
} from "../components"

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderHome />
      <main>
        <HeroSection />
        <TrustSignalsSection />
        <HowItWorksSection />
        <BenefitsSection />
        <UseCasesSection />
        <FaqSection />
        <HomeCtaSection />
      </main>
      <FooterHome />
    </div>
  )
}
