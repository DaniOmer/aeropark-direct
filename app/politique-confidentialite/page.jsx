import Link from "next/link";

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <p className="mb-4">
        La présente Politique de Confidentialité décrit comment PARKAERO DIRECT
        (ci-après "nous", "notre", "nos") collecte, utilise et protège les
        informations personnelles que vous (ci-après "l'Utilisateur", "vous",
        "votre") nous fournissez lorsque vous utilisez notre site internet
        ParkAero Direct (ci-après "le Site") et nos services de réservation de
        parking.
      </p>
      <p className="mb-4">
        Nous nous engageons à protéger votre vie privée et à traiter vos données
        personnelles conformément au Règlement Général sur la Protection des
        Données (RGPD) et à la loi française "Informatique et Libertés".
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        1. Responsable du traitement
      </h2>
      <p className="mb-4">
        Le responsable du traitement de vos données personnelles est :
        <br />
        <strong>PARKAERO DIRECT</strong>
        <br />
        SASU au capital de 1 000,00 €<br />
        3 Avenue Germaine, 91170 Viry-Châtillon
        <br />
        RCS Evry : 943 548 594
        <br />
        Email : aeroparkdirect@hotmail.com
        <br />
        Téléphone : +33 (0)6 24 72 48 11
        <br />
        Représentée par Monsieur Aissa SEDRATI en qualité de Président.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        2. Données collectées
      </h2>
      <p className="mb-2">
        Nous collectons les données personnelles que vous nous fournissez
        directement lorsque vous effectuez une réservation, créez un compte
        client, nous contactez ou utilisez notre Site. Ces données peuvent
        inclure :
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          <strong>Informations d'identification :</strong> Nom, prénom, adresse
          email, numéro de téléphone.
        </li>
        <li>
          <strong>Informations de réservation :</strong> Dates et heures
          d'arrivée et de départ, informations sur le véhicule (marque, modèle,
          immatriculation), numéro de vol (facultatif).
        </li>
        <li>
          <strong>Informations de paiement :</strong> Données relatives à la
          transaction (montant, date, numéro de transaction). Note : Vos données
          de carte bancaire sont traitées directement par notre prestataire de
          paiement sécurisé et ne sont pas stockées sur nos serveurs.
        </li>
        <li>
          <strong>Données de connexion :</strong> Adresse IP, type de
          navigateur, dates et heures d'accès (via les logs serveur et
          éventuellement les cookies).
        </li>
        <li>
          <strong>Communications :</strong> Contenu des emails ou messages
          envoyés via le formulaire de contact.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        3. Finalités du traitement
      </h2>
      <p className="mb-2">
        Vos données personnelles sont collectées et traitées pour les finalités
        suivantes :
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Gestion des réservations et des paiements.</li>
        <li>Fourniture du service de stationnement et de navette.</li>
        <li>
          Communication avec vous concernant votre réservation ou vos demandes.
        </li>
        <li>Gestion de la relation client et création de compte client.</li>
        <li>Amélioration de nos services et de notre Site.</li>
        <li>Respect des obligations légales et réglementaires.</li>
        <li>Sécurité du Site et prévention de la fraude.</li>
        <li>
          Envoi d'offres commerciales ou newsletters (uniquement si vous y avez
          consenti explicitement).
        </li>
      </ul>
      <p className="mb-4">
        La base légale de ces traitements repose principalement sur l'exécution
        du contrat de réservation (Article 6.1.b du RGPD), le respect de nos
        obligations légales (Article 6.1.c du RGPD), notre intérêt légitime
        (Article 6.1.f du RGPD) notamment pour la sécurité et l'amélioration des
        services, et votre consentement pour les communications commerciales
        (Article 6.1.a du RGPD).
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        4. Destinataires des données
      </h2>
      <p className="mb-2">
        Vos données personnelles peuvent être communiquées à :
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          Notre personnel habilité (service réservation, chauffeurs de navette,
          service client).
        </li>
        <li>
          Nos sous-traitants techniques (hébergeur du site, prestataire de
          paiement sécurisé, fournisseur de solution de réservation).
        </li>
        <li>
          Les autorités compétentes, si la loi l'exige ou dans le cadre d'une
          procédure judiciaire.
        </li>
      </ul>
      <p className="mb-4">
        Nous nous assurons que nos sous-traitants présentent des garanties
        suffisantes en matière de protection des données personnelles.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        5. Durée de conservation
      </h2>
      <p className="mb-4">
        Vos données personnelles sont conservées pendant la durée nécessaire aux
        finalités pour lesquelles elles ont été collectées, dans le respect des
        prescriptions légales applicables. Les données liées à une réservation
        sont généralement conservées pendant la durée de la relation
        contractuelle, puis archivées pour la durée de prescription légale
        (notamment commerciale et fiscale).
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        6. Sécurité des données
      </h2>
      <p className="mb-4">
        Nous mettons en œuvre des mesures techniques et organisationnelles
        appropriées pour garantir un niveau de sécurité adapté au risque,
        notamment pour protéger vos données contre la destruction, la perte, l'
        altération, la divulgation non autorisée ou l'accès non autorisé.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Vos droits</h2>
      <p className="mb-2">
        Conformément à la réglementation en vigueur, vous disposez des droits
        suivants concernant vos données personnelles :
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          <strong>Droit d'accès :</strong> Obtenir la confirmation que vos
          données sont traitées et y accéder.
        </li>
        <li>
          <strong>Droit de rectification :</strong> Faire corriger les données
          inexactes ou incomplètes.
        </li>
        <li>
          <strong>Droit à l'effacement ("droit à l'oubli") :</strong> Demander
          la suppression de vos données dans certains cas.
        </li>
        <li>
          <strong>Droit à la limitation du traitement :</strong> Demander la
          suspension du traitement de vos données dans certains cas.
        </li>
        <li>
          <strong>Droit à la portabilité :</strong> Recevoir vos données dans un
          format structuré et les transmettre à un autre responsable de
          traitement.
        </li>
        <li>
          <strong>Droit d'opposition :</strong> Vous opposer au traitement de
          vos données pour des motifs légitimes, et à tout moment pour la
          prospection commerciale.
        </li>
        <li>
          <strong>Droit de retirer votre consentement :</strong> Retirer votre
          consentement à tout moment pour les traitements basés sur celui-ci.
        </li>
        <li>
          <strong>Droit de définir des directives post-mortem :</strong> Définir
          des directives relatives au sort de vos données après votre décès.
        </li>
      </ul>
      <p className="mb-4">
        Pour exercer ces droits, vous pouvez nous contacter par email à
        aeroparkdirect@hotmail.com ou par courrier postal à l'adresse indiquée à
        l'article 1, en joignant un justificatif d'identité si nécessaire.
      </p>
      <p className="mb-4">
        Vous avez également le droit d'introduire une réclamation auprès de la
        Commission Nationale de l'Informatique et des Libertés (CNIL) :
        <a
          href="https://www.cnil.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline ml-1"
        >
          www.cnil.fr
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">8. Cookies</h2>
      <p className="mb-2">
        Le Site peut utiliser des cookies pour améliorer votre expérience de
        navigation, analyser l'utilisation du Site et faciliter les
        réservations. Les cookies sont de petits fichiers texte stockés sur
        votre appareil.
      </p>
      <p className="mb-2">Nous utilisons les types de cookies suivants :</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          <strong>Cookies strictement nécessaires :</strong> Indispensables au
          fonctionnement du Site et à la fourniture des services demandés (ex :
          gestion de session de réservation).
        </li>
        <li>
          <strong>Cookies de performance/analytiques :</strong> Permettent de
          comprendre comment les visiteurs interagissent avec le Site (ex :
          Google Analytics).
        </li>
        <li>
          <strong>Cookies de fonctionnalité :</strong> Permettent de mémoriser
          vos choix et préférences pour améliorer votre expérience.
        </li>
        {/* Ajouter cookies publicitaires si pertinent */}
      </ul>
      <p className="mb-4">
        Vous pouvez gérer vos préférences en matière de cookies via les
        paramètres de votre navigateur. Le refus de certains cookies peut
        cependant affecter votre expérience sur le Site. [Ajouter un lien vers
        une page/outil de gestion des cookies si disponible].
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        9. Liens vers d'autres sites
      </h2>
      <p className="mb-4">
        Notre Site peut contenir des liens vers des sites tiers. Nous ne sommes
        pas responsables des pratiques de confidentialité de ces autres sites.
        Nous vous encourageons à lire attentivement leurs politiques de
        confidentialité.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        10. Modification de la Politique de Confidentialité
      </h2>
      <p className="mb-4">
        Nous nous réservons le droit de modifier la présente Politique de
        Confidentialité à tout moment. Toute modification sera publiée sur cette
        page avec la date de mise à jour. Nous vous encourageons à consulter
        régulièrement cette page.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">11. Contact</h2>
      <p className="mb-4">
        Pour toute question concernant cette Politique de Confidentialité ou le
        traitement de vos données personnelles, veuillez nous contacter aux
        coordonnées indiquées à l'article 1 ou consulter nos{" "}
        <Link
          href="/mentions-legales"
          className="text-blue-600 hover:underline"
        >
          Mentions Légales
        </Link>
        .
      </p>
    </div>
  );
}
