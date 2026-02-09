export function LandingAbout() {
  return (
    <section
      id="about"
      className="py-24 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-background"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About GymFlow</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We’re building the simplest, most reliable digital solution for
            modern gyms in India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg">
            <p>
              GymFlow was created to solve real problems — lost receipts,
              forgotten payments, manual reminders.
            </p>
            <p>
              Our mission is simple: help gyms move to a clean, professional
              digital system.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              {[
                "100% digital receipts & payment history",
                "Automatic reminders via WhatsApp/SMS/Email",
                "Beautiful mobile-friendly member portal",
                "No app download required",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-slate-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
