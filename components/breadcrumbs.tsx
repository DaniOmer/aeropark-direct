"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathNames: Record<string, string> = {
  services: "Nos services",
  tarifs: "Tarifs",
  contact: "Contact",
  booking: "Réservation",
  "mentions-legales": "Mentions légales",
  cgu: "CGU",
  cgv: "CGV",
  "politique-confidentialite": "Confidentialité",
  "sign-in": "Connexion",
  "sign-up": "Inscription",
  "forgot-password": "Mot de passe oublié",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  // Skip admin and protected pages
  if (segments[0] === "admin" || segments[0] === "protected") return null;

  const breadcrumbs = [
    { name: "Accueil", href: "/" },
    ...segments.map((segment, index) => ({
      name: pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
    })),
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${typeof window !== "undefined" ? window.location.origin : ""}${crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        aria-label="Fil d'Ariane"
        className="container max-w-screen-xl mx-auto px-6 py-3"
      >
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-border" aria-hidden="true">
                  /
                </span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
