import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Wallet, Sparkles, HeartHandshake, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TripFormData,
  INDIAN_CITIES,
  TravelType,
  BudgetLevel,
  TRAVEL_INTEREST_OPTIONS,
  TravelInterest,
  TripPace,
} from '@/types/travel';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    days: 3,
    travelType: 'solo',
    budgetLevel: 'medium',
    interests: ['culture', 'food'],
    tripPace: 'relaxed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination) {
      onSubmit(formData);
    }
  };

  const toggleInterest = (interest: TravelInterest) => {
    const nextInterests = formData.interests.includes(interest)
      ? formData.interests.filter((item) => item !== interest)
      : [...formData.interests, interest];

    setFormData({
      ...formData,
      interests: nextInterests,
    });
  };

  const travelTypes: { value: TravelType; label: string; icon: string }[] = [
    { value: 'solo', label: 'Solo', icon: 'Backpack' },
    { value: 'family', label: 'Family', icon: 'Family' },
    { value: 'friends', label: 'Friends', icon: 'Group' },
  ];

  const budgetLevels: { value: BudgetLevel; label: string; icon: string; desc: string }[] = [
    { value: 'low', label: 'Budget', icon: 'Save', desc: 'INR 1.5K-3K/day' },
    { value: 'medium', label: 'Comfort', icon: 'Balance', desc: 'INR 4K-8K/day' },
    { value: 'high', label: 'Luxury', icon: 'Premium', desc: 'INR 10K-25K/day' },
  ];

  const paceOptions: { value: TripPace; label: string; description: string }[] = [
    { value: 'relaxed', label: 'Relaxed', description: 'Breathing room, slower days, buffer time' },
    { value: 'packed', label: 'Packed', description: 'More stops, fuller days, high-energy plan' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="glass-card mx-auto max-w-2xl space-y-6 p-6 md:p-8"
    >
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <MapPin className="w-4 h-4 text-primary" />
          Destination
        </label>
        <div className="relative">
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="h-12 w-full appearance-none rounded-xl border border-border bg-muted/50 px-4 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          >
            <option value="" disabled>Select an Indian city</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            v
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <Calendar className="w-4 h-4 text-primary" />
          Number of Days
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="14"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: Number.parseInt(e.target.value, 10) })}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
          <span className="flex h-12 w-16 items-center justify-center rounded-xl bg-primary/20 font-semibold text-primary">
            {formData.days}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <Users className="w-4 h-4 text-primary" />
          Travel Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {travelTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, travelType: type.value })}
              className={`rounded-xl border p-4 transition-all duration-300 ${
                formData.travelType === type.value
                  ? 'border-primary bg-primary/20 shadow-glow'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="mb-1 text-sm font-semibold">{type.label}</div>
              <div className="text-xs text-muted-foreground">{type.icon}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <Wallet className="w-4 h-4 text-primary" />
          Budget Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {budgetLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, budgetLevel: level.value })}
              className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                formData.budgetLevel === level.value
                  ? 'border-primary bg-primary/20 shadow-glow'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="mb-1 text-sm font-semibold">{level.label}</div>
              <div className="text-xs text-muted-foreground">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <HeartHandshake className="w-4 h-4 text-primary" />
          Interests
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TRAVEL_INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest.value}
              type="button"
              onClick={() => toggleInterest(interest.value)}
              className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                formData.interests.includes(interest.value)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {interest.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Pick a few interests so the assistant can prioritize better stops.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <Gauge className="w-4 h-4 text-primary" />
          Trip Pace
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {paceOptions.map((pace) => (
            <button
              key={pace.value}
              type="button"
              onClick={() => setFormData({ ...formData, tripPace: pace.value })}
              className={`rounded-xl border p-4 text-left transition-all ${
                formData.tripPace === pace.value
                  ? 'border-primary bg-primary/15'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="text-sm font-semibold">{pace.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{pace.description}</div>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="hero"
        size="xl"
        disabled={!formData.destination || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Crafting Your Journey...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Smart Itinerary
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default TripForm;
