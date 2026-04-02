export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ParkingFacility"],
        "@id": "https://www.aeroparkdirect.com/#business",
        name: "ParkAero Direct",
        description:
          "Parking sécurisé à proximité de l'aéroport d'Orly avec navette gratuite 24h/24 et 7j/7.",
        url: "https://www.aeroparkdirect.com",
        telephone: "+33783829260",
        email: "aeroparkdirect@hotmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "3 avenue Germaine",
          addressLocality: "Viry-Châtillon",
          postalCode: "91170",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 48.6836,
          longitude: 2.3691,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "1450",
          bestRating: "5",
        },
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Visa, Mastercard, CB",
        amenityFeature: [
          {
            "@type": "LocationFeatureSpecification",
            name: "Navette gratuite aéroport",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Vidéosurveillance 24h/24",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Portail sécurisé",
            value: true,
          },
        ],
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: 48.7262,
            longitude: 2.3652,
          },
          geoRadius: "15000",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.aeroparkdirect.com/#website",
        url: "https://www.aeroparkdirect.com",
        name: "ParkAero Direct",
        inLanguage: "fr-FR",
        publisher: {
          "@id": "https://www.aeroparkdirect.com/#business",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
