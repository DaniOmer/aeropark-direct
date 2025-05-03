import React from "react";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos services de stationnement premium pour votre voyage
              en toute sérénité.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent z-0"></div>
      </section>

      {/* Main Services Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Service 1 */}
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
                  className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
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
      </section>

      {/* Process Section */}
      <section className="bg-secondary py-16 rounded-2xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card p-8 rounded-xl shadow-md flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Réservez en ligne</h3>
              <p className="text-muted-foreground">
                Réservez votre place de parking en quelques clics sur notre site
                web. Recevez une confirmation immédiate par email.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card p-8 rounded-xl shadow-md flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Garez votre véhicule</h3>
              <p className="text-muted-foreground">
                À votre arrivée, présentez votre confirmation à l'accueil. Notre
                équipe vous guidera vers votre place de stationnement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card p-8 rounded-xl shadow-md flex flex-col items-center text-center relative">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">
                Navette vers l'aéroport
              </h3>
              <p className="text-muted-foreground">
                Montez dans notre navette gratuite qui vous déposera directement
                à Orly. À votre retour, appelez-nous et nous viendrons vous
                chercher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à réserver votre place ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Réservez dès maintenant pour bénéficier de nos tarifs avantageux et
            de nos services premium.
          </p>
          <a
            href="/#reservation"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 text-base font-medium shadow-sm hover:bg-gray-100 transition-colors"
          >
            Réserver maintenant
          </a>
        </div>
      </section>
    </div>
  );
}
