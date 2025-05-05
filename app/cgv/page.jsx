import Link from "next/link";

export default function CGV() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Conditions Générales de Vente (CGV)
      </h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <p className="mb-4">
        Les présentes conditions générales de vente (ci-après "CGV") régissent
        les relations contractuelles entre la société PARKAERO DIRECT (ci-après
        "le Prestataire") et toute personne physique ou morale (ci-après "le
        Client") effectuant une réservation de place de parking via le site
        internet ParkAero Direct (ci-après "le Site").
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Article 1 : Objet</h2>
      <p className="mb-4">
        Les présentes CGV ont pour objet de définir les conditions dans
        lesquelles le Prestataire fournit au Client un service de réservation de
        places de stationnement pour véhicules automobiles légers dans son
        parking situé à proximité de l'aéroport d'Orly, incluant un service de
        navette gratuite vers et depuis l'aéroport.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 2 : Services Proposés
      </h2>
      <p className="mb-2">Le Prestataire propose :</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          La réservation en ligne d'une place de stationnement non définie dans
          un parking clos et sécurisé.
        </li>
        <li>
          Un service de navette gratuite fonctionnant 24h/24 et 7j/7 pour
          transporter le Client et ses passagers entre le parking et les
          terminaux de l'aéroport d'Orly (aller et retour).
        </li>
        <li>
          Des services additionnels (selon disponibilité et sur réservation)
          tels que [... lister les services additionnels éventuels : lavage,
          recharge électrique, etc.].
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 3 : Réservation
      </h2>
      <p className="mb-2">
        La réservation s'effectue exclusivement via le Site. Le Client choisit
        ses dates et heures d'arrivée et de départ, ainsi que les éventuels
        services additionnels.
      </p>
      <p className="mb-2">
        La réservation n'est confirmée qu'après acceptation des présentes CGV et
        validation du paiement intégral du prix.
      </p>
      <p className="mb-4">
        Une confirmation de réservation contenant les détails (numéro de
        réservation, dates, heures, tarif, instructions d'accès, numéro de
        téléphone de la navette) est envoyée par email au Client. Le Client doit
        vérifier l'exactitude des informations et conserver cet email.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 4 : Tarifs et Paiement
      </h2>
      <p className="mb-2">
        Les tarifs sont indiqués en euros (€) toutes taxes comprises (TTC) sur
        le Site au moment de la réservation. Ils dépendent de la durée du
        stationnement et des services choisis.
      </p>
      <p className="mb-2">
        Le paiement s'effectue en ligne au moment de la réservation par carte
        bancaire via un système de paiement sécurisé.
      </p>
      <p className="mb-4">
        Toute journée commencée est due. Aucun remboursement ne sera effectué en
        cas de départ anticipé du Client. En cas de dépassement de la durée de
        stationnement prévue, des frais supplémentaires seront appliqués selon
        le tarif en vigueur.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 5 : Conditions d'Annulation et de Modification
      </h2>
      <p className="mb-2">
        Le Client peut modifier ou annuler sa réservation selon les conditions
        suivantes : [...Définir les conditions précises : délai avant arrivée,
        frais éventuels, remboursement partiel/total, cas de l'assurance
        annulation si proposée...].
      </p>
      <p className="mb-4">
        Toute demande d'annulation ou de modification doit être effectuée par
        [...préciser le moyen : email, espace client...].
      </p>
      {/* Ajouter ici les détails spécifiques sur l'assurance annulation si elle existe */}

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 6 : Obligations du Client
      </h2>
      <p className="mb-2">Le Client s'engage à :</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          Fournir des informations exactes lors de la réservation (dates,
          horaires, informations véhicule, contact).
        </li>
        <li>Se présenter au parking à l'heure indiquée sur la réservation.</li>
        <li>
          Respecter le règlement intérieur du parking (affiché sur place).
        </li>
        <li>
          Garer son véhicule à l'emplacement indiqué ou selon les instructions
          du personnel.
        </li>
        <li>
          Fermer son véhicule à clé et ne laisser aucun objet de valeur en
          évidence.
        </li>
        <li>
          Conserver sur soi les clés de son véhicule [Ou : Remettre les clés de
          son véhicule au personnel si requis par le fonctionnement du parking].
        </li>
        <li>
          Contacter la navette à son retour à l'aéroport au numéro fourni dans
          l'email de confirmation, une fois ses bagages récupérés.
        </li>
        <li>Être en possession d'une assurance valide pour son véhicule.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 7 : Obligations du Prestataire
      </h2>
      <p className="mb-2">Le Prestataire s'engage à :</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          Mettre à disposition une place de stationnement pour le véhicule du
          Client pour la durée réservée.
        </li>
        <li>
          Assurer le service de navette gratuite entre le parking et l'aéroport
          dans des délais raisonnables.
        </li>
        <li>
          Prendre toutes les mesures raisonnables pour assurer la sécurité du
          parking (vidéosurveillance, présence humaine, clôture).
        </li>
        <li>
          Restituer le véhicule au Client à la fin de la période de
          stationnement.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 8 : Responsabilité
      </h2>
      <p className="mb-2">
        Le stationnement se fait aux risques et périls du Client. Le Prestataire
        est soumis à une obligation de moyens concernant la sécurité du parking.
      </p>
      <p className="mb-2">
        La responsabilité du Prestataire ne saurait être engagée en cas de vol,
        dégradation du véhicule, ou vol d'objets laissés à l'intérieur, sauf
        faute prouvée du Prestataire. Les éventuels dommages doivent être
        constatés contradictoirement avant la sortie définitive du véhicule du
        parking.
      </p>
      <p className="mb-2">
        Le Prestataire ne peut être tenu responsable des retards de navette dus
        à des embouteillages, accidents, conditions météorologiques ou tout
        autre événement indépendant de sa volonté. Il est conseillé au Client de
        prévoir une marge de temps suffisante.
      </p>
      <p className="mb-4">
        Le Prestataire décline toute responsabilité pour les dommages causés par
        le Client à d'autres véhicules ou aux installations du parking.
      </p>
      {/* Mentionner ici l'état des lieux par IA si applicable */}

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 9 : Assurance
      </h2>
      <p className="mb-4">
        Le Prestataire déclare être titulaire d'une police d'assurance couvrant
        sa responsabilité civile professionnelle. Le Client doit disposer d'une
        assurance automobile valide couvrant son véhicule pendant toute la durée
        du stationnement.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 10 : Données Personnelles
      </h2>
      <p className="mb-4">
        Les informations recueillies lors de la réservation sont nécessaires à
        la gestion de celle-ci. Elles sont traitées conformément à notre{" "}
        <Link
          href="/politique-confidentialite"
          className="text-blue-600 hover:underline"
        >
          Politique de Confidentialité
        </Link>{" "}
        et à la réglementation en vigueur. Conformément à la loi "Informatique
        et Libertés", le Client dispose d'un droit d'accès, de rectification et
        de suppression des données le concernant en contactant le Prestataire
        aux coordonnées indiquées dans les{" "}
        <Link
          href="/mentions-legales"
          className="text-blue-600 hover:underline"
        >
          Mentions Légales
        </Link>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 11 : Propriété Intellectuelle
      </h2>
      <p className="mb-4">
        Tous les éléments du Site (textes, images, logos, etc.) sont la
        propriété exclusive du Prestataire ou de ses partenaires et sont
        protégés par les lois relatives à la propriété intellectuelle. Toute
        reproduction ou utilisation sans autorisation est interdite.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 12 : Force Majeure
      </h2>
      <p className="mb-4">
        La responsabilité du Prestataire ne pourra être engagée si l'exécution
        du contrat est retardée ou empêchée en raison d'un cas de force majeure
        ou d'un cas fortuit, tels que définis par la jurisprudence française.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 13 : Droit Applicable et Litiges
      </h2>
      <p className="mb-2">Les présentes CGV sont soumises au droit français.</p>
      <p className="mb-4">
        En cas de litige, le Client s'adressera en priorité au Prestataire pour
        tenter de trouver une solution amiable. À défaut, et conformément aux
        dispositions du Code de la consommation concernant le règlement amiable
        des litiges, le Client a le droit de recourir gratuitement au service de
        médiation proposé par le Prestataire. L'entité de médiation désignée est
        [Nom de l'entité de médiation - à compléter, voir mentions légales] aux
        coordonnées suivantes : [Coordonnées du médiateur - à compléter]. Avant
        de saisir le médiateur, le Client doit justifier avoir tenté, au
        préalable, de résoudre son litige directement auprès du Prestataire par
        une réclamation écrite. À défaut d'accord amiable, les tribunaux
        français seront seuls compétents.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 14 : Modification des CGV
      </h2>
      <p className="mb-4">
        Le Prestataire se réserve le droit de modifier les présentes CGV à tout
        moment. Les CGV applicables sont celles en vigueur à la date de la
        réservation par le Client.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Article 15 : Identification du Prestataire
      </h2>
      <p>
        <strong>PARKAERO DIRECT</strong> - SASU au capital de 1 000,00 €
      </p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>Siège social : 3 Avenue Germaine, 91170 Viry-Châtillon</li>
        <li>RCS Evry : 943 548 594</li>
        <li>Email : aeroparkdirect@hotmail.com</li>
        <li>Téléphone : +33 (0)6 24 72 48 11</li>
      </ul>
    </div>
  );
}
