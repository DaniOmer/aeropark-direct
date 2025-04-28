import React from "react";

export default function PaymentMethods() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center md:text-left md:w-1/3">
              <h3 className="text-xl font-bold mb-4">
                Moyens de paiement acceptés
              </h3>
              <p className="text-muted-foreground">
                Nous acceptons plusieurs méthodes de paiement sécurisées pour
                votre confort.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 md:w-2/3">
              {/* Credit Card */}
              <div className="w-16 h-16 bg-card rounded-lg shadow-sm flex items-center justify-center p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>

              {/* Visa */}
              <div className="w-16 h-16 bg-card rounded-lg shadow-sm flex items-center justify-center p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="h-full w-full text-blue-600"
                >
                  <path
                    fill="currentColor"
                    d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.9 4 29.5 9.8 42.3 17.1l35.7 135h42.8zm94.5.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z"
                  />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="w-16 h-16 bg-card rounded-lg shadow-sm flex items-center justify-center p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="h-full w-full"
                >
                  <path
                    fill="#FF5F00"
                    d="M492.4 220.8c-8.9-53.2-63.5-91.5-125.9-90.6 -38.2.5-75 17.4-100.4 46.6 -39.9-29.3-95.7-29.3-135.6 0 -40.5-37.3-103.7-36.4-143.1 1.9 -13.5 13.1-24.4 29.5-31.4 47.7 -17.4 45.1-8.3 95.6 23.4 133.3 10.5 12.4 23.3 22.4 37.7 29.7 40.1 20.5 89.1 18.3 127.8-5.8 34.8 21.9 79.2 21.9 114 0 37.6 23.3 85 26.3 125.6 7.8 34.2-15.6 61.7-44.9 75.3-80.8C477.2 277.4 484.2 247.9 492.4 220.8z"
                  />
                  <path
                    fill="#EB001B"
                    d="M306.9 143.9c-38.2.5-75 17.4-100.4 46.6 -39.9-29.3-95.7-29.3-135.6 0 -40.5-37.3-103.7-36.4-143.1 1.9 -13.5 13.1-24.4 29.5-31.4 47.7 -17.4 45.1-8.3 95.6 23.4 133.3 10.5 12.4 23.3 22.4 37.7 29.7 40.1 20.5 89.1 18.3 127.8-5.8 34.8 21.9 79.2 21.9 114 0 37.6 23.3 85 26.3 125.6 7.8 34.2-15.6 61.7-44.9 75.3-80.8 13.5-35.8 20.5-65.3 28.7-92.4C366.4 181.3 311.8 143 249.4 143.9 235.2 144.1 321 144.1 306.9 143.9z"
                  />
                  <path
                    fill="#F79E1B"
                    d="M492.4 220.8c-8.9-53.2-63.5-91.5-125.9-90.6 -38.2.5-75 17.4-100.4 46.6 -39.9-29.3-95.7-29.3-135.6 0 -40.5-37.3-103.7-36.4-143.1 1.9 -13.5 13.1-24.4 29.5-31.4 47.7 -17.4 45.1-8.3 95.6 23.4 133.3 10.5 12.4 23.3 22.4 37.7 29.7 40.1 20.5 89.1 18.3 127.8-5.8 34.8 21.9 79.2 21.9 114 0 37.6 23.3 85 26.3 125.6 7.8 34.2-15.6 61.7-44.9 75.3-80.8C477.2 277.4 484.2 247.9 492.4 220.8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
