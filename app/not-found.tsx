import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
          Erreur 404
        </p>
        <h1 className="text-5xl font-extrabold text-foreground mb-4">
          Page introuvable
        </h1>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.35)] transition-all"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-border text-foreground font-medium px-6 py-3 rounded-xl hover:bg-secondary transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
