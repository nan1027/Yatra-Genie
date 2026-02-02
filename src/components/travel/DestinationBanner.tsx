import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Wallet } from 'lucide-react';
import { TravelType, BudgetLevel, BUDGET_ESTIMATES } from '@/types/travel';
import heroImage from '@/assets/hero-india.jpg';

interface DestinationBannerProps {
  destination: string;
  days: number;
  travelType: TravelType;
  budgetLevel: BudgetLevel;
}

const DestinationBanner = ({ destination, days, travelType, budgetLevel }: DestinationBannerProps) => {
  const getTravelTypeLabel = (type: TravelType) => {
    switch (type) {
      case 'solo': return 'Solo Adventure';
      case 'family': return 'Family Trip';
      case 'friends': return 'Friends Getaway';
    }
  };

  const getTravelTypeEmoji = (type: TravelType) => {
    switch (type) {
      case 'solo': return '🎒';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friends': return '🎉';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden h-64 md:h-80"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm text-primary font-medium">Your Destination</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {destination}, India
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{days} {days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <span className="text-base">{getTravelTypeEmoji(travelType)}</span>
              <span className="text-sm font-medium">{getTravelTypeLabel(travelType)}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{BUDGET_ESTIMATES[budgetLevel].label}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />
      <div className="absolute top-10 right-10 w-10 h-10 bg-secondary/30 rounded-full blur-xl" />
    </motion.div>
  );
};

export default DestinationBanner;
