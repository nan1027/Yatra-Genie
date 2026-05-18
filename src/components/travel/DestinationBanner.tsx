import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet, Sparkles } from 'lucide-react';
import { TravelType, BudgetLevel, BUDGET_ESTIMATES } from '@/types/travel';

interface DestinationBannerProps {
  destination: string;
  days: number;
  travelType: TravelType;
  budgetLevel: BudgetLevel;
}

const destinationThemes: Record<string, { tagline: string; gradient: string }> = {
  Agra: { tagline: 'Mughal history, riverside views, and timeless architecture.', gradient: 'from-amber-500/80 via-rose-500/60 to-orange-900/80' },
  Jaipur: { tagline: 'Royal forts, colorful bazaars, and pink-city charm.', gradient: 'from-rose-500/80 via-orange-500/60 to-fuchsia-900/80' },
  Goa: { tagline: 'Beach mornings, cafes, and easy sunset energy.', gradient: 'from-sky-500/80 via-cyan-400/60 to-emerald-900/80' },
  Kochi: { tagline: 'Backwaters, spice lanes, and coastal culture.', gradient: 'from-emerald-500/80 via-teal-400/60 to-slate-900/80' },
  Mumbai: { tagline: 'Fast city rhythm, food trails, and iconic waterfronts.', gradient: 'from-indigo-500/80 via-sky-500/60 to-slate-900/80' },
  Delhi: { tagline: 'Monuments, markets, and layered history in every direction.', gradient: 'from-red-500/80 via-amber-500/60 to-zinc-900/80' },
  Varanasi: { tagline: 'Ghats, rituals, and unforgettable spiritual atmosphere.', gradient: 'from-orange-500/80 via-yellow-500/60 to-red-950/80' },
};

const DestinationBanner = ({ destination, days, travelType, budgetLevel }: DestinationBannerProps) => {
  const theme = destinationThemes[destination] ?? {
    tagline: `A smart India trip built specifically around ${destination}.`,
    gradient: 'from-primary/80 via-secondary/60 to-background',
  };

  const getTravelTypeLabel = (type: TravelType) => {
    switch (type) {
      case 'solo':
        return 'Solo Adventure';
      case 'family':
        return 'Family Trip';
      case 'friends':
        return 'Friends Getaway';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-64 overflow-hidden rounded-3xl md:h-80"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
          <Sparkles className="h-4 w-4" />
          Destination-aware trip plan
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-sm font-medium text-white/80">Your Destination</span>
          </div>
          <h2 className="mb-3 text-3xl font-display font-bold text-white md:text-4xl">
            {destination}, India
          </h2>
          <p className="max-w-2xl text-sm text-white/80 md:text-base">{theme.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="glass-card rounded-full px-4 py-2 text-sm font-medium text-white">
              <Calendar className="mr-2 inline h-4 w-4" />
              {days} {days === 1 ? 'Day' : 'Days'}
            </div>
            <div className="glass-card rounded-full px-4 py-2 text-sm font-medium text-white">
              {getTravelTypeLabel(travelType)}
            </div>
            <div className="glass-card rounded-full px-4 py-2 text-sm font-medium text-white">
              <Wallet className="mr-2 inline h-4 w-4" />
              {BUDGET_ESTIMATES[budgetLevel].label}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DestinationBanner;
