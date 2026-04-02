import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ParkAero Direct",
    short_name: "ParkAero",
    description:
      "Parking sécurisé près d'Orly avec navette gratuite 24h/24.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1821",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
