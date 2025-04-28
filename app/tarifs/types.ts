// Types for the pricing UI
export type UIPricingPlan = {
  id: string;
  name: string;
  duration: string;
  price: number;
  features: string[];
  base_duration_days: number;
  additional_day_price: number;
  late_fee: number;
  popular: boolean;
};
