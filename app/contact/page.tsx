import React from "react";
import FaqJsonLd from "@/components/faq-json-ld";

export const metadata = {
  title: "Contact",
  description: "Contactez ParkAero Direct : 07 83 82 92 60, 3 avenue Germaine, 91170 Viry-Châtillon. Accueil et navette disponibles 24h/24, 7j/7.",
  alternates: { canonical: "/contact" },
};

const contactFaqs = [
  {
    question: "Comment puis-je réserver une place de parking ?",
    answer: "Vous pouvez réserver directement sur notre site web en utilisant notre formulaire de réservation, ou par téléphone au 07 83 82 92 60.",
  },
  {
    question: "Comment fonctionne la navette ?",
    answer: "Notre navette gratuite est disponible 24h/24 et 7j/7. Elle vous dépose directement à Orly et vous récupère à votre retour.",
  },
  {
    question: "Puis-je modifier ma réservation ?",
    answer: "Oui, vous pouvez modifier votre réservation gratuitement jusqu'à 24 heures avant la date d'arrivée prévue.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-0 w-full">
      <FaqJsonLd faqs={contactFaqs} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0c1821] py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654]"></div>
        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Contactez-nous
            </h1>
            <p className="text-xl text-white/70">
              Nous sommes à votre écoute pour toute question ou demande
              d'information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
                Informations
              </p>
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    <p className="text-muted-foreground">91170 Viry-Châtillon</p>
                    <p className="text-muted-foreground mt-2">
                      <span className="font-medium">À proximité de :</span>{" "}
                      Aéroport d'Orly (10 minutes)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                    <p className="text-muted-foreground">07 83 82 92 60</p>
                    <p className="text-muted-foreground mt-2">
                      <span className="font-medium">Disponibilité :</span> 24h/24,
                      7j/7
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      aeroparkdirect@hotmail.com
                    </p>
                    <p className="text-muted-foreground mt-2">
                      <span className="font-medium">Délai de réponse :</span> Sous
                      24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
                  Localisation
                </p>
                <h2 className="text-2xl font-bold mb-6">Comment nous trouver</h2>
                <div className="bg-card p-4 rounded-2xl shadow-sm">
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5268.287061992424!2d2.3690829250991863!3d48.68362040687684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5df42c1dd152d%3A0xcac7628533f9e691!2s3%20Av.%20Germaine%2C%2091170%20Viry-Ch%C3%A2tillon!5e0!3m2!1sen!2sfr!4v1745943572597!5m2!1sen!2sfr"
                      width="600"
                      height="450"
                      style={{ border: "0" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="text-center p-8">
                      <p className="text-muted-foreground mb-4">
                        Carte interactive
                      </p>
                      <p className="text-sm text-muted-foreground">
                        3 avenue germaine, 91170 Viry-Châtillon
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-semibold">Accès</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">En voiture :</span> Depuis
                      l'A6, prendre la sortie 6 vers Viry-Châtillon, puis suivre
                      les panneaux "ParkAero Direct".
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
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
                Formulaire
              </p>
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <div className="bg-card rounded-2xl shadow-sm p-6">
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
                        className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
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
                        className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
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
                      className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
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
                      className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
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
                      className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
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
                      className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
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
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="mt-8 bg-card rounded-2xl shadow-sm p-6">
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
                      au 0783829260.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      Comment fonctionne la navette ?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Notre navette gratuite est disponible 24h/24 et 7j/7. Elle
                      vous dépose directement à Orly et vous récupère à votre
                      retour.
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0c1821] py-16 md:py-20">
        <div className="container max-w-screen-xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
            Assistance
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Besoin d'une réponse rapide ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
            Notre équipe est disponible 24h/24 et 7j/7 pour répondre à toutes
            vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0783829260"
              className="inline-flex items-center justify-center rounded-xl bg-white text-[#0c1821] px-6 py-3 text-base font-semibold shadow-sm hover:bg-white/90 transition-colors"
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
              href="mailto:aeroparkdirect@hotmail.com"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 px-6 py-3 text-base font-semibold shadow-sm hover:bg-white/20 transition-colors"
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
