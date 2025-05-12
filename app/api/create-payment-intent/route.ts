import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

// Log the Stripe key (masked for security)
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
console.log("Stripe key available:", !!stripeKey, "Length:", stripeKey.length);
if (!stripeKey) {
  console.error(
    "Stripe key is missing or empty! Make sure STRIPE_SECRET_KEY is set in your .env file"
  );
}

// Initialize Stripe with the secret key
let stripe: Stripe;
try {
  stripe = new Stripe(stripeKey, {
    apiVersion: "2025-04-30.basil", // Use the latest API version
  });
  console.log("Stripe initialized successfully");
} catch (error) {
  console.error("Error initializing Stripe:", error);
  throw new Error("Failed to initialize Stripe payment provider");
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received create-payment-intent request");

    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);

    const { reservationId, amount } = body;

    if (!reservationId || !amount) {
      console.log("Missing required parameters:", { reservationId, amount });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get the reservation details to verify it exists and is pending
    const supabase = await createClient();
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .select("id, status, total_price")
      .eq("id", reservationId)
      .single();

    if (reservationError || !reservation) {
      console.error("Error fetching reservation:", reservationError);
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status !== "pending") {
      return NextResponse.json(
        { error: "Reservation is not in pending status" },
        { status: 400 }
      );
    }

    // Verify the amount matches the reservation total price
    if (reservation.total_price !== amount) {
      return NextResponse.json(
        { error: "Amount does not match reservation price" },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    console.log("Creating payment intent with Stripe:", {
      amount: Math.round(amount * 100),
      currency: "eur",
      reservationId,
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: "eur",
        metadata: {
          reservationId,
        },
        // In a production app, you might want to capture customer details
        // and set up automatic payment methods
      });

      console.log("Payment intent created successfully:", {
        id: paymentIntent.id,
        hasClientSecret: !!paymentIntent.client_secret,
      });

      // Return the client secret to the client
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (stripeError: any) {
      console.error("Stripe error creating payment intent:", stripeError);

      // Return a clear error message to the client
      return NextResponse.json(
        {
          error:
            "Erreur lors de la création du paiement. Veuillez réessayer ou contacter le support.",
          details: stripeError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
