import React from "react";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Accessible, sécurisé et efficace
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Parking Surveillé */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">PARKING SURVEILLÉ</h3>
            <p className="text-gray-600 mb-4">
              Parking sous{" "}
              <span className="font-semibold">vidéosurveillance constante</span>{" "}
              avec présence humaine 24h/7j.
            </p>
            <p className="text-gray-600">
              L&apos;accès au parking est régulé par un portail automatique,
              évitant ainsi d&apos;exposer votre véhicule aux menaces
              extérieures.
            </p>
          </div>

          {/* Feature 2: Accessibilité */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
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
            <h3 className="text-xl font-bold mb-4">ACCESSIBILITÉ</h3>
            <p className="text-gray-600 mb-4">
              À <span className="font-semibold">quelques minutes</span> de
              l&apos;aéroport, avec transfert rapide vers votre terminal.
            </p>
            <p className="text-gray-600">
              Notre emplacement stratégique vous permet d&apos;accéder
              facilement à l&apos;aéroport tout en bénéficiant de tarifs
              avantageux.
            </p>
          </div>

          {/* Feature 3: Navette Offerte */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
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
            <h3 className="text-xl font-bold mb-4">NAVETTE OFFERTE</h3>
            <p className="text-gray-600 mb-4">
              Les trajets en{" "}
              <span className="font-semibold">
                navette vers et depuis l&apos;aéroport
              </span>{" "}
              sont offerts.
            </p>
            <p className="text-gray-600">
              Nos navettes confortables vous déposent directement à votre
              terminal et vous récupèrent à votre retour, sans frais
              supplémentaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
