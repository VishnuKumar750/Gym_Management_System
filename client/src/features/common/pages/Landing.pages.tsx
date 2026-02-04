// src/pages/Landing.tsx
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen  transition-colors duration-300">
      {/* Top subtle gradient line - adapts in dark mode */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />

      <main className="relative">
        {/* Hero */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
                Modern Gym Management • Paperless • Simple
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
                Digital gym experience
                <br />
                <span className="text-slate-500 dark:text-slate-400 font-light">without the paperwork</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
                Clean digital receipts • Automatic reminders • Elegant member portal
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full transition-all group shadow-sm"
                  asChild
                >
                  <Link to="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-medium border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-full"
                  asChild
                >
                  <Link to="/demo">See it in action →</Link>
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  14-day full access
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-background">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                About GymFlow
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                We’re building the simplest, most reliable digital solution for modern gyms in India.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  GymFlow was created to solve real problems that gym owners and members face every day — lost paper receipts, forgotten payments, manual reminders, and lack of transparency.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our mission is simple: help gyms move to a clean, professional, digital system that saves time, reduces stress, and makes both owners and members happier.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
                <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400 flex-shrink-0" />
                    <span>100% digital receipts & payment history</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400 flex-shrink-0" />
                    <span>Automatic reminders via WhatsApp/SMS/Email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400 flex-shrink-0" />
                    <span>Beautiful mobile-friendly member portal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400 flex-shrink-0" />
                    <span>No app download required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Dark mode adapted */}
        <section id="pricing" className="py-24 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5">
                Flexible Plans for Every Gym
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Choose the billing cycle that works best for you.  
                We offer transparent pricing with no hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Monthly */}
              <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Monthly</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect to get started</p>
                  <div className="text-5xl font-bold text-slate-900 dark:text-white">
                    ₹999
                    <span className="text-2xl font-normal text-slate-500 dark:text-slate-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow text-slate-700 dark:text-slate-300">
                  {[
                    "Unlimited members & digital receipts",
                    "WhatsApp/SMS/Email reminders",
                    "Clean member portal",
                    "Basic reports & analytics",
                    "Standard support"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Yearly */}
              <div className="relative bg-slate-900 dark:bg-card text-white dark:text-slate-100 rounded-3xl p-8 shadow-2xl scale-105 border-2 border-slate-700 dark:border-slate-300 flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 text-sm font-medium px-5 py-1.5 rounded-full">
                  Most Popular • Save 20%
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                  <p className="text-slate-300 dark:text-slate-600 mb-6">Best value for growing gyms</p>
                  <div className="text-5xl font-bold">
                    ₹799
                    <span className="text-2xl font-normal opacity-80">/month</span>
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    ₹9,588 billed annually (save ₹3,000 per year)
                  </p>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {[
                    "Everything in Monthly plan",
                    "Priority support",
                    "Advanced reporting & insights",
                    "Custom branding options"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom */}
              <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Custom</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">For larger gyms & chains</p>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mt-6">
                    Let's Talk
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow text-slate-700 dark:text-slate-300">
                  {[
                    "All features from Yearly plan",
                    "Multi-location / chain support",
                    "Dedicated account manager",
                    "Custom integrations & API access",
                    "Special / volume-based pricing"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Central CTA */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-slate-900 dark:bg-card text-white dark:text-slate-100 rounded-2xl px-10 py-8 shadow-xl max-w-3xl w-full">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to improve your gym?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Whether you're just starting or managing multiple locations —  
                  let's find the perfect plan for your gym.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <Button
                    size="lg"
                    className="bg-white dark:bg-zinc-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 min-w-[220px] rounded-full h-14 text-base font-medium border border-slate-300 dark:border-slate-600"
                    asChild
                  >
                    <a href="mailto:support@gymflow.in?subject=Pricing%20Discussion%20-%20GymFlow">
                      Contact Us → Get Best Price
                    </a>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 min-w-[220px] rounded-full h-14 text-base"
                    asChild
                  >
                    <a href="tel:+919876543210">
                      Call Us: +91 98765 43210
                    </a>
                  </Button>
                </div>

                <p className="mt-6 text-sm opacity-80">
                  Usually get back within 1 business day • Free consultation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-32 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-card">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5">
                Let's talk
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Have questions about GymFlow or need help choosing the right plan?  
                Drop us a message — we'll usually reply within a few hours.
              </p>
            </div>

            <form className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Rohit Sharma"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 outline-none transition-all bg-white dark:bg-background text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 outline-none transition-all bg-white dark:bg-background text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone number <span className="text-slate-400 dark:text-slate-500">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+91 98765 43210"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 outline-none transition-all bg-white dark:bg-background text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your gym, your questions, or what you're looking for..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 outline-none transition-all bg-white dark:bg-background text-slate-900 dark:text-slate-100 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full py-4 px-8 font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Send Message →
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                We'll get back to you within 24 hours • Your information is safe with us
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}