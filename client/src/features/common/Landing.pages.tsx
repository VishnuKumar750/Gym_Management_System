import { LandingHero } from "./landing-hero";
import { LandingAbout } from "./landing-about";
import { LandingPricing } from "./landing-price";
import { LandingContact } from "./landing-contact";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

      <main>
        <LandingHero />
        <LandingAbout />
        <LandingPricing />
        <LandingContact />
      </main>
    </div>
  );
}
