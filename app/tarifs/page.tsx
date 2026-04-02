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
import FaqJsonLd from "@/components/faq-json-ld";

const tarifsFaqs = [
  {
    question: "Comment sont calculés les tarifs ?",
    answer: "Nos tarifs sont calculés en fonction de la durée de stationnement. Nous proposons des forfaits avantageux pour les séjours courts et longs. Le prix est fixe par tranche de jours, ce qui vous permet de connaître à l'avance le coût exact de votre stationnement.",
  },
  {
    question: "Y a-t-il des frais supplémentaires ?",
    answer: "Non, il n'y a pas de frais cachés. Le prix affiché inclut tous les services de base comme la navette gratuite et la sécurité 24h/24. Seuls les services additionnels optionnels (lavage, contrôle technique, etc.) sont facturés en supplément.",
  },
  {
    question: "Puis-je modifier ma réservation ?",
    answer: "Oui, vous pouvez modifier votre réservation gratuitement jusqu'à 24 heures avant la date d'arrivée prévue. Au-delà, des frais de modification peuvent s'appliquer. Contactez notre service client pour plus d'informations.",
  },
  {
    question: "Proposez-vous des tarifs spéciaux pour les clients réguliers ?",
    answer: "Oui, nous proposons un programme de fidélité pour nos clients réguliers. Après 5 réservations, vous bénéficiez automatiquement d'une réduction de 10% sur vos prochaines réservations. Contactez-nous pour plus d'informations sur notre programme de fidélité.",
  },
];

export const metadata = {
  title: "Tarifs",
  description: "Consultez les tarifs de stationnement ParkAero Direct près d'Orly. Forfaits compétitifs, navette gratuite incluse, sans frais cachés. Calculez votre devis en ligne.",
  alternates: { canonical: "/tarifs" },
};

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
    <div className="flex flex-col gap-0 w-full">
      <FaqJsonLd faqs={tarifsFaqs} />
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#0c1821] py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654]" />
        <div className="relative z-10 container max-w-screen-xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              Tarifs
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Nos Tarifs
            </h1>
            <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-xl">
              Des tarifs transparents et compétitifs pour tous vos besoins de
              stationnement.
            </p>
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              Grille tarifaire
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              Tarifs ParkAero Direct
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Consultez nos tarifs en fonction de la durée de votre séjour. Tous
              nos forfaits incluent l&apos;accès à notre navette gratuite 24h/24
              et 7j/7.
            </p>
          </div>

          {/* Display the pricing table */}
          <div className="mb-12">
            {pricingData.length > 0 &&
            pricingData[0].duration_prices &&
            pricingData[0].duration_prices.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                        <h3 className="text-xl font-bold text-center">
                          Jours 1-20
                        </h3>
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="py-2 text-left text-sm font-semibold text-foreground">
                                Jours
                              </th>
                              <th className="py-2 text-right text-sm font-semibold text-foreground">
                                Tarifs (euros)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pricingData[0].duration_prices
                              .filter((dp) => dp.duration_days <= 20)
                              .sort((a, b) => a.duration_days - b.duration_days)
                              .map((dp) => (
                                <tr
                                  key={dp.id}
                                  className="border-b border-border/50"
                                >
                                  <td className="py-2 text-sm text-muted-foreground">
                                    {dp.duration_days}
                                  </td>
                                  <td className="py-2 text-right text-sm font-semibold text-foreground">
                                    {dp.price}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                        <h3 className="text-xl font-bold text-center">
                          Jours 21-31
                        </h3>
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="py-2 text-left text-sm font-semibold text-foreground">
                                Jours
                              </th>
                              <th className="py-2 text-right text-sm font-semibold text-foreground">
                                Tarifs (euros)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pricingData[0].duration_prices
                              .filter((dp) => dp.duration_days > 20)
                              .sort((a, b) => a.duration_days - b.duration_days)
                              .map((dp) => (
                                <tr
                                  key={dp.id}
                                  className="border-b border-border/50"
                                >
                                  <td className="py-2 text-sm text-muted-foreground">
                                    {dp.duration_days}
                                  </td>
                                  <td className="py-2 text-right text-sm font-semibold text-foreground">
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
                    className={`bg-card rounded-2xl shadow-sm overflow-hidden relative ${
                      plan.popular
                        ? "ring-2 ring-cyan-500"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-1 text-xs font-medium rounded-bl-xl">
                        Populaire
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {plan.duration}
                      </p>
                      <div className="flex items-baseline mb-6">
                        <span className="text-3xl font-extrabold text-foreground">
                          {plan.price}&euro;
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          pour {plan.base_duration_days} jours
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>
                          +{plan.additional_day_price}&euro; par jour
                          suppl&eacute;mentaire
                        </p>
                        <p>Frais de retard: {plan.late_fee}&euro;</p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map(
                          (feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
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
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                      <a
                        href="/#reservation"
                        className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                          plan.popular
                            ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        R&eacute;server maintenant
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="relative py-16 md:py-20 bg-[#0c1821]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654]" />
        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              Options
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Services additionnels
            </h2>
            <p className="text-sm text-white/45 max-w-2xl mx-auto leading-relaxed">
              Am&eacute;liorez votre exp&eacute;rience avec nos services
              compl&eacute;mentaires disponibles sur demande.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service: OptionData) => (
              <div
                key={service.id}
                className="flex justify-between items-center bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 transition-colors hover:bg-white/[0.06]"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xl font-extrabold text-cyan-300">
                    {service.price}&euro;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-screen-xl mx-auto px-6">
          <PricingCalculator
            pricingPlans={pricingData}
            options={additionalServices}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 mb-1">
              FAQ
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Questions fr&eacute;quentes sur les tarifs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-card p-6 rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-2">
                Comment sont calcul&eacute;s les tarifs ?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nos tarifs sont calcul&eacute;s en fonction de la dur&eacute;e de
                stationnement. Nous proposons des forfaits avantageux pour les
                s&eacute;jours courts et longs. Le prix est fixe par tranche de
                jours, ce qui vous permet de conna&icirc;tre &agrave;
                l&apos;avance le co&ucirc;t exact de votre stationnement.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-2">
                Y a-t-il des frais suppl&eacute;mentaires ?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Non, il n&apos;y a pas de frais cach&eacute;s. Le prix
                affich&eacute; inclut tous les services de base comme la navette
                gratuite et la s&eacute;curit&eacute; 24h/24. Seuls les services
                additionnels optionnels (lavage, contr&ocirc;le technique, etc.)
                sont factur&eacute;s en suppl&eacute;ment.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-2">
                Puis-je modifier ma r&eacute;servation ?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Oui, vous pouvez modifier votre r&eacute;servation gratuitement
                jusqu&apos;&agrave; 24 heures avant la date d&apos;arriv&eacute;e
                pr&eacute;vue. Au-del&agrave;, des frais de modification peuvent
                s&apos;appliquer. Contactez notre service client pour plus
                d&apos;informations.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-2">
                Proposez-vous des tarifs sp&eacute;ciaux pour les clients
                r&eacute;guliers ?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Oui, nous proposons un programme de fid&eacute;lit&eacute; pour
                nos clients r&eacute;guliers. Apr&egrave;s 5
                r&eacute;servations, vous b&eacute;n&eacute;ficiez
                automatiquement d&apos;une r&eacute;duction de 10% sur vos
                prochaines r&eacute;servations. Contactez-nous pour plus
                d&apos;informations sur notre programme de
                fid&eacute;lit&eacute;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 bg-[#0c1821]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1821] via-[#122336] to-[#0e3654]" />
        <div className="relative z-10 container max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Pr&ecirc;t &agrave; r&eacute;server votre place ?
          </h2>
          <p className="text-base text-white/55 mb-8 max-w-2xl mx-auto leading-relaxed">
            R&eacute;servez d&egrave;s maintenant pour b&eacute;n&eacute;ficier
            de nos tarifs avantageux et de nos services premium.
          </p>
          <a
            href="/#reservation"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 text-base font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            R&eacute;server maintenant
          </a>
        </div>
      </section>
    </div>
  );
}
