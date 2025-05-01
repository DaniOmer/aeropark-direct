import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendEmail,
  generateReservationConfirmationEmail,
} from "@/utils/email-service";
import { getReservationById } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    console.log("Received payment webhook request");

    // Parse the request body
    const body = await request.json();
    console.log("Webhook payload:", body);

    const { reservationId, paymentStatus, paymentId } = body;

    if (!reservationId || !paymentStatus) {
      console.log("Missing required parameters:", {
        reservationId,
        paymentStatus,
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Only process successful payments
    if (paymentStatus !== "succeeded") {
      return NextResponse.json(
        { message: `Payment status is ${paymentStatus}, no email sent` },
        { status: 200 }
      );
    }

    // Get the reservation details
    const reservation = await getReservationById(reservationId);

    if (!reservation) {
      console.error("Reservation not found:", reservationId);
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Get user details from the reservation
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", reservation.user_id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate email content
    const htmlContent = generateReservationConfirmationEmail(reservation);

    // Send confirmation email
    const emailResult = await sendEmail({
      to: [
        {
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
        },
      ],
      subject: `Confirmation de réservation #${reservation.number || reservation.id.substring(0, 8)}`,
      htmlContent,
    });

    if (!emailResult.success) {
      console.error("Error sending confirmation email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

    console.log("Confirmation email sent successfully");
    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
    });
  } catch (error: any) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
