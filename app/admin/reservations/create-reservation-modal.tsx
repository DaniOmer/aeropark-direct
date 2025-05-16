"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToastContext } from "@/components/providers/toast-provider";
import {
  ParkingLotData,
  UserData,
  OptionData,
  ReservationWithOptions,
  getAllOptionsData,
  calculatePriceByDuration,
} from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

type CreateReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  parkingLots: ParkingLotData[];
  users: UserData[];
};

export type ReservationFormData = ReservationWithOptions;

export default function CreateReservationModal({
  isOpen,
  onClose,
  onSubmit,
  parkingLots,
  users,
}: CreateReservationModalProps) {
  const { addToast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    { option_id: string; quantity: number }[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [optionsPrice, setOptionsPrice] = useState<number>(0);
  const [peopleAdditionalFee, setPeopleAdditionalFee] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  // État pour gérer le type d'utilisateur (existant ou nouveau)
  const [userType, setUserType] = useState<"existing" | "new">("existing");

  // État pour les informations d'un nouvel utilisateur
  const [newUserData, setNewUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState<ReservationFormData>({
    user_id: "",
    parking_lot_id: parkingLots.length > 0 ? parkingLots[0].id : "",
    start_date: "",
    end_date: "",
    vehicle_type: "small_car", // Default to small car
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_color: "",
    vehicle_plate: "",
    departure_flight_number: "",
    return_flight_number: "",
    number_of_people: 1,
    options: [],
    cgv: false,
    cgu: false,
  });

  // Fetch options when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setCapacityError(null);
      // Réinitialiser tous les états
      setUserType("existing");
      setNewUserData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      setFormData({
        user_id: "",
        parking_lot_id: parkingLots.length > 0 ? parkingLots[0].id : "",
        start_date: "",
        end_date: "",
        vehicle_type: "small_car",
        vehicle_brand: "",
        vehicle_model: "",
        vehicle_color: "",
        vehicle_plate: "",
        departure_flight_number: "",
        return_flight_number: "",
        number_of_people: 1,
        options: [],
        cgv: false,
        cgu: false,
      });
      setSelectedOptions([]);

      // Fetch available options
      const fetchOptions = async () => {
        setIsLoadingOptions(true);
        try {
          const optionsData = await getAllOptionsData();
          // Filter only active options
          setOptions(optionsData.filter((opt) => opt.is_active));
        } catch (error) {
          console.error("Error fetching options:", error);
          addToast("Erreur lors du chargement des options", "error");
        } finally {
          setIsLoadingOptions(false);
        }
      };

      fetchOptions();
    }
  }, [isOpen, parkingLots, addToast]);

  // Générer les options d'heures valides (de 3:30 à 00:30 par intervalles de 5 minutes)
  const generateTimeOptions = () => {
    const options = [];

    // Heures de 3 à 23
    for (let hour = 3; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        // Sauter 3:00, 3:10, 3:20 car on commence à 3:30
        if (hour === 3 && minute < 30) continue;

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`;
        const timeLabel = `${formattedHour}:${formattedMinute}`;

        options.push({ value: timeValue, label: timeLabel });
      }
    }

    // Ajouter 00:00, 00:05, 00:10, 00:15, 00:20, 00:25, 00:30
    for (let minute = 0; minute <= 30; minute += 5) {
      const timeValue = `00:${minute.toString().padStart(2, "0")}`;
      const timeLabel = `00:${minute.toString().padStart(2, "0")}`;

      options.push({ value: timeValue, label: timeLabel });
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  // États pour gérer séparément les dates et les heures
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Mettre à jour formData quand les dates ou heures changent
  useEffect(() => {
    if (startDate && startTime) {
      setFormData({
        ...formData,
        start_date: `${startDate}T${startTime}:00`,
      });
    }
  }, [startDate, startTime]);

  useEffect(() => {
    if (endDate && endTime) {
      setFormData({
        ...formData,
        end_date: `${endDate}T${endTime}:00`,
      });
    }
  }, [endDate, endTime]);

  // Calculer le prix quand les dates, les options ou le nombre de personnes changent
  useEffect(() => {
    const calculatePrice = async () => {
      if (!startDate || !endDate || !formData.parking_lot_id) {
        setCalculatedPrice(null);
        return;
      }

      setIsCalculatingPrice(true);

      try {
        // Calculer le nombre de jours
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        setDays(calculatedDays);

        // Récupérer le prix actif pour ce parking
        const supabase = await createClient();
        const { data: priceData, error: priceError } = await supabase
          .from("prices")
          .select("*")
          .eq("parking_lot_id", formData.parking_lot_id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (priceError || !priceData) {
          console.error("Erreur lors de la récupération du prix:", priceError);
          setCalculatedPrice(null);
          return;
        }

        // Obtenir le prix pour la durée
        const { price: durationPrice, error: durationPriceError } =
          await calculatePriceByDuration(
            calculatedDays,
            priceData.id // Utiliser l'ID du prix, pas l'ID du parking
          );

        if (durationPriceError) {
          console.error("Erreur lors du calcul du prix:", durationPriceError);
          setCalculatedPrice(null);
          return;
        }

        setBasePrice(durationPrice || 0);

        // Calculer le prix des options
        const calculatedOptionsPrice = selectedOptions.reduce((total, opt) => {
          const option = options.find((o) => o.id === opt.option_id);
          return total + (option ? option.price * opt.quantity : 0);
        }, 0);
        setOptionsPrice(calculatedOptionsPrice);

        // Calculer le supplément pour le nombre de personnes
        // Note: Nous utilisons des valeurs par défaut car nous n'avons pas accès aux données de prix
        const peopleThreshold = 4; // Valeur par défaut
        const additionalPeopleFee = 8.0; // Valeur par défaut
        let calculatedPeopleAdditionalFee = 0;
        const numberOfPeople = formData.number_of_people || 1;
        if (numberOfPeople > peopleThreshold) {
          calculatedPeopleAdditionalFee = additionalPeopleFee;
        }
        setPeopleAdditionalFee(calculatedPeopleAdditionalFee);

        // Calculer le prix total
        const total =
          durationPrice +
          calculatedOptionsPrice +
          calculatedPeopleAdditionalFee;
        setCalculatedPrice(total);
      } catch (error) {
        console.error("Erreur lors du calcul du prix:", error);
        setCalculatedPrice(null);
      } finally {
        setIsCalculatingPrice(false);
      }
    };

    calculatePrice();
  }, [
    startDate,
    endDate,
    formData.parking_lot_id,
    formData.number_of_people,
    selectedOptions,
    options,
    parkingLots,
  ]);

  // Extraire la date et l'heure quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser les champs de date et heure
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    }
  }, [isOpen]);

  // Gérer les changements dans les champs du nouvel utilisateur
  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUserData({
      ...newUserData,
      [name]: value,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Gérer le changement de type d'utilisateur
    if (name === "userType") {
      setUserType(value as "existing" | "new");
      return;
    }

    // Ignorer les champs start_date et end_date car ils sont gérés séparément
    if (name !== "start_date" && name !== "end_date") {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear capacity error when vehicle type or dates change
    if (
      name === "vehicle_type" ||
      name === "start_date" ||
      name === "end_date" ||
      name === "parking_lot_id"
    ) {
      setCapacityError(null);
    }
  };

  // Handle option selection
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      // Add option with quantity 1
      setSelectedOptions([
        ...selectedOptions,
        { option_id: optionId, quantity: 1 },
      ]);
    } else {
      // Remove option
      setSelectedOptions(
        selectedOptions.filter((opt) => opt.option_id !== optionId)
      );
    }
  };

  // Handle option quantity change
  const handleQuantityChange = (optionId: string, quantity: number) => {
    setSelectedOptions(
      selectedOptions.map((opt) =>
        opt.option_id === optionId ? { ...opt, quantity } : opt
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setCapacityError(null);

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const now = new Date();

    // Check if start date is in the past
    if (startDate < now) {
      setError("La date d'arrivée ne peut pas être dans le passé");
      setIsSubmitting(false);
      addToast("La date d'arrivée ne peut pas être dans le passé", "error");
      return;
    }

    // Check if end date is before start date
    if (endDate <= startDate) {
      setError("La date de départ doit être postérieure à la date d'arrivée");
      setIsSubmitting(false);
      addToast(
        "La date de départ doit être postérieure à la date d'arrivée",
        "error"
      );
      return;
    }

    try {
      // Préparer les données de réservation
      let dataWithOptions = {
        ...formData,
        options: selectedOptions.length > 0 ? selectedOptions : undefined,
      };

      // Si c'est un nouvel utilisateur, ajouter les informations de l'utilisateur
      if (userType === "new") {
        // Vérifier que tous les champs obligatoires sont remplis
        if (
          !newUserData.first_name ||
          !newUserData.last_name ||
          !newUserData.email
        ) {
          setError(
            "Veuillez remplir tous les champs obligatoires pour le nouvel utilisateur"
          );
          setIsSubmitting(false);
          return;
        }

        // Ajouter les informations du nouvel utilisateur
        dataWithOptions = {
          ...dataWithOptions,
          new_user: newUserData,
        } as any; // Utiliser any pour éviter les problèmes de typage
      } else if (!formData.user_id) {
        // Si c'est un utilisateur existant, vérifier qu'un utilisateur est sélectionné
        setError("Veuillez sélectionner un utilisateur");
        setIsSubmitting(false);
        return;
      }

      await onSubmit(dataWithOptions);
      onClose();
      addToast("Réservation créée avec succès", "success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";

      // Check if it's a capacity error
      if (errorMessage.includes("capacité")) {
        setCapacityError(errorMessage);
      } else {
        setError(errorMessage);
      }

      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Créer une réservation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Type d'utilisateur */}
            <div>
              <Label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type de client
              </Label>
              <select
                id="userType"
                name="userType"
                value={userType}
                onChange={(e) =>
                  setUserType(e.target.value as "existing" | "new")
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="existing">Client existant</option>
                <option value="new">Nouveau client</option>
              </select>
            </div>

            {/* Client selection or new client form */}
            {userType === "existing" ? (
              <div>
                <Label
                  htmlFor="user_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Client existant
                </Label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required={userType === "existing"}
                >
                  <option value="">Sélectionnez un client</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informations du nouveau client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prénom
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={newUserData.first_name}
                      onChange={handleNewUserChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={userType === "new"}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nom
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={newUserData.last_name}
                      onChange={handleNewUserChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={userType === "new"}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newUserData.email}
                      onChange={handleNewUserChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={userType === "new"}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newUserData.phone}
                      onChange={handleNewUserChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Parking lot selection */}
            <div>
              <Label
                htmlFor="parking_lot_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Parking
              </Label>
              <select
                id="parking_lot_id"
                name="parking_lot_id"
                value={formData.parking_lot_id}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {parkingLots.map((parkingLot) => (
                  <option key={parkingLot.id} value={parkingLot.id}>
                    {parkingLot.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date d'arrivée
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Heure d'arrivée
                  </Label>
                  <select
                    id="start_time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Sélectionnez une heure</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date de départ
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || format(new Date(), "yyyy-MM-dd")}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Heure de départ
                  </Label>
                  <select
                    id="end_time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Sélectionnez une heure</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle type */}
            <div>
              <Label
                htmlFor="vehicle_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type de véhicule
              </Label>
              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="small_car">Voiture petite</option>
                <option value="large_car">Voiture grande</option>
                <option value="small_motorcycle">Moto petite</option>
                <option value="large_motorcycle">Moto grande</option>
              </select>
            </div>

            {/* Vehicle details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="vehicle_brand"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Marque
                </Label>
                <Input
                  id="vehicle_brand"
                  name="vehicle_brand"
                  value={formData.vehicle_brand}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_model"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Modèle
                </Label>
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_color"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Couleur
                </Label>
                <Input
                  id="vehicle_color"
                  name="vehicle_color"
                  value={formData.vehicle_color}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="vehicle_plate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Immatriculation
                </Label>
                <Input
                  id="vehicle_plate"
                  name="vehicle_plate"
                  value={formData.vehicle_plate}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="departure_flight_number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Numéro de vol aller
                </Label>
                <Input
                  id="departure_flight_number"
                  name="departure_flight_number"
                  value={formData.departure_flight_number}
                  onChange={handleChange}
                  placeholder="Ex: AF1234"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="return_flight_number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Numéro de vol retour
                </Label>
                <Input
                  id="return_flight_number"
                  name="return_flight_number"
                  value={formData.return_flight_number}
                  onChange={handleChange}
                  placeholder="Ex: AF1234"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="number_of_people"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nombre de personnes
                </Label>
                <select
                  id="number_of_people"
                  name="number_of_people"
                  value={formData.number_of_people}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "personne" : "personnes"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Options supplémentaires
              </h3>

              {isLoadingOptions ? (
                <div className="flex justify-center items-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Chargement des options...
                  </span>
                </div>
              ) : options.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune option disponible
                </p>
              ) : (
                <div className="space-y-4">
                  {options.map((option) => {
                    const isSelected = selectedOptions.some(
                      (opt) => opt.option_id === option.id
                    );
                    const selectedOption = selectedOptions.find(
                      (opt) => opt.option_id === option.id
                    );

                    return (
                      <div
                        key={option.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                      >
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <Checkbox
                              id={`option-${option.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleOptionChange(
                                  option.id,
                                  checked as boolean
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <Label
                              htmlFor={`option-${option.id}`}
                              className="font-medium text-gray-700 dark:text-gray-300"
                            >
                              {option.name} - {option.price} €
                            </Label>
                            {option.description && (
                              <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 ml-7">
                            <Label
                              htmlFor={`quantity-${option.id}`}
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Quantité
                            </Label>
                            <Input
                              id={`quantity-${option.id}`}
                              type="number"
                              min="1"
                              value={selectedOption?.quantity || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  option.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Capacity error message */}
            {capacityError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{capacityError}</span>
                </div>
              </div>
            )}

            {/* General error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
                {error}
              </div>
            )}

            {/* Récapitulatif du prix */}
            {calculatedPrice !== null && (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Récapitulatif du prix
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Durée:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {days} jour{days > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Prix de base:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {basePrice.toFixed(2)} €
                    </span>
                  </div>
                  {optionsPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Options:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {optionsPrice.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  {peopleAdditionalFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Supplément personnes:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {peopleAdditionalFee.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total:
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {calculatedPrice.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            {/* <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="cgv"
                  checked={formData.cgv}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, cgv: checked as boolean })
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="cgv"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  J'accepte les conditions générales de vente
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="cgu"
                  checked={formData.cgu}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, cgu: checked as boolean })
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="cgu"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  J'accepte les conditions générales d'utilisation
                </Label>
              </div>
            </div> */}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Création..." : "Créer la réservation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
