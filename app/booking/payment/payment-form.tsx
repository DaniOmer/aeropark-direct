"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { recordPayment } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Load Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

// Card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

// Create a payment intent on the server
const createPaymentIntent = async (reservationId: string, amount: number) => {
  try {
    console.log("Sending request to /api/create-payment-intent");

    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId,
        amount,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Stripe checkout form component
const CheckoutForm = ({
  reservationId,
  amount,
}: {
  reservationId: string;
  amount: number;
}) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const getPaymentIntent = async () => {
      try {
        console.log(
          "Creating payment intent for reservation:",
          reservationId,
          "amount:",
          amount
        );
        const response = await createPaymentIntent(reservationId, amount);

        // If there's an error message from the server, display it
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.clientSecret) {
          throw new Error("No client secret returned from the server");
        }

        setClientSecret(response.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(
          `Une erreur est survenue lors de la préparation du paiement: ${err instanceof Error ? err.message : "Erreur inconnue"}`
        );
      }
    };

    getPaymentIntent();
  }, [reservationId, amount]);

  const handleChange = (event: any) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded
      return;
    }

    if (!cardholderName) {
      setError("Veuillez entrer le nom du titulaire de la carte");
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log("Client secret before payment confirmation:", clientSecret);

      if (!clientSecret) {
        throw new Error("Client secret is missing. Please try again later.");
      }

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (error) {
        setError(`Erreur de paiement: ${error.message}`);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Record the payment in our database
        const result = await recordPayment(
          reservationId,
          amount,
          "card",
          paymentIntent.status,
          paymentIntent.id
        );

        if (!result.success) {
          setError(
            "Le paiement a réussi mais nous n'avons pas pu enregistrer la transaction. Veuillez contacter le support."
          );
          setProcessing(false);
          return;
        }

        setSucceeded(true);
        setProcessing(false);

        // Redirect to confirmation page
        window.location.href = `/booking/confirmation?id=${reservationId}`;
      } else {
        setError(
          `Le paiement n'a pas été complété. Statut: ${paymentIntent.status}`
        );
        setProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(`Une erreur est survenue lors du paiement: ${err.message}`);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="cardholder-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nom du titulaire de la carte
        </label>
        <Input
          id="cardholder-name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Nom et prénom"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Informations de carte
        </label>
        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
          <CardElement
            id="card-element"
            options={cardElementOptions}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          disabled={processing || disabled || succeeded}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md"
        >
          {processing ? "Traitement en cours..." : `Payer ${amount} €`}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Paiement sécurisé par Stripe</p>
        <p className="mt-1">Vos informations de paiement sont sécurisées</p>
      </div>
    </form>
  );
};

// Main payment form component
export default function PaymentForm({
  reservationId,
  amount,
}: {
  reservationId: string;
  amount: number;
}) {
  const [cgvAccepted, setCgvAccepted] = useState(false);

  return (
    <Elements stripe={stripePromise}>
      <div className="space-y-6">
        {/* CGV Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cgv"
            checked={cgvAccepted}
            onCheckedChange={(checked) => setCgvAccepted(checked as boolean)}
            required
          />
          <Label htmlFor="cgv" className="text-sm text-gray-600">
            J'accepte les{" "}
            <a
              href="/cgv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              conditions générales de vente
            </a>
          </Label>
        </div>

        {cgvAccepted ? (
          <CheckoutForm reservationId={reservationId} amount={amount} />
        ) : (
          <div className="text-center text-gray-600">
            Veuillez accepter les conditions générales de vente pour procéder au
            paiement
          </div>
        )}
      </div>
    </Elements>
  );
}
