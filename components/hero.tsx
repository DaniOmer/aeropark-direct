import ReservationForm from "./reservation-form";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0c1821]">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-24 -right-16 w-80 h-80 bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,transparent_70%)] rounded-full" />
      <div className="absolute -bottom-12 left-[20%] w-48 h-48 bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] rounded-full" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654]" />

      <div className="relative z-10 container max-w-screen-xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-8 lg:gap-[5%] items-center">
          {/* Left — content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-cyan-500/12 border border-cyan-500/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
              <span className="text-cyan-200 text-xs font-medium">
                Navette gratuite 24h/24 &middot; 7j/7
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight mb-4">
              Garez-vous
              <br />
              l&apos;esprit{" "}
              <span className="text-cyan-300">tranquille</span>
            </h1>

            <p className="text-white/55 text-base md:text-lg leading-relaxed mb-8 max-w-[85%]">
              Parking sécurisé à 10 min d&apos;Orly. Navette gratuite incluse.
              Tarifs jusqu&apos;à 40% moins chers que le parking aéroport.
            </p>

            {/* Key figures pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-2xl font-extrabold text-cyan-300">
                  5/5
                </span>
                <span className="text-[11px] text-white/45 leading-tight">
                  +200
                  <br />
                  avis
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-2xl font-extrabold text-cyan-300">
                  10
                </span>
                <span className="text-[11px] text-white/45 leading-tight">
                  minutes
                  <br />
                  d&apos;Orly
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-2xl font-extrabold text-cyan-300">
                  24<span className="text-base">/7</span>
                </span>
                <span className="text-[11px] text-white/45 leading-tight">
                  surveillance
                  <br />&amp; navette
                </span>
              </div>
            </div>
          </div>

          {/* Right — reservation form */}
          <div>
            <ReservationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
