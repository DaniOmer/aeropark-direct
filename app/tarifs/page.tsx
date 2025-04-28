import React from "react";

// Static pricing data
const pricingData = [
  {
    id: 1,
    name: "Journée",
    duration: "1 jour",
    price: 15.99,
    features: [
      "Parking sécurisé 24h/24",
      "Navette gratuite",
      "Réservation modifiable",
    ],
  },
  {
    id: 2,
    name: "Week-end",
    duration: "2-3 jours",
    price: 39.99,
    features: [
      "Parking sécurisé 24h/24",
      "Navette gratuite",
      "Réservation modifiable",
      "Assistance prioritaire",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Semaine",
    duration: "4-7 jours",
    price: 69.99,
    features: [
      "Parking sécurisé 24h/24",
      "Navette gratuite",
      "Réservation modifiable",
      "Assistance prioritaire",
      "Place de parking préférentielle",
    ],
  },
  {
    id: 4,
    name: "Longue durée",
    duration: "8-14 jours",
    price: 99.99,
    features: [
      "Parking sécurisé 24h/24",
      "Navette gratuite",
      "Réservation modifiable",
      "Assistance prioritaire",
      "Place de parking préférentielle",
      "Vérification hebdomadaire du véhicule",
    ],
  },
];

// Additional services
const additionalServices = [
  {
    id: 1,
    name: "Lavage extérieur",
    price: 19.99,
    description: "Nettoyage complet de l'extérieur de votre véhicule",
  },
  {
    id: 2,
    name: "Lavage intérieur",
    price: 29.99,
    description: "Nettoyage complet de l'intérieur de votre véhicule",
  },
  {
    id: 3,
    name: "Lavage complet",
    price: 44.99,
    description: "Nettoyage complet intérieur et extérieur",
  },
  {
    id: 4,
    name: "Contrôle technique",
    price: 79.99,
    description:
      "Vérification complète de votre véhicule pendant votre absence",
  },
];

export default function TarifsPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative bg-secondary py-20 rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Tarifs</h1>
            <p className="text-xl text-muted-foreground">
              Des tarifs transparents et compétitifs pour tous vos besoins de
              stationnement.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent z-0"></div>
      </section>

      {/* Main Pricing Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Forfaits de stationnement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à la durée de votre voyage.
            Tous nos forfaits incluent l'accès à notre navette gratuite 24h/24
            et 7j/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingData.map((plan) => (
            <div
              key={plan.id}
              className={`bg-card rounded-xl shadow-md overflow-hidden relative ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium">
                  Populaire
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.duration}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold">{plan.price}€</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
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
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/"
                  className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  } transition-colors`}
                >
                  Réserver maintenant
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="bg-secondary py-16 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Services additionnels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Améliorez votre expérience avec nos services complémentaires
              disponibles sur demande.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalServices.map((service) => (
              <div
                key={service.id}
                className="bg-card p-6 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold mb-1">{service.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold mb-2">{service.price}€</p>
                  <button className="text-primary text-sm font-medium hover:underline">
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="container mx-auto px-4">
        <div className="bg-card p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Calculateur de tarif</h2>
          <p className="text-muted-foreground mb-8">
            Pour obtenir un devis précis, veuillez utiliser notre calculateur de
            tarif en ligne. Entrez simplement vos dates d'arrivée et de départ
            pour connaître le prix exact de votre stationnement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="arrival-date"
                  className="block text-sm font-medium mb-1"
                >
                  Date d'arrivée
                </label>
                <input
                  type="date"
                  id="arrival-date"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="arrival-time"
                  className="block text-sm font-medium mb-1"
                >
                  Heure d'arrivée
                </label>
                <select
                  id="arrival-time"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Sélectionnez une heure</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label
                  htmlFor="departure-date"
                  className="block text-sm font-medium mb-1"
                >
                  Date de départ
                </label>
                <input
                  type="date"
                  id="departure-date"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="departure-time"
                  className="block text-sm font-medium mb-1"
                >
                  Heure de départ
                </label>
                <select
                  id="departure-time"
                  className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Sélectionnez une heure</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-base font-medium shadow-sm hover:bg-primary/90 transition-colors">
              Calculer le tarif
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold mb-8">
          Questions fréquentes sur les tarifs
        </h2>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              Comment sont calculés les tarifs ?
            </h3>
            <p className="text-muted-foreground">
              Nos tarifs sont calculés en fonction de la durée de stationnement.
              Nous proposons des forfaits avantageux pour les séjours courts et
              longs. Le prix est fixe par tranche de jours, ce qui vous permet
              de connaître à l'avance le coût exact de votre stationnement.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              Y a-t-il des frais supplémentaires ?
            </h3>
            <p className="text-muted-foreground">
              Non, il n'y a pas de frais cachés. Le prix affiché inclut tous les
              services de base comme la navette gratuite et la sécurité 24h/24.
              Seuls les services additionnels optionnels (lavage, contrôle
              technique, etc.) sont facturés en supplément.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              Puis-je modifier ma réservation ?
            </h3>
            <p className="text-muted-foreground">
              Oui, vous pouvez modifier votre réservation gratuitement jusqu'à
              24 heures avant la date d'arrivée prévue. Au-delà, des frais de
              modification peuvent s'appliquer. Contactez notre service client
              pour plus d'informations.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">
              Proposez-vous des tarifs spéciaux pour les clients réguliers ?
            </h3>
            <p className="text-muted-foreground">
              Oui, nous proposons un programme de fidélité pour nos clients
              réguliers. Après 5 réservations, vous bénéficiez automatiquement
              d'une réduction de 10% sur vos prochaines réservations.
              Contactez-nous pour plus d'informations sur notre programme de
              fidélité.
            </p>
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
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 text-base font-medium shadow-sm hover:bg-gray-100 transition-colors"
          >
            Réserver maintenant
          </a>
        </div>
      </section>
    </div>
  );
}
