import React from "react";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact</h1>
            <p className="text-xl text-muted-foreground">
              Nous sommes à votre écoute pour toute question ou demande
              d'information.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent z-0"></div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Adresse</h3>
                  <p className="text-muted-foreground">3 avenue germaine</p>
                  <p className="text-muted-foreground">91170 Vitry-Châtillon</p>
                  <p className="text-muted-foreground mt-2">
                    <span className="font-medium">À proximité de :</span>{" "}
                    Aéroport d'Orly (10 minutes)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                  <p className="text-muted-foreground">06 24 72 48 11</p>
                  <p className="text-muted-foreground mt-2">
                    <span className="font-medium">Disponibilité :</span> 24h/24,
                    7j/7
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    contact@parkaero-direct.fr
                  </p>
                  <p className="text-muted-foreground mt-2">
                    <span className="font-medium">Délai de réponse :</span> Sous
                    24h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Horaires</h3>
                  <p className="text-muted-foreground">
                    Accueil et navette : 24h/24, 7j/7
                  </p>
                  <p className="text-muted-foreground">
                    Service client : 7h - 22h, 7j/7
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Comment nous trouver</h2>
              <div className="bg-card p-4 rounded-xl shadow-md">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  {/* Placeholder for map - in a real implementation, this would be a Google Maps embed */}
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-4">
                      Carte interactive
                    </p>
                    <p className="text-sm text-muted-foreground">
                      3 avenue germaine, 91170 Vitry-Châtillon
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Accès</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">En voiture :</span> Depuis
                    l'A6, prendre la sortie 6 vers Vitry-Châtillon, puis suivre
                    les panneaux "Aéropark Direct".
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      En transport en commun :
                    </span>{" "}
                    RER C jusqu'à Juvisy, puis bus 285 jusqu'à l'arrêt
                    "Germaine".
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <div className="bg-card p-6 rounded-xl shadow-md">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    placeholder="06 XX XX XX XX"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-1"
                  >
                    Sujet
                  </label>
                  <select
                    id="subject"
                    className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">
                      Question sur une réservation
                    </option>
                    <option value="services">
                      Renseignements sur nos services
                    </option>
                    <option value="tarifs">Informations sur les tarifs</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacy"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacy" className="text-muted-foreground">
                      J'accepte que mes données soient traitées conformément à
                      la politique de confidentialité
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-base font-medium shadow-sm hover:bg-primary/90 transition-colors w-full"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="mt-8 bg-card p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">
                    Comment puis-je réserver une place de parking ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez réserver directement sur notre site web en
                    utilisant notre formulaire de réservation, ou par téléphone
                    au 06 24 72 48 11.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    Comment fonctionne la navette ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Notre navette gratuite est disponible 24h/24 et 7j/7. Elle
                    vous dépose directement à votre terminal et vous récupère à
                    votre retour.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    Puis-je modifier ma réservation ?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, vous pouvez modifier votre réservation gratuitement
                    jusqu'à 24 heures avant la date d'arrivée prévue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Besoin d'une réponse rapide ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Notre équipe est disponible 24h/24 et 7j/7 pour répondre à toutes
            vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0624724811"
              className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 text-base font-medium shadow-sm hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Nous appeler
            </a>
            <a
              href="mailto:contact@parkaero-direct.fr"
              className="inline-flex items-center justify-center rounded-md bg-white/20 text-white border border-white/30 px-6 py-3 text-base font-medium shadow-sm hover:bg-white/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Nous envoyer un email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
