import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8">
            Modern Gym Management • Paperless • Simple
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            Digital gym experience
            <br />
            <span className="text-slate-500 dark:text-slate-400 font-light">
              without the paperwork
            </span>
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
            {[
              "No credit card required",
              "14-day full access",
              "Cancel anytime",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
