import React from "react";

const steps = [
  {
    number: "1",
    title: "Réservez",
    description: "En ligne, en 30 secondes",
  },
  {
    number: "2",
    title: "Déposez",
    description: "Parking sécurisé 24h/24",
  },
  {
    number: "3",
    title: "Navette",
    description: "Transfert gratuit, 10 min",
  },
  {
    number: "4",
    title: "Récupérez",
    description: "On vous ramène au parking",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8 md:mb-10 gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
              Comment ça marche
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Voyagez sereinement
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">4 étapes simples</p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-stretch">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex-1 relative ${i > 0 ? "border-l border-border pl-5" : ""} ${i < steps.length - 1 ? "pr-5" : ""}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-extrabold shrink-0">
                  {step.number}
                </div>
                <span className="text-sm font-bold text-foreground">
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground ml-11">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <span className="absolute right-0 top-2.5 text-border text-lg">
                  ›
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-extrabold shrink-0">
                {step.number}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
