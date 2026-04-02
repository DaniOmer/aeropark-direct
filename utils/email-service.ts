import * as Brevo from "@getbrevo/brevo";

// Initialize Brevo API instance
const apiInstance = new Brevo.TransactionalEmailsApi();
const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;

// Set API key for authentication
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey || "");

// Interface for email data
export interface EmailData {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: { email: string; name: string };
}

// Shared email layout wrapper with navy/cyan branding
function emailLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ParkAero Direct</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0c1821 0%, #1a3a4a 100%); border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ParkAero Direct</h1>
              <div style="width: 48px; height: 3px; background: linear-gradient(90deg, #06b6d4, #14b8a6); margin: 12px auto 0; border-radius: 2px;"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0c1821; border-radius: 0 0 12px 12px; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8;">ParkAero Direct — Parking Orly</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} ParkAero Direct. Tous droits r&eacute;serv&eacute;s.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Shared helper: info row for tables
function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding: 8px 12px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 40%;">${label}</td>
    <td style="padding: 8px 12px; font-size: 14px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

// Shared helper: section title
function sectionTitle(title: string): string {
  return `<h2 style="margin: 28px 0 16px; font-size: 16px; font-weight: 600; color: #0c1821; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">${title}</h2>`;
}

// Shared helper: format reservation dates
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Shared helper: calculate days
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1 || 1;
}

// Shared helper: vehicle type label
function vehicleTypeLabel(type: string): string {
  switch (type) {
    case "small_car": return "Voiture";
    case "large_car": return "Grand v\u00e9hicule";
    case "small_motorcycle": return "Moto";
    case "large_motorcycle": return "Grosse moto";
    default: return type;
  }
}

// Shared helper: status label
function statusLabel(status: string): string {
  switch (status) {
    case "confirmed": return "Confirm\u00e9e";
    case "pending": return "En attente";
    case "cancelled": return "Annul\u00e9e";
    case "completed": return "Termin\u00e9e";
    default: return status;
  }
}

// Shared helper: status badge
function statusBadge(status: string): string {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "#dcfce7", text: "#166534" },
    pending: { bg: "#fef9c3", text: "#854d0e" },
    cancelled: { bg: "#fecaca", text: "#991b1b" },
    completed: { bg: "#dbeafe", text: "#1e40af" },
  };
  const c = colors[status] || { bg: "#f1f5f9", text: "#475569" };
  return `<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background-color: ${c.bg}; color: ${c.text};">${statusLabel(status)}</span>`;
}

// Shared helper: options table
function optionsBlock(reservation: any): { html: string; total: number } {
  if (!reservation.reservation_options || reservation.reservation_options.length === 0) {
    return { html: "", total: 0 };
  }

  const total = reservation.reservation_options.reduce(
    (sum: number, opt: any) => sum + opt.option.price * opt.quantity, 0
  );

  const rows = reservation.reservation_options.map((opt: any) => `
    <tr>
      <td style="padding: 8px 12px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${opt.option.name}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; text-align: center;">${opt.quantity}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; text-align: right;">${opt.option.price}\u00a0\u20ac</td>
      <td style="padding: 8px 12px; font-size: 13px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #f1f5f9; text-align: right;">${opt.option.price * opt.quantity}\u00a0\u20ac</td>
    </tr>
  `).join("");

  const html = `
    ${sectionTitle("Options")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background-color: #f8fafc;">
          <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #64748b; text-align: left; text-transform: uppercase; letter-spacing: 0.5px;">Option</th>
          <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #64748b; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Qt\u00e9</th>
          <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #64748b; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">P.U.</th>
          <th style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #64748b; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  return { html, total };
}

// Shared helper: price summary block
function priceSummary(totalPrice: number, optionsTotal: number): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 16px; font-size: 14px; color: #64748b; background-color: #f8fafc;">Stationnement</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; text-align: right; background-color: #f8fafc;">${totalPrice - optionsTotal}\u00a0\u20ac</td>
      </tr>
      ${optionsTotal > 0 ? `
      <tr>
        <td style="padding: 12px 16px; font-size: 14px; color: #64748b;">Options</td>
        <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; text-align: right;">${optionsTotal}\u00a0\u20ac</td>
      </tr>` : ""}
      <tr>
        <td style="padding: 16px; font-size: 18px; font-weight: 700; color: #0c1821; background: linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%); border-top: 2px solid #06b6d4;">Total</td>
        <td style="padding: 16px; font-size: 18px; font-weight: 700; color: #0c1821; text-align: right; background: linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%); border-top: 2px solid #06b6d4;">${totalPrice}\u00a0\u20ac</td>
      </tr>
    </table>
  `;
}

/**
 * Generate HTML content for login notification email
 */
export function generateLoginNotificationEmail(userEmail: string): string {
  const loginTime = new Date().toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #14b8a6); line-height: 56px; font-size: 24px; color: white; margin-bottom: 12px;">&#128274;</div>
      <h2 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #0c1821;">Nouvelle connexion d\u00e9tect\u00e9e</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Une connexion a \u00e9t\u00e9 effectu\u00e9e sur votre application.</p>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Utilisateur", userEmail)}
      ${infoRow("Date et heure", loginTime)}
    </table>
    <p style="margin-top: 24px; font-size: 13px; color: #94a3b8; text-align: center;">Ceci est un email automatique.</p>
  `;

  return emailLayout("Notification de connexion", content);
}

/**
 * Send an email using Brevo API
 */
export async function sendEmail(emailData: EmailData): Promise<any> {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.sender = emailData.sender || {
      name: "ParkAero Direct",
      email: "aeroparkdirect@hotmail.com",
    };

    sendSmtpEmail.to = emailData.to;
    sendSmtpEmail.subject = emailData.subject;
    sendSmtpEmail.htmlContent = emailData.htmlContent;

    if (emailData.textContent) {
      sendSmtpEmail.textContent = emailData.textContent;
    }

    console.log("Sending email via Brevo API...");
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * Generate HTML content for admin notification email
 */
export function generateAdminNotificationEmail(
  reservation: any,
  user: any
): string {
  const startDate = formatDate(reservation.start_date);
  const endDate = formatDate(reservation.end_date);
  const days = calculateDays(reservation.start_date, reservation.end_date);
  const { html: optHtml, total: optTotal } = optionsBlock(reservation);

  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; padding: 8px 20px; border-radius: 20px; background-color: #ecfeff; color: #0891b2; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">NOUVELLE R\u00c9SERVATION</div>
      <p style="margin: 12px 0 0; font-size: 14px; color: #64748b;">N\u00b0 <strong style="color: #0c1821;">${reservation.number || reservation.id.substring(0, 8)}</strong></p>
    </div>

    ${sectionTitle("Client")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Nom", `${user.first_name} ${user.last_name}`)}
      ${infoRow("Email", user.email)}
      ${infoRow("T\u00e9l\u00e9phone", user.phone)}
    </table>

    ${sectionTitle("R\u00e9servation")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Arriv\u00e9e", startDate)}
      ${infoRow("D\u00e9part", endDate)}
      ${infoRow("Dur\u00e9e", `${days} jour${days > 1 ? "s" : ""}`)}
      ${infoRow("Parking", reservation.parking_lot.name)}
      ${infoRow("Statut", statusBadge(reservation.status))}
    </table>

    ${sectionTitle("V\u00e9hicule")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Type", vehicleTypeLabel(reservation.vehicle_type))}
      ${infoRow("Marque / Mod\u00e8le", `${reservation.vehicle_brand} ${reservation.vehicle_model}`)}
      ${infoRow("Couleur", reservation.vehicle_color)}
      ${infoRow("Immatriculation", `<strong>${reservation.vehicle_plate}</strong>`)}
    </table>

    ${optHtml}
    ${priceSummary(reservation.total_price, optTotal)}

    <div style="text-align: center; margin-top: 32px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/reservations" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4, #14b8a6); color: #ffffff; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 8px;">Voir dans l'administration</a>
    </div>
  `;

  return emailLayout("Nouvelle r\u00e9servation", content);
}

/**
 * Generate HTML content for reservation confirmation email
 */
export function generateReservationConfirmationEmail(reservation: any): string {
  const startDate = formatDate(reservation.start_date);
  const endDate = formatDate(reservation.end_date);
  const days = calculateDays(reservation.start_date, reservation.end_date);
  const { html: optHtml, total: optTotal } = optionsBlock(reservation);

  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #14b8a6); line-height: 56px; font-size: 24px; color: white; margin-bottom: 12px;">&#10003;</div>
      <h2 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #0c1821;">R\u00e9servation confirm\u00e9e</h2>
      <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">N\u00b0 <strong style="color: #0c1821; font-size: 16px;">${reservation.number || reservation.id.substring(0, 8)}</strong></p>
    </div>

    ${sectionTitle("D\u00e9tails de la r\u00e9servation")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Arriv\u00e9e", startDate)}
      ${infoRow("D\u00e9part", endDate)}
      ${infoRow("Dur\u00e9e", `${days} jour${days > 1 ? "s" : ""}`)}
      ${infoRow("Parking", reservation.parking_lot.name)}
      ${infoRow("Statut", statusBadge(reservation.status))}
    </table>

    ${sectionTitle("Votre v\u00e9hicule")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      ${infoRow("Type", vehicleTypeLabel(reservation.vehicle_type))}
      ${infoRow("Marque / Mod\u00e8le", `${reservation.vehicle_brand} ${reservation.vehicle_model}`)}
      ${infoRow("Couleur", reservation.vehicle_color)}
      ${infoRow("Immatriculation", `<strong>${reservation.vehicle_plate}</strong>`)}
    </table>

    ${optHtml}
    ${priceSummary(reservation.total_price, optTotal)}

    <div style="background: linear-gradient(135deg, #ecfeff 0%, #f0fdfa 100%); border: 1px solid #a5f3fc; border-radius: 8px; padding: 20px; margin-top: 28px; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #0c1821;">Merci d'avoir choisi ParkAero Direct</p>
      <p style="margin: 0; font-size: 13px; color: #64748b;">Si vous avez des questions, n'h\u00e9sitez pas \u00e0 nous contacter.</p>
    </div>
  `;

  return emailLayout("Confirmation de r\u00e9servation", content);
}
