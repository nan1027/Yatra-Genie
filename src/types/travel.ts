export type TravelType = 'solo' | 'family' | 'friends';
export type BudgetLevel = 'low' | 'medium' | 'high';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';
export type PlaceCategory = 'monument' | 'food' | 'nature' | 'adventure' | 'culture' | 'shopping';
export type TravelInterest =
  | 'adventure'
  | 'food'
  | 'culture'
  | 'nature'
  | 'nightlife'
  | 'shopping';
export type TripPace = 'relaxed' | 'packed';

export interface TripFormData {
  destination: string;
  days: number;
  travelType: TravelType;
  budgetLevel: BudgetLevel;
  interests: TravelInterest[];
  tripPace: TripPace;
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
  familyFriendly?: boolean;
  indoor?: boolean;
  nearbyAlternatives?: string[];
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

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
}

export interface AssistantHighlights {
  summary: string;
  weatherNote: string;
  paceNote: string;
  interestNote: string;
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
  budgetBreakdown: BudgetBreakdown;
  packingChecklist: string[];
  travelChecklist: string[];
  assistantHighlights: AssistantHighlights;
}

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

export const TRAVEL_INTEREST_OPTIONS: { value: TravelInterest; label: string }[] = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'food', label: 'Food' },
  { value: 'culture', label: 'Culture' },
  { value: 'nature', label: 'Nature' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
];

export const BUDGET_ESTIMATES: Record<BudgetLevel, { min: number; max: number; label: string }> = {
  low: { min: 1500, max: 3000, label: 'Budget' },
  medium: { min: 4000, max: 8000, label: 'Comfort' },
  high: { min: 10000, max: 25000, label: 'Luxury' },
};
