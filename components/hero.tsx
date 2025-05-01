import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/hero-background.jpg')",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          ParkAero Direct
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
          Réservez votre parking situé à moins de 10 minutes de l&apos;aéroport
          avec navette gratuite 24h/24 – 7j/7.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-md"
          >
            <Link href="#reservation">Réserver maintenant</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
