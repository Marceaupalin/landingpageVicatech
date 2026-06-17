import VideoTabs from "./components/VideoTabs";
import LeadForm from "./components/LeadForm";

const STEPS = [
  {
    num: "01",
    title: "RaaS sans investissement",
    desc: "Le robot est intégré au contrat de service. Vous payez à l'usage, sans immobilisation de capital.",
  },
  {
    num: "02",
    title: "Multi-marques, multi-terrains",
    desc: "Nous choisissons le robot adapté à votre site: largeur d'allée, surface, environnement. Pas l'inverse.",
  },
  {
    num: "03",
    title: "Vos équipes montent en valeur",
    desc: "Le robot prend les tâches répétitives. Vos collaborateurs se concentrent sur ce que les machines ne font pas. Conforme aux conventions collectives.",
  },
];

export default function Home() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

  return (
    <main className="min-h-screen bg-cream font-sans">

      {/* ────────────────────────────────────────────
          HERO
      ──────────────────────────────────────────── */}
      <section className="px-4 pt-12 pb-16 max-w-lg mx-auto">

        {/* Logo wordmark */}
        <div className="mb-10">
          <span className="text-3xl font-black tracking-tight text-navy">eli</span>
          <span className="text-3xl font-black tracking-tight text-coral">o</span>
        </div>

        {/* Accroche principale */}
        <h1 className="text-[1.75rem] leading-snug font-bold text-navy">
          Elio déploie des robots de service en RaaS multi-marques pour les
          métiers de la propreté, la logistique et l&apos;hôtellerie.
        </h1>

        {/* Phrase de positionnement */}
        <p className="mt-5 text-lg text-navy/70 font-medium leading-relaxed">
          Nos robots augmentent vos équipes, ils ne les remplacent jamais.
        </p>

        {/* CTA principal */}
        <a
          href="#formulaire"
          className="mt-8 flex items-center justify-center w-full bg-coral text-white text-lg font-semibold rounded-2xl min-h-[56px] px-6 active:opacity-90 transition-opacity"
        >
          Être recontacté
        </a>
      </section>

      {/* ────────────────────────────────────────────
          VIDEO DEMO avec onglets par secteur
      ──────────────────────────────────────────── */}
      <section className="px-4 pb-16 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-navy mb-5">
          Elio en action
        </h2>
        <VideoTabs />
      </section>

      {/* ────────────────────────────────────────────
          COMMENT CA MARCHE
      ──────────────────────────────────────────── */}
      <section className="bg-navy/[0.04] px-4 py-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-navy">Comment ça marche</h2>

          <div className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-5">
                {/* Numéro en grand, couleur atténuée */}
                <span className="text-4xl font-black text-coral/25 leading-none mt-0.5 w-10 shrink-0 tabular-nums">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-navy text-base">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-navy/60 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          FORMULAIRE DE QUALIFICATION
      ──────────────────────────────────────────── */}
      <section id="formulaire" className="px-4 py-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-navy">Être recontacté</h2>
          <p className="mt-2 text-navy/55 text-sm leading-relaxed">
            Remplissez ce formulaire. Nous reviendrons vers vous sous 24h.
          </p>
          <div className="mt-8">
            <LeadForm calendlyUrl={calendlyUrl} />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          BLOC RDV DIRECT
      ──────────────────────────────────────────── */}
      <section className="bg-navy px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-semibold text-cream">
            Vous préférez réserver directement ?
          </h2>
          <p className="mt-3 text-cream/55 text-sm leading-relaxed">
            Choisissez un créneau dans l&apos;agenda d&apos;Elio.
          </p>

          {calendlyUrl ? (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center w-full bg-coral text-white text-base font-semibold rounded-2xl min-h-[56px] px-6 active:opacity-90 transition-opacity"
            >
              Prendre rendez-vous
            </a>
          ) : (
            <p className="mt-8 text-cream/30 text-sm">
              Lien de réservation disponible prochainement.
            </p>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────
          FOOTER
      ──────────────────────────────────────────── */}
      <footer className="px-4 py-10 border-t border-navy/10 bg-cream">
        <div className="max-w-lg mx-auto space-y-2">
          <p className="font-black text-navy tracking-tight">
            eli<span className="text-coral">o</span>
          </p>
          <p className="text-sm text-navy/45">Demande VivaTech 2026</p>
          <a
            href="mailto:contact@elio-robot.fr"
            className="block text-sm text-coral underline underline-offset-2"
          >
            contact@elio-robot.fr
          </a>
          <p className="text-xs text-navy/30 pt-2 leading-relaxed">
            Vos données ne sont utilisées qu&apos;à des fins de contact
            commercial. Aucune diffusion à des tiers.
          </p>
        </div>
      </footer>

    </main>
  );
}
