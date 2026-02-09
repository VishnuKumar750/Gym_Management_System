export function LandingContact() {
  return (
    <section
      id="contact"
      className="py-32 border-t border-slate-100 dark:border-slate-800"
    >
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">Let’s talk</h2>
          <p className="text-xl text-muted-foreground">
            Drop us a message — we reply fast.
          </p>
        </div>

        <form className="space-y-8">
          {["name", "email"].map((field) => (
            <input
              key={field}
              placeholder={field.toUpperCase()}
              className="w-full px-5 py-4 rounded-xl border"
              required
            />
          ))}

          <textarea
            rows={5}
            placeholder="How can we help you?"
            className="w-full px-5 py-4 rounded-xl border"
            required
          />

          <button className="w-full bg-slate-900 text-white rounded-full py-4">
            Send Message →
          </button>
        </form>
      </div>
    </section>
  );
}
