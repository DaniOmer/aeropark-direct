import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import FeaturesSection from "@/components/features-section";
import ReviewsSection from "@/components/reviews-section";
import PaymentMethods from "@/components/payment-methods";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "ParkAero Direct | Parking aéroport Orly pas cher avec navette gratuite",
  description:
    "Parking sécurisé à moins de 10 minutes de l'aéroport d'Orly avec navette gratuite 24h/24 – 7j/7. Tarifs à partir de 29,90€. Vidéosurveillance, réservation en ligne en 30 secondes.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col">
        <HowItWorks />
        <FeaturesSection />
        <ReviewsSection />
        <PaymentMethods />
      </main>
    </>
  );
}
