import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createReservation } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { user, reservation } = body;

    if (!user || !reservation) {
      return NextResponse.json(
        { error: "Données utilisateur ou réservation manquantes" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", user.email)
      .single();

    let userId;

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id;
    } else {
      // Create a new user in the users table (not in auth)
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: "guest", // Mark as guest user
          password: "********", // No password for guest users
        })
        .select("id")
        .single();

      if (createUserError) {
        console.error("Error creating guest user:", createUserError);
        return NextResponse.json(
          { error: "Erreur lors de la création de l'utilisateur invité" },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    // Create the reservation
    const reservationData = {
      user_id: userId,
      parking_lot_id: reservation.parking_lot_id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      vehicle_type: reservation.vehicle_type,
      vehicle_brand: reservation.vehicle_brand,
      vehicle_model: reservation.vehicle_model,
      vehicle_color: reservation.vehicle_color,
      vehicle_plate: reservation.vehicle_plate,
      options: reservation.options,
      departure_flight_number: reservation.departure_flight_number,
      return_flight_number: reservation.return_flight_number,
      number_of_people: reservation.number_of_people,
      cgu: reservation.cgv,
      cgv: reservation.cgv,
    };

    const result = await createReservation(reservationData);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Erreur lors de la création de la réservation",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      reservationId: result.id,
      totalPrice: result.totalPrice,
    });
  } catch (error: any) {
    console.error("Error in guest reservation API:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
