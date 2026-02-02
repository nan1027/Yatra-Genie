import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripFormData, INDIAN_CITIES, TravelType, BudgetLevel } from '@/types/travel';

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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination) {
      onSubmit(formData);
    }
  };

  const travelTypes: { value: TravelType; label: string; icon: string }[] = [
    { value: 'solo', label: 'Solo', icon: '🎒' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends', icon: '🎉' },
  ];

  const budgetLevels: { value: BudgetLevel; label: string; icon: string; desc: string }[] = [
    { value: 'low', label: 'Budget', icon: '💰', desc: '₹1.5K-3K/day' },
    { value: 'medium', label: 'Comfort', icon: '💎', desc: '₹4K-8K/day' },
    { value: 'high', label: 'Luxury', icon: '👑', desc: '₹10K-25K/day' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="glass-card p-6 md:p-8 space-y-6 max-w-2xl mx-auto"
    >
      {/* Destination Select */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <MapPin className="w-4 h-4 text-primary" />
          Destination
        </label>
        <div className="relative">
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          >
            <option value="" disabled>Select an Indian city</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            ▼
          </div>
        </div>
      </div>

      {/* Number of Days */}
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
            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <span className="w-16 h-12 flex items-center justify-center rounded-xl bg-primary/20 text-primary font-semibold">
            {formData.days} {formData.days === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* Travel Type */}
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
              className={`p-4 rounded-xl border transition-all duration-300 ${
                formData.travelType === type.value
                  ? 'bg-primary/20 border-primary shadow-glow'
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Level */}
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
              className={`p-4 rounded-xl border transition-all duration-300 ${
                formData.budgetLevel === level.value
                  ? 'bg-primary/20 border-primary shadow-glow'
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <div className="text-2xl mb-1">{level.icon}</div>
              <div className="text-sm font-medium">{level.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
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
            Generate AI Itinerary
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default TripForm;
