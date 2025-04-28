import Hero from "@/components/hero";
import ReservationForm from "@/components/reservation-form";
import FeaturesSection from "@/components/features-section";
import ReviewsSection from "@/components/reviews-section";
import PaymentMethods from "@/components/payment-methods";

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="-mt-24 relative z-20 px-4 mb-16">
        <ReservationForm />
      </div>
      <main className="flex-1 flex flex-col">
        <FeaturesSection />
        <ReviewsSection />
        <PaymentMethods />
      </main>
    </>
  );
}
