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

// Function to generate a PDF for a single reservation
export const generateReservationPDF = async (
  reservation: ReservationWithUserData
) => {
  // Create a new PDF document
  const doc = new jsPDF() as jsPDFWithAutoTable;
  let currentY = 0; // Track current Y position
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const bottomMargin = 20; // Space for footer and signatures

  // Helper function to add a new page if needed
  const checkAndAddPage = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = margin; // Reset Y for new page
    }
  };

  // Add title
  doc.setFontSize(20);
  doc.text(
    `Réservation #${reservation.number || reservation.id.substring(0, 8)}`,
    margin,
    22
  );
  currentY = 22;

  // Add date
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, margin, 30);
  currentY = 30;

  // --- Reservation Details ---
  doc.setFontSize(12);
  doc.text("Détails de la réservation", margin, 40);
  currentY = 40;

  // Client information
  const clientInfo = [
    ["Client", `${reservation.user.first_name} ${reservation.user.last_name}`],
    ["Email", reservation.user.email],
    ["Téléphone", reservation.user.phone],
    ["Statut", getStatusLabel(reservation.status)],
    ["Parking", reservation.parking_lot.name],
    ["Date d'arrivée", formatDate(reservation.start_date)],
    ["Date de départ", formatDate(reservation.end_date)],
  ];

  checkAndAddPage(20 + clientInfo.length * 7); // Estimate height
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Information", "Détail"]],
    body: clientInfo,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });
  currentY = doc.lastAutoTable.finalY;

  // --- Vehicle information ---
  checkAndAddPage(25); // Title + Spacing
  doc.text("Informations du véhicule", margin, currentY + 10);
  currentY += 10;

  const vehicleInfo = [
    ["Type", getVehicleTypeLabel(reservation.vehicle_type)],
    ["Marque", reservation.vehicle_brand],
    ["Modèle", reservation.vehicle_model],
    ["Couleur", reservation.vehicle_color],
    ["Immatriculation", reservation.vehicle_plate],
  ];

  checkAndAddPage(20 + vehicleInfo.length * 7); // Estimate height
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Information", "Détail"]],
    body: vehicleInfo,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });
  currentY = doc.lastAutoTable.finalY;

  // --- Options ---
  if (
    reservation.reservation_options &&
    reservation.reservation_options.length > 0
  ) {
    checkAndAddPage(25); // Title + Spacing
    doc.text("Options", margin, currentY + 10);
    currentY += 10;

    const optionsData = reservation.reservation_options.map((opt) => [
      opt.option.name,
      opt.quantity.toString(),
      `${opt.option.price} €`,
      `${opt.option.price * opt.quantity} €`,
    ]);

    checkAndAddPage(20 + optionsData.length * 7); // Estimate height
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Option", "Quantité", "Prix unitaire", "Total"]],
      body: optionsData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });
    currentY = doc.lastAutoTable.finalY;
  }

  // --- Payment information ---
  checkAndAddPage(25); // Title + Spacing
  doc.text("Paiement", margin, currentY + 10);
  currentY += 10;

  // Calculate options total
  const optionsTotal = reservation.reservation_options.reduce(
    (total, opt) => total + opt.option.price * opt.quantity,
    0
  );

  const paymentInfo = [
    ["Prix de base", `${reservation.total_price - optionsTotal} €`],
    ["Options", `${optionsTotal} €`],
    ["Total", `${reservation.total_price} €`],
  ];

  checkAndAddPage(20 + paymentInfo.length * 7); // Estimate height
  autoTable(doc, {
    startY: currentY + 5,
    body: paymentInfo,
    theme: "striped",
    styles: { cellPadding: 5 },
  });
  currentY = doc.lastAutoTable.finalY;

  // --- Vehicle Condition Schematic ---
  checkAndAddPage(65); // Title + Image height + spacing
  doc.setFontSize(12);
  doc.text("État du véhicule", margin, currentY + 10);
  currentY += 15;

  try {
    const imgData = await loadImageAsBase64("/car-schematic.png");
    const imgProps = doc.getImageProperties(imgData);
    const imgWidth = 180; // Adjust width as desired (page width is ~210)
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2; // Center image

    checkAndAddPage(imgHeight + 5);
    doc.addImage(imgData, "PNG", imgX, currentY, imgWidth, imgHeight);
    currentY += imgHeight + 5;
  } catch (error) {
    console.error("Error loading car schematic image:", error);
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0); // Red color for error
    doc.text(
      "Erreur: Impossible de charger le schéma du véhicule.",
      margin,
      currentY
    );
    doc.setTextColor(0, 0, 0); // Reset color
    currentY += 5;
  }

  // --- Comments Section ---
  checkAndAddPage(45); // Title + Box height + spacing
  doc.setFontSize(12);
  doc.text("Commentaires", margin, currentY + 10);
  currentY += 15;
  // Draw a box for comments
  doc.setDrawColor(150); // Light gray border
  doc.rect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 30); // x, y, width, height
  // Add faint lines inside the box (optional)
  doc.setLineDashPattern([1, 1], 0);
  doc.line(
    margin,
    currentY + 7.5,
    doc.internal.pageSize.getWidth() - margin,
    currentY + 7.5
  );
  doc.line(
    margin,
    currentY + 15,
    doc.internal.pageSize.getWidth() - margin,
    currentY + 15
  );
  doc.line(
    margin,
    currentY + 22.5,
    doc.internal.pageSize.getWidth() - margin,
    currentY + 22.5
  );
  doc.setLineDashPattern([], 0); // Reset line dash
  currentY += 30 + 10; // Box height + spacing

  // --- Signatures ---
  checkAndAddPage(30); // Spacing + line height
  const signatureY = pageHeight - bottomMargin - 5; // Position signatures near the bottom
  if (currentY > signatureY - 20) {
    // If content is too close, add a page
    doc.addPage();
    currentY = margin;
  }

  doc.setFontSize(10);
  const signatureXClient = margin;
  const signatureXStaff = doc.internal.pageSize.getWidth() / 2 + margin / 2;
  const signatureLineWidth =
    doc.internal.pageSize.getWidth() / 2 - margin * 1.5;

  doc.text("Signature client:", signatureXClient, signatureY);
  doc.line(
    signatureXClient,
    signatureY + 2,
    signatureXClient + signatureLineWidth,
    signatureY + 2
  );

  doc.text("Signature du staff:", signatureXStaff, signatureY);
  doc.line(
    signatureXStaff,
    signatureY + 2,
    signatureXStaff + signatureLineWidth,
    signatureY + 2
  );

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      "ParkAero Direct - Votre solution de stationnement aéroportuaire",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
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
      doc.internal.pageSize.getHeight() - 10,
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
