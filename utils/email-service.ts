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

/**
 * Generate HTML content for login notification email
 * @param userEmail The email of the user who logged in
 * @returns HTML content string
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notification de connexion - ParkAero Direct</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin-bottom: 10px;">Notification de connexion</h1>
        <p style="font-size: 16px; color: #6b7280;">
          Une connexion a été effectuée sur votre application.
        </p>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Détails de la connexion</h2>
        
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Utilisateur</p>
          <p style="font-weight: 500; margin-top: 0;">${userEmail}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Date et heure</p>
          <p style="font-weight: 500; margin-top: 0;">${loginTime}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
        <p>Ceci est un email automatique envoyé pour tester le système d'envoi d'emails.</p>
        <p>© ${new Date().getFullYear()} ParkAero Direct. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send an email using Brevo API
 * @param emailData The email data to send
 * @returns Promise with the API response
 */
export async function sendEmail(emailData: EmailData): Promise<any> {
  try {
    // Create send email request
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Set sender (default if not provided)
    sendSmtpEmail.sender = emailData.sender || {
      name: "ParkAero Direct",
      email: "aeroparkdirect@hotmail.com",
    };

    // Set recipients
    sendSmtpEmail.to = emailData.to;

    // Set email content
    sendSmtpEmail.subject = emailData.subject;
    sendSmtpEmail.htmlContent = emailData.htmlContent;

    if (emailData.textContent) {
      sendSmtpEmail.textContent = emailData.textContent;
    }

    // Send the email
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
 * Generate HTML content for reservation confirmation email
 * @param reservation The reservation data
 * @returns HTML content string
 */
/**
 * Generate HTML content for admin notification email
 * @param reservation The reservation data
 * @param user The user data
 * @returns HTML content string
 */
export function generateAdminNotificationEmail(
  reservation: any,
  user: any
): string {
  // Format dates
  const startDate = new Date(reservation.start_date).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const endDate = new Date(reservation.end_date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate duration
  const start = new Date(reservation.start_date);
  const end = new Date(reservation.end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Calculate options total if available
  let optionsTotal = 0;
  let optionsHtml = "";

  if (
    reservation.reservation_options &&
    reservation.reservation_options.length > 0
  ) {
    optionsTotal = reservation.reservation_options.reduce(
      (total: number, opt: any) => total + opt.option.price * opt.quantity,
      0
    );

    optionsHtml = `
      <h3 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">Options</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Option</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Quantité</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Prix unitaire</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${reservation.reservation_options
            .map(
              (option: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.price} €</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.price * option.quantity} €</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Generate HTML content
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle réservation - ParkAero Direct</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin-bottom: 10px;">Nouvelle réservation</h1>
        <p style="font-size: 16px; color: #6b7280;">
          Une nouvelle réservation a été effectuée. Numéro de réservation: 
          <span style="font-weight: bold;">${reservation.number || reservation.id.substring(0, 8)}</span>
        </p>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Informations client</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Nom</p>
            <p style="font-weight: 500; margin-top: 0;">${user.first_name} ${user.last_name}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Email</p>
            <p style="font-weight: 500; margin-top: 0;">${user.email}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Téléphone</p>
            <p style="font-weight: 500; margin-top: 0;">${user.phone}</p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Détails de la réservation</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Date d'arrivée</p>
            <p style="font-weight: 500; margin-top: 0;">${startDate}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Date de départ</p>
            <p style="font-weight: 500; margin-top: 0;">${endDate}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Type de véhicule</p>
            <p style="font-weight: 500; margin-top: 0;">
              ${
                reservation.vehicle_type === "small_car"
                  ? "Voiture"
                  : reservation.vehicle_type === "small_motorcycle"
                    ? "Moto"
                    : reservation.vehicle_type
              }
            </p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Durée</p>
            <p style="font-weight: 500; margin-top: 0;">${days} jour${days > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Parking</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.parking_lot.name}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Statut</p>
            <p style="font-weight: 500; margin-top: 0;">
              ${
                reservation.status === "confirmed"
                  ? "Confirmée"
                  : reservation.status === "pending"
                    ? "En attente"
                    : reservation.status === "cancelled"
                      ? "Annulée"
                      : reservation.status === "completed"
                        ? "Terminée"
                        : reservation.status
              }
            </p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Informations du véhicule</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Marque</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_brand}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Modèle</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_model}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Couleur</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_color}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Immatriculation</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_plate}</p>
          </div>
        </div>
      </div>
      
      ${optionsHtml}
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 16px; font-weight: 500;">Prix de base</span>
          <span style="font-size: 16px;">${reservation.total_price - optionsTotal} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 16px; font-weight: 500;">Options</span>
          <span style="font-size: 16px;">${optionsTotal} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <span style="font-size: 18px; font-weight: 700;">Total</span>
          <span style="font-size: 18px; font-weight: 700;">${reservation.total_price} €</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/reservations" style="display: inline-block; background-color: #3b82f6; color: white; font-weight: 500; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
          Voir les détails dans l'administration
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
        <p>© ${new Date().getFullYear()} ParkAero Direct. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML content for reservation confirmation email
 * @param reservation The reservation data
 * @returns HTML content string
 */
export function generateReservationConfirmationEmail(reservation: any): string {
  // Format dates
  const startDate = new Date(reservation.start_date).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const endDate = new Date(reservation.end_date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate duration
  const start = new Date(reservation.start_date);
  const end = new Date(reservation.end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Calculate options total if available
  let optionsTotal = 0;
  let optionsHtml = "";

  if (
    reservation.reservation_options &&
    reservation.reservation_options.length > 0
  ) {
    optionsTotal = reservation.reservation_options.reduce(
      (total: number, opt: any) => total + opt.option.price * opt.quantity,
      0
    );

    optionsHtml = `
      <h3 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">Options</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Option</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Quantité</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Prix unitaire</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${reservation.reservation_options
            .map(
              (option: any) => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.price} €</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${option.option.price * option.quantity} €</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Generate HTML content
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de réservation - ParkAero Direct</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin-bottom: 10px;">Confirmation de réservation</h1>
        <p style="font-size: 16px; color: #6b7280;">
          Merci pour votre réservation. Votre numéro de réservation est 
          <span style="font-weight: bold;">${reservation.number || reservation.id.substring(0, 8)}</span>
        </p>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Détails de la réservation</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Date d'arrivée</p>
            <p style="font-weight: 500; margin-top: 0;">${startDate}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Date de départ</p>
            <p style="font-weight: 500; margin-top: 0;">${endDate}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Type de véhicule</p>
            <p style="font-weight: 500; margin-top: 0;">
              ${
                reservation.vehicle_type === "small_car"
                  ? "Voiture"
                  : reservation.vehicle_type === "small_motorcycle"
                    ? "Moto"
                    : reservation.vehicle_type
              }
            </p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Durée</p>
            <p style="font-weight: 500; margin-top: 0;">${days} jour${days > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Parking</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.parking_lot.name}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Statut</p>
            <p style="font-weight: 500; margin-top: 0;">
              ${
                reservation.status === "confirmed"
                  ? "Confirmée"
                  : reservation.status === "pending"
                    ? "En attente"
                    : reservation.status === "cancelled"
                      ? "Annulée"
                      : reservation.status === "completed"
                        ? "Terminée"
                        : reservation.status
              }
            </p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Informations du véhicule</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Marque</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_brand}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Modèle</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_model}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Couleur</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_color}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Immatriculation</p>
            <p style="font-weight: 500; margin-top: 0;">${reservation.vehicle_plate}</p>
          </div>
        </div>
      </div>
      
      ${optionsHtml}
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 16px; font-weight: 500;">Prix de base : </span>
          <span style="font-size: 16px;">${reservation.total_price - optionsTotal} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 16px; font-weight: 500;">Options :</span>
          <span style="font-size: 16px;">${optionsTotal} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <span style="font-size: 18px; font-weight: 700;">Total : </span>
          <span style="font-size: 18px; font-weight: 700;">${reservation.total_price} €</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px; color: #6b7280;">
        <p>Merci d'avoir choisi ParkAero Direct pour votre stationnement.</p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
        <p>© ${new Date().getFullYear()} ParkAero Direct. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
}
