import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReservationWithUserData } from "@/app/actions";
import { formatDate } from "@/app/admin/reservations/reservation-details-modal";

// Extend the jsPDF type to include the lastAutoTable property
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

// Function to generate a PDF for a single reservation
export const generateReservationPDF = (
  reservation: ReservationWithUserData
) => {
  // Create a new PDF document
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Add title
  doc.setFontSize(20);
  doc.text(
    `Réservation #${reservation.number || reservation.id.substring(0, 8)}`,
    14,
    22
  );

  // Add date
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 30);

  // Add reservation details
  doc.setFontSize(12);
  doc.text("Détails de la réservation", 14, 40);

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

  autoTable(doc, {
    startY: 45,
    head: [["Information", "Détail"]],
    body: clientInfo,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Vehicle information
  doc.text("Informations du véhicule", 14, doc.lastAutoTable.finalY + 10);

  const vehicleInfo = [
    ["Type", getVehicleTypeLabel(reservation.vehicle_type)],
    ["Marque", reservation.vehicle_brand],
    ["Modèle", reservation.vehicle_model],
    ["Couleur", reservation.vehicle_color],
    ["Immatriculation", reservation.vehicle_plate],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Information", "Détail"]],
    body: vehicleInfo,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Options
  if (
    reservation.reservation_options &&
    reservation.reservation_options.length > 0
  ) {
    doc.text("Options", 14, doc.lastAutoTable.finalY + 10);

    const optionsData = reservation.reservation_options.map((opt) => [
      opt.option.name,
      opt.quantity.toString(),
      `${opt.option.price} €`,
      `${opt.option.price * opt.quantity} €`,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Option", "Quantité", "Prix unitaire", "Total"]],
      body: optionsData,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });
  }

  // Payment information
  doc.text("Paiement", 14, doc.lastAutoTable.finalY + 10);

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

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    body: paymentInfo,
    theme: "striped",
    styles: { cellPadding: 5 },
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      "AeroPark Direct - Votre solution de stationnement aéroportuaire",
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
      "AeroPark Direct - Votre solution de stationnement aéroportuaire",
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
