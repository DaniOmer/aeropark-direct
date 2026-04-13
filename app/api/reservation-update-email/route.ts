import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendEmail,
  generateReservationUpdateEmail,
} from "@/utils/email-service";
import { getReservationById } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    const { reservationId, amountDueOnArrival } = await request.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: "Missing reservationId" },
        { status: 400 }
      );
    }

    const reservation = await getReservationById(reservationId);
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Get user details
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", reservation.user_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate and send update email
    const htmlContent = generateReservationUpdateEmail(
      reservation,
      amountDueOnArrival || 0
    );

    const emailResult = await sendEmail({
      to: [
        {
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
        },
      ],
      subject: `Modification de votre réservation #${reservation.number || reservation.id.substring(0, 8)}`,
      htmlContent,
    });

    if (!emailResult.success) {
      console.error("Error sending update email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in reservation update email API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
