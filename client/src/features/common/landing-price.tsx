export function LandingPricing() {
  const plans = [
    {
      title: "Monthly",
      price: "₹999",
      subtitle: "Perfect to get started",
      features: [
        "Unlimited members & receipts",
        "WhatsApp/SMS/Email reminders",
        "Member portal",
        "Basic analytics",
      ],
    },
    {
      title: "Yearly",
      price: "₹799/mo",
      subtitle: "Best value",
      popular: true,
      features: [
        "Everything in Monthly",
        "Priority support",
        "Advanced analytics",
      ],
    },
    {
      title: "Custom",
      price: "Let's Talk",
      subtitle: "For chains & enterprises",
      features: [
        "Multi-location support",
        "Dedicated manager",
        "Custom integrations",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 border-t border-slate-100 dark:border-slate-800"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Flexible Plans
          </h2>
          <p className="text-xl text-muted-foreground">
            Transparent pricing. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`rounded-3xl p-8 border shadow-sm flex flex-col ${
                plan.popular
                  ? "bg-slate-900 text-white scale-105"
                  : "bg-white dark:bg-card"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <p className="opacity-80 mb-6">{plan.subtitle}</p>
              <div className="text-4xl font-bold mb-6">{plan.price}</div>

              <ul className="space-y-3 grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400 mt-2" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
