import React from "react";

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Vidéosurveillance 24h/24",
    description:
      "Caméras HD + présence humaine permanente sur site, jour et nuit.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "Accès sécurisé par portail",
    description:
      "Portail automatique contrôlé. Votre véhicule est à l'abri des menaces extérieures.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    title: "Navette gratuite incluse",
    description:
      "Transfert aller-retour offert vers Orly. Disponible 24h/24, 7j/7, sans supplément.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 bg-[#0c1821]">
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_60%] gap-10 lg:gap-[5%] items-center">
          {/* Left — text */}
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              Nos engagements
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
              Pourquoi nous
              <br />
              faire confiance
            </h2>
            <p className="text-sm text-white/45 leading-relaxed">
              Chaque détail est pensé pour que vous partiez l&apos;esprit léger
              et retrouviez votre véhicule en parfait état.
            </p>
          </div>

          {/* Right — features list */}
          <div className="flex flex-col gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 transition-colors hover:bg-white/[0.06]"
              >
                <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
