import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReservationWithUserData } from "@/app/actions";
import { formatDate } from "@/app/admin/reservations/reservation-details-modal";

// Helper to load image data as Base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
};

// Extend the jsPDF type to include the lastAutoTable property
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

// Helper function to check and add new page if needed
const checkAndAddNewPage = (
  doc: jsPDFWithAutoTable,
  currentY: number,
  margin: number
): number => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY > pageHeight - margin) {
    doc.addPage();
    return margin;
  }
  return currentY;
};

// Function to generate a PDF for a single reservation
export const generateReservationPDF = async (
  reservation: ReservationWithUserData
) => {
  // Create a new PDF document
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const rightMargin = 14;
  const topMargin = 14;
  let currentY = topMargin;

  // --- EN-TÊTE ---
  // Add logo (top left) - Maintain aspect ratio
  try {
    const logoData = await loadImageAsBase64("/park-aero.jpg");
    // Get image properties to maintain aspect ratio
    const imgProps = doc.getImageProperties(logoData);
    const logoWidth = 20; // Reduced width
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
    doc.addImage(logoData, "PNG", margin, topMargin, logoWidth, logoHeight);
  } catch (e) {
    console.error("Logo not found:", e);
  }

  // Titre à droite
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RESA PARKAERO", pageWidth - rightMargin, topMargin + 10, {
    align: "right",
  });

  currentY = topMargin + 30;

  // Ligne de séparation
  doc.setDrawColor(0);
  doc.setLineWidth(0.1);
  doc.line(margin, currentY - 5, pageWidth - margin, currentY - 5);

  currentY += 10;

  // CONTRAT DE LOCATION + FACTURE
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const contractText = "CONTRAT DE LOCATION DE PARKING ";
  const contractTextWidth = doc.getTextWidth(contractText);
  doc.text(contractText, margin + 50, currentY);

  // Numéro de facture manuscrit à droite
  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.text(
    reservation.number
      ? reservation.number.toString()
      : (reservation.id || "").substring(0, 8),
    margin + 50 + contractTextWidth + 5,
    currentY
  );

  currentY += 10;

  // Date de la commande et CONTRAT DE LOCATION
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Date de réservation : ${formatDate(reservation.created_at || reservation.start_date || "", reservation.created_at ? true : false)}`,
    margin,
    currentY
  );

  // Destination
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Destination : `, margin + 80, currentY);

  // ORLY : 1 2 3 4
  doc.text("ORLY : 1 2 3 4", pageWidth - margin - 40, currentY);

  currentY += 10;

  // Date du dépôt et facture
  const formattedStartDate = formatDate(reservation.start_date || "");
  doc.text(`Départ : ${formattedStartDate}`, margin, currentY);

  // Calcul du nombre de jours basé sur les jours calendaires
  const start = new Date(reservation.start_date || "");
  const end = new Date(reservation.end_date || "");

  // Réinitialiser les heures à minuit pour compter les jours calendaires complets
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // Calculer la différence en jours
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const diffTime = endDay.getTime() - startDay.getTime();

  // Ajouter 1 car on compte à la fois le jour de début et le jour de fin
  const diffDays = Math.floor(diffTime / millisecondsPerDay) + 1;

  doc.text(`Nb de jours : ${diffDays}`, margin + 60, currentY);

  // Mode de paiement
  doc.text(`Mode de paiement : `, pageWidth - margin - 90, currentY);

  // Cases à cocher pour paiement
  const checkboxY = currentY - 3;
  doc.rect(pageWidth - margin - 42, checkboxY, 4, 4); // Chèque
  doc.text("Chèque", pageWidth - margin - 55, currentY);
  doc.rect(pageWidth - margin - 20, checkboxY, 4, 4); // Espèces
  doc.text("Espèces", pageWidth - margin - 35, currentY);
  doc.rect(pageWidth - margin - 4, checkboxY, 4, 4); // CB
  doc.text("CB", pageWidth - margin - 13, currentY);

  // Vérifier si la réservation a des paiements et si au moins un est en statut "succeeded"
  const isPaid =
    reservation.payments &&
    reservation.payments.some((payment) => payment.status === "succeeded");

  // Cocher la case CB si la réservation est payée
  if (isPaid) {
    doc.setDrawColor(0, 128, 0); // Vert pour la case cochée
    doc.rect(pageWidth - margin - 4, checkboxY, 4, 4, "F"); // Remplir la case CB
    doc.setDrawColor(0); // Réinitialiser la couleur
  }

  // Ajout du statut de paiement
  currentY += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  if (isPaid) {
    doc.setTextColor(0, 128, 0); // Vert pour indiquer payé
    doc.text("Réservation payée", pageWidth - margin - 90, currentY);
  } else {
    doc.setTextColor(255, 0, 0); // Rouge pour indiquer non payé
    doc.text("À payer sur place", pageWidth - margin - 90, currentY);
  }
  doc.setTextColor(0); // Réinitialiser la couleur

  currentY += 10;

  // Heures de départ et convocation - Split into two lines to prevent truncation
  const departureFlightNumber = reservation.departure_flight_number
    ? reservation.departure_flight_number
    : "";
  const returnFlightNumber = reservation.return_flight_number
    ? reservation.return_flight_number
    : "";
  doc.text(`Numero de vol aller : ${departureFlightNumber}`, margin, currentY);

  currentY += 5;
  doc.text(`Numero de vol retour : ${returnFlightNumber}`, margin, currentY);

  currentY += 5;
  doc.text(`H. du départ de l'avion : `, margin, currentY);

  // Date et heure de retour
  currentY += 10;
  doc.text(
    `Date et heure de retour : ${formatDate(reservation.end_date || "")}`,
    margin,
    currentY
  );

  // Nom et téléphone - with text wrapping for long values
  currentY += 10;
  doc.text(
    `Nom : ${reservation.user?.first_name || ""} ${reservation.user?.last_name || ""}`,
    margin,
    currentY,
    { maxWidth: pageWidth / 2 - margin - 10 }
  );

  // Phone number with proper spacing
  const phoneText = `Téléphone : ${reservation.user?.phone || ""}`;
  doc.text(phoneText, pageWidth / 2 + 10, currentY, {
    maxWidth: pageWidth / 2 - margin - 10,
  });

  // Adresse, code postal et ville
  currentY += 10;
  doc.text(`Adresse : `, margin, currentY);
  doc.text(`Code postal : `, margin + 100, currentY);
  doc.text(`Ville : `, margin + 150, currentY);

  currentY += 15;

  // Prix et TVA
  const basePrice = reservation.total_price * 0.8; // Approximation pour la démonstration
  const tva = reservation.total_price * 0.2; // Approximation pour la démonstration
  doc.text(
    `Mt de la réservation : ${reservation.total_price.toFixed(2)} €`,
    margin,
    currentY
  );
  doc.text(
    `Mt des options : ${reservation.reservation_options.reduce(
      (total, opt) => total + opt.option.price * opt.quantity,
      0
    )} €`,
    margin + 70,
    currentY
  );

  doc.text(
    `Total : ${reservation.total_price.toFixed(2)} €`,
    margin + 130,
    currentY
  );

  currentY += 10;

  // Ligne de séparation
  doc.setDrawColor(0);
  doc.setLineWidth(0.1);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 10;

  // --- Rapport de chocs importants ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Rapport de chocs importants ( voir )",
    pageWidth - margin - 70,
    currentY
  );

  currentY += 10;

  // --- Informations concernant le véhicule ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text("Informations concernant le véhicule", margin, currentY);

  currentY += 10;
  currentY = checkAndAddNewPage(doc, currentY, margin);

  // Marque/Modèle et couleur - with text wrapping for long values
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const vehicleText = `Marque/Modèle et couleur: ${reservation.vehicle_brand} ${reservation.vehicle_model} ${reservation.vehicle_color}`;
  // Calculate available width (accounting for the car schematic on the right)
  const availableWidth = pageWidth - 2 * margin - 90; // 90 is approximate width of car schematic
  doc.text(vehicleText, margin, currentY, { maxWidth: availableWidth });

  currentY += 10;
  currentY = checkAndAddNewPage(doc, currentY, margin);

  // Immatriculation - with text wrapping for long values
  const plateText = `Immatriculation : ${reservation.vehicle_plate}`;
  doc.text(plateText, margin, currentY, { maxWidth: availableWidth });

  currentY += 10;
  currentY = checkAndAddNewPage(doc, currentY, margin);

  // Kms
  doc.text(`Kms `, margin, currentY);
  // Ligne pour écrire les kms
  doc.line(margin + 20, currentY, margin + 60, currentY);

  currentY += 10;
  // currentY = checkAndAddNewPage(doc, currentY, margin);

  // N° code de système d'alarme
  doc.text(`N° de clef de voiture:`, margin, currentY);

  currentY += 10;
  // Nbre de personnes (aller et retour)
  doc.text(`Nombre de personnes`, margin, currentY);

  // aller
  currentY += 5;
  doc.text(`Aller: ${reservation.number_of_people || 1}`, margin, currentY);
  // retour
  doc.text(
    `Retour: ${reservation.number_of_people || 1}`,
    margin + 100,
    currentY
  );

  currentY += 10;

  // Calculate space needed for vehicle info section
  const vehicleInfoHeight = 80; // Approximate height needed for vehicle info text

  // --- Schéma du véhicule ---
  try {
    const imgData = await loadImageAsBase64("/car-schematic.png");
    const imgProps = doc.getImageProperties(imgData);
    const imgWidth = 80; // Slightly reduced width
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // Position image to the right, aligned with the current text section
    const imgX = pageWidth - margin - imgWidth; // Right align
    const imgY = currentY - vehicleInfoHeight + 15; // Position at the start of vehicle info section

    // Make sure we have enough space for the image
    if (imgY > topMargin) {
      doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);
    } else {
      // If not enough space, position it at a safe distance
      doc.addImage(imgData, "PNG", imgX, topMargin + 5, imgWidth, imgHeight);
    }
  } catch (error) {
    console.error("Error loading car schematic image:", error);
  }

  // Ensure we move past the vehicle info section
  // currentY += 25;
  // currentY = checkAndAddNewPage(doc, currentY, margin);

  // currentY += 15;
  // currentY = checkAndAddNewPage(doc, currentY, margin);

  // currentY += 20;
  // currentY = checkAndAddNewPage(doc, currentY, margin);

  // --- Texte d'accord ---
  doc.setFontSize(9);
  const textWidth = pageWidth - margin * 2;
  doc.text(
    "Je suis d'accord avec le rapport de chocs importants ci-dessus, déclare ne rien avoir caché concernant son véhicule",
    margin,
    currentY,
    { maxWidth: textWidth }
  );

  currentY += 5;
  currentY = checkAndAddNewPage(doc, currentY, margin);
  doc.text("avant de l'avoir confié ce jour.", margin, currentY);

  currentY += 5;
  currentY = checkAndAddNewPage(doc, currentY, margin);
  doc.text(
    "Je confirme avoir pris connaissance des conditions générales de vente figurant sur le site internet de ParkAero.",
    margin,
    currentY,
    { maxWidth: textWidth }
  );

  currentY += 10;
  currentY = checkAndAddNewPage(doc, currentY, margin);

  // --- Navette ---

  currentY += 5;
  currentY = checkAndAddNewPage(doc, currentY, margin);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "* Toutes les vitres, crevassons, petits chocs, petites rayures et bas de caisse ne sont pas pris en compte dans le rapport de chocs importants",
    margin,
    currentY,
    { maxWidth: textWidth }
  );

  // --- Options (simplified to just show total) ---
  // if (
  //   reservation.reservation_options &&
  //   reservation.reservation_options.length > 0
  // ) {
  //   currentY += 10;
  //   currentY = checkAndAddNewPage(doc, currentY, margin);
  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "bold");

  //   // Calculate options total
  //   const optionsTotal = reservation.reservation_options.reduce(
  //     (total, opt) => total + opt.option.price * opt.quantity,
  //     0
  //   );

  //   doc.text(`Options: ${optionsTotal.toFixed(2)} €`, margin, currentY);
  // }

  // --- Signatures ---
  currentY = pageHeight - 25; // Position signatures near the bottom
  currentY = checkAndAddNewPage(doc, currentY, margin);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Signature P.S.
  doc.text("Signature P.S. :", margin, currentY);

  // Signature du Client
  doc.text("Signature du Client :", pageWidth - margin - 80, currentY);

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      "ParkAero Direct - Votre solution de stationnement aéroportuaire",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: "center" }
    );
  }

  // Save the PDF
  return doc;
};

// Function to generate a PDF for multiple reservations
export const generateReservationsListPDF = (
  reservations: ReservationWithUserData[]
) => {
  // Create a new PDF document
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Add title
  doc.setFontSize(20);
  doc.text("Liste des réservations", 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 30);

  // Prepare data for the table
  const tableData = reservations.map((reservation) => [
    reservation.number || reservation.id.substring(0, 8),
    `${reservation.user.first_name} ${reservation.user.last_name}`,
    formatDate(reservation.start_date),
    formatDate(reservation.end_date),
    getStatusLabel(reservation.status),
    `${reservation.total_price} €`,
  ]);

  // Generate the table
  autoTable(doc, {
    startY: 40,
    head: [["N°", "Client", "Arrivée", "Départ", "Statut", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      "ParkAero Direct - Votre solution de stationnement aéroportuaire",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 30,
      { align: "center" }
    );
  }

  // Return the PDF
  return doc;
};

// Helper function to get status label
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "cancelled":
      return "Annulée";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};

// Helper function to get vehicle type label
const getVehicleTypeLabel = (vehicleType: string): string => {
  switch (vehicleType) {
    case "small_car":
      return "Voiture petite";
    case "large_car":
      return "Voiture grande";
    case "small_motorcycle":
      return "Moto petite";
    case "large_motorcycle":
      return "Moto grande";
    default:
      return vehicleType;
  }
};
