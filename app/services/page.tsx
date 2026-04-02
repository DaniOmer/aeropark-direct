import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Nos services",
  description: "Parking sécurisé avec vidéosurveillance 24h/24, navette gratuite vers Orly, réservation flexible et services additionnels. Découvrez tous nos services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-0 w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0c1821] bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654] py-16 md:py-20 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-4">
              Nos Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Nos Services
            </h1>
            <p className="text-xl text-white/70">
              Découvrez nos services de stationnement premium pour votre voyage
              en toute sérénité.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Service 1 */}
            <div className="bg-card rounded-2xl p-8 flex flex-col gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-400"
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
              </div>
              <h2 className="text-2xl font-bold">Parking Sécurisé</h2>
              <p className="text-muted-foreground">
                Notre parking est entièrement sécurisé avec vidéosurveillance
                24h/24 et 7j/7. Votre véhicule est protégé par un système d'accès
                contrôlé et une présence humaine permanente sur site.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Vidéosurveillance 24h/24 et 7j/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Portail sécurisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personnel présent sur site 24h/24</span>
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-card rounded-2xl p-8 flex flex-col gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-400"
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
              </div>
              <h2 className="text-2xl font-bold">Navette Gratuite</h2>
              <p className="text-muted-foreground">
                Notre service de navette gratuite vous emmène directement à Orly
                et vous récupère à votre retour. Disponible 24h/24 et 7j/7, notre
                navette assure un transfert rapide et confortable.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Transfert gratuit vers Orly</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Disponible 24h/24 et 7j/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Temps de trajet moyen de 10 minutes</span>
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-card rounded-2xl p-8 flex flex-col gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Réservation Flexible</h2>
              <p className="text-muted-foreground">
                Notre système de réservation en ligne vous permet de planifier
                votre stationnement à l'avance avec une grande flexibilité.
                Modifiez ou annulez votre réservation facilement selon vos
                besoins.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Réservation en ligne 24h/24</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Modification possible jusqu'à 24h avant l'arrivée</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Confirmation immédiate par email</span>
                </li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="bg-card rounded-2xl p-8 flex flex-col gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Services Additionnels</h2>
              <p className="text-muted-foreground">
                Nous proposons des services complémentaires pour rendre votre
                expérience encore plus agréable. Profitez de nos options
                supplémentaires pour un confort optimal.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Lavage de voiture pendant votre absence</span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Contrôle technique de votre véhicule</span>
                </li> */}
                <li className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Assistance en cas de batterie déchargée</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#0c1821] bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654] py-16 md:py-20 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-[-80px] left-[50%] w-[350px] h-[350px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-40px] w-[250px] h-[250px] rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />

        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-4">
              Le processus
            </p>
            <h2 className="text-3xl font-bold text-white">
              Comment ça marche
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-8 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Réservez en ligne</h3>
              <p className="text-white/60">
                Réservez votre place de parking en quelques clics sur notre site
                web. Recevez une confirmation immédiate par email.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-8 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Garez votre véhicule</h3>
              <p className="text-white/60">
                À votre arrivée, présentez votre confirmation à l'accueil. Notre
                équipe vous guidera vers votre place de stationnement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-8 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Navette vers l'aéroport
              </h3>
              <p className="text-white/60">
                Montez dans notre navette gratuite qui vous déposera directement
                à Orly. À votre retour, appelez-nous et nous viendrons vous
                chercher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0c1821] py-16 md:py-20">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Prêt à réserver votre place ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
              Réservez dès maintenant pour bénéficier de nos tarifs avantageux et
              de nos services premium.
            </p>
            <a
              href="/#reservation"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 text-base font-medium shadow-sm hover:opacity-90 transition-opacity"
            >
              Réserver maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
