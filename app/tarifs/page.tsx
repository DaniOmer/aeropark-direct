import React from "react";
import {
  getPricingData,
  getActiveOptionsData,
  getDurationPrices,
  type PriceData,
  type OptionData,
  type DurationPriceData,
} from "../actions";
import { UIPricingPlan, UIDurationPrice } from "./types";
import PricingCalculator from "@/components/pricing-calculator";

// Function to transform pricing data from database to UI format
const transformPricingData = async (
  prices: PriceData[]
): Promise<UIPricingPlan[]> => {
  // Default features for all plans
  const baseFeatures = [
    "Parking sécurisé 24h/24",
    "Navette gratuite",
    "Réservation modifiable",
  ];

  // If no pricing data is available, return default plans
  if (!prices || prices.length === 0) {
    return [
      {
        id: "1",
        name: "Forfait Standard",
        duration: "1-4 jours",
        price: 39.99,
        features: baseFeatures,
        base_duration_days: 4,
        additional_day_price: 10,
        late_fee: 15,
        popular: false,
      },
    ];
  }

  // Sort prices by base_duration_days to ensure logical order
  const sortedPrices = [...prices].sort(
    (a, b) => a.base_duration_days - b.base_duration_days
  );

  // Create an array to hold the transformed pricing plans
  const pricingPlans: UIPricingPlan[] = [];

  // Transform each price into a UI pricing plan
  for (const price of sortedPrices) {
    // Determine plan name and duration based on base_duration_days
    let name, duration;
    let additionalFeatures = [];
    let popular = false;

    if (price.base_duration_days <= 1) {
      name = "Journée";
      duration = "1 jour";
    } else if (price.base_duration_days <= 3) {
      name = "Week-end";
      duration = "2-3 jours";
      additionalFeatures.push("Assistance prioritaire");
      popular = true;
    } else if (price.base_duration_days <= 7) {
      name = "Semaine";
      duration = `1-${price.base_duration_days} jours`;
      additionalFeatures.push(
        "Assistance prioritaire"
        // "Place de parking préférentielle"
      );
    } else {
      name = "Longue durée";
      duration = `${price.base_duration_days}+ jours`;
      additionalFeatures.push(
        "Assistance prioritaire",
        // "Place de parking préférentielle",
        "Vérification hebdomadaire du véhicule"
      );
    }

    // Fetch duration prices for this price
    const durationPrices = await getDurationPrices(price.id);

    // Transform duration prices to UI format
    const uiDurationPrices: UIDurationPrice[] = durationPrices.map((dp) => ({
      id: dp.id,
      duration_days: dp.duration_days,
      price: dp.price,
    }));

    pricingPlans.push({
      id: price.id,
      name,
      duration,
      price: price.base_price,
      features: [...baseFeatures, ...additionalFeatures],
      base_duration_days: price.base_duration_days,
      additional_day_price: price.additional_day_price,
      late_fee: price.late_fee,
      popular,
      duration_prices: uiDurationPrices,
    });
  }

  return pricingPlans;
};

// Fetch pricing data from the database
async function getPricingPlans() {
  const prices = await getPricingData();
  return await transformPricingData(prices);
}

// Fetch active options data from the database
async function getOptions() {
  // Use the new function that already filters for active options
  return await getActiveOptionsData();
}

export default async function TarifsPage() {
  const pricingData = await getPricingPlans();
  const additionalServices = await getOptions();
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
          <h2 className="text-3xl font-bold mb-4">Tarifs ParkAero Direct</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Consultez nos tarifs en fonction de la durée de votre séjour. Tous
            nos forfaits incluent l'accès à notre navette gratuite 24h/24 et
            7j/7.
          </p>
        </div>

        {/* Display the pricing table */}
        <div className="mb-12">
          {pricingData.length > 0 &&
          pricingData[0].duration_prices &&
          pricingData[0].duration_prices.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-8 max-w-4xl">
                  <div className="bg-card rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-primary text-primary-foreground">
                      <h3 className="text-xl font-bold text-center">
                        Jours 1-20
                      </h3>
                    </div>
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-left">Jours</th>
                            <th className="py-2 text-right">Tarifs (euros)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricingData[0].duration_prices
                            .filter((dp) => dp.duration_days <= 20)
                            .sort((a, b) => a.duration_days - b.duration_days)
                            .map((dp) => (
                              <tr key={dp.id} className="border-b">
                                <td className="py-2">{dp.duration_days}</td>
                                <td className="py-2 text-right font-semibold">
                                  {dp.price}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-primary text-primary-foreground">
                      <h3 className="text-xl font-bold text-center">
                        Jours 21-31
                      </h3>
                    </div>
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-left">Jours</th>
                            <th className="py-2 text-right">Tarifs (euros)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricingData[0].duration_prices
                            .filter((dp) => dp.duration_days > 20)
                            .sort((a, b) => a.duration_days - b.duration_days)
                            .map((dp) => (
                              <tr key={dp.id} className="border-b">
                                <td className="py-2">{dp.duration_days}</td>
                                <td className="py-2 text-right font-semibold">
                                  {dp.price}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                      <span className="text-sm text-muted-foreground ml-2">
                        pour {plan.base_duration_days} jours
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>
                        +{plan.additional_day_price}€ par jour supplémentaire
                      </p>
                      <p>Frais de retard: {plan.late_fee}€</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature: string, index: number) => (
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
                      href="/#reservation"
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
          )}
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
            {additionalServices.map((service: OptionData) => (
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
                  {/* <button className="text-primary text-sm font-medium hover:underline">
                    Ajouter
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="container mx-auto px-4">
        <PricingCalculator
          pricingPlans={pricingData}
          options={additionalServices}
        />
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
