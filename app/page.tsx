import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import FeaturesSection from "@/components/features-section";
import ReviewsSection from "@/components/reviews-section";
import PaymentMethods from "@/components/payment-methods";

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
