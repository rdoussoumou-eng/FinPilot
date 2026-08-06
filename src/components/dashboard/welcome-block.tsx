const QUOTES = [
  "Ne comptez pas les jours, faites que les jours comptent.",
  "Un franc économisé est un franc gagné.",
  "La discipline d'aujourd'hui est la liberté de demain.",
];

function greeting(hour: number) {
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

/** ~60px tall on desktop — a third of the previous hero block's footprint. */
export function WelcomeBlock({ name = "Roland" }: { name?: string }) {
  const now = new Date();
  const quote = QUOTES[now.getDate() % QUOTES.length];

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-navy to-navy-soft px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-bold">
          {greeting(now.getHours())}, {name}
          <span aria-hidden className="ml-1.5 inline-block">👋</span>
        </h2>
        <p className="mt-0.5 text-[13px] text-white/65">
          {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>
      <p className="font-display text-[13.5px] italic text-gold-soft sm:max-w-[38ch] sm:text-right">
        « {quote} »
      </p>
    </section>
  );
}
