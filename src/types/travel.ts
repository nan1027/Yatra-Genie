// Types for India Travel Planner

export type TravelType = 'solo' | 'family' | 'friends';
export type BudgetLevel = 'low' | 'medium' | 'high';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
export type PlaceCategory = 'monument' | 'food' | 'nature' | 'adventure' | 'culture' | 'shopping';

export interface TripFormData {
  destination: string;
  days: number;
  travelType: TravelType;
  budgetLevel: BudgetLevel;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  budgetTier: BudgetLevel;
  estimatedCost: number;
  duration: string;
  rating?: number;
  imageUrl?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  icon: string;
  description: string;
}

export interface DayActivity {
  time: TimeOfDay;
  place: Place;
  tips: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: DayActivity[];
  dailyBudget: number;
}

export interface Itinerary {
  destination: string;
  totalDays: number;
  travelType: TravelType;
  weather: WeatherData;
  totalBudget: number;
  days: ItineraryDay[];
  tips: string[];
  imageUrl: string;
}

// Indian cities for the destination selector
export const INDIAN_CITIES = [
  'Agra',
  'Ahmedabad',
  'Amritsar',
  'Bangalore',
  'Chennai',
  'Delhi',
  'Goa',
  'Hyderabad',
  'Jaipur',
  'Jaisalmer',
  'Jodhpur',
  'Kochi',
  'Kolkata',
  'Leh-Ladakh',
  'Manali',
  'Mumbai',
  'Mysore',
  'Pondicherry',
  'Rishikesh',
  'Shimla',
  'Udaipur',
  'Varanasi',
];

// Budget estimates per day (in INR)
export const BUDGET_ESTIMATES: Record<BudgetLevel, { min: number; max: number; label: string }> = {
  low: { min: 1500, max: 3000, label: 'Budget' },
  medium: { min: 4000, max: 8000, label: 'Comfort' },
  high: { min: 10000, max: 25000, label: 'Luxury' },
};
