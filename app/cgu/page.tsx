import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | AéroPark Direct",
  description:
    "Conditions générales d'utilisation du service de stationnement AéroPark Direct",
};

export default function CGUPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        Conditions Générales d'Utilisation
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Présentation du Service
          </h2>
          <p className="text-base leading-relaxed">
            AéroPark Direct est un service de stationnement de véhicules
            proposant des solutions de stationnement sécurisé prêt de
            l&apos;aéroport de Paris-Orly. Le service permet aux utilisateurs de
            réserver une place de stationnement pour leur véhicule.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Inscription et Compte Utilisateur
          </h2>
          <p className="text-base leading-relaxed">
            Pour utiliser le service, l'utilisateur doit créer un compte en
            fournissant des informations exactes et complètes. L'utilisateur est
            responsable de la confidentialité de son compte et de son mot de
            passe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Réservations et Paiements
          </h2>
          <p className="text-base leading-relaxed">
            Les réservations sont effectuées en ligne via notre plateforme. Le
            paiement est requis au moment de la réservation. Les prix indiqués
            sont en euros et incluent toutes les taxes applicables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Conditions d'Annulation
          </h2>
          <p className="text-base leading-relaxed">
            Les annulations sont possibles jusqu'à 24 heures avant la date de
            début de stationnement. Au-delà de ce délai, aucun remboursement ne
            sera effectué.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Responsabilités</h2>
          <p className="text-base leading-relaxed">
            AéroPark Direct s'engage à assurer la sécurité des véhicules
            stationnés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Protection des Données Personnelles
          </h2>
          <p className="text-base leading-relaxed">
            Les données personnelles collectées sont traitées conformément à
            notre politique de confidentialité. L'utilisateur dispose d'un droit
            d'accès, de rectification et de suppression de ses données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Modifications des CGU
          </h2>
          <p className="text-base leading-relaxed">
            AéroPark Direct se réserve le droit de modifier ces conditions
            générales à tout moment. Les utilisateurs seront informés des
            modifications importantes par email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
          <p className="text-base leading-relaxed">
            Pour toute question concernant ces conditions générales, vous pouvez
            nous contacter à l'adresse email suivante :{" "}
            <a href="mailto:aeroparkdirect@hotmail.com">
              aeroparkdirect@hotmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
