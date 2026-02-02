import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sunrise, 
  Sun, 
  Moon, 
  MapPin, 
  Clock, 
  Star, 
  IndianRupee,
  Landmark,
  UtensilsCrossed,
  Trees,
  Mountain,
  Palette,
  ShoppingBag,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { ItineraryDay, PlaceCategory, TimeOfDay, Place } from '@/types/travel';
import PlaceDetailModal from './PlaceDetailModal';

interface ItineraryCardProps {
  dayData: ItineraryDay;
  index: number;
  destination?: string;
}

const ItineraryCard = ({ dayData, index, destination = '' }: ItineraryCardProps) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const getTimeIcon = (time: TimeOfDay) => {
    switch (time) {
      case 'morning': return Sunrise;
      case 'afternoon': return Sun;
      case 'evening': return Moon;
    }
  };

  const getTimeColor = (time: TimeOfDay) => {
    switch (time) {
      case 'morning': return 'from-amber-400 to-orange-400';
      case 'afternoon': return 'from-sky-400 to-blue-400';
      case 'evening': return 'from-purple-400 to-indigo-400';
    }
  };

  const getTimeLabel = (time: TimeOfDay) => {
    switch (time) {
      case 'morning': return 'Morning (8AM - 12PM)';
      case 'afternoon': return 'Afternoon (12PM - 5PM)';
      case 'evening': return 'Evening (5PM - 10PM)';
    }
  };

  const getCategoryIcon = (category: PlaceCategory) => {
    switch (category) {
      case 'monument': return Landmark;
      case 'food': return UtensilsCrossed;
      case 'nature': return Trees;
      case 'adventure': return Mountain;
      case 'culture': return Palette;
      case 'shopping': return ShoppingBag;
    }
  };

  const getCategoryLabel = (category: PlaceCategory) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openGoogleMaps = (place: Place) => {
    const query = encodeURIComponent(`${place.name}, ${destination}, India`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="glass-card-hover overflow-hidden"
      >
        {/* Day Header */}
        <div className="p-5 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground">
                Day {dayData.day}
              </h3>
              <p className="text-sm text-muted-foreground">{dayData.date}</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
              <IndianRupee className="w-3 h-3" />
              {formatCurrency(dayData.dailyBudget)}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="p-5 space-y-4">
          {dayData.activities.map((activity, actIndex) => {
            const TimeIcon = getTimeIcon(activity.time);
            const CategoryIcon = getCategoryIcon(activity.place.category);

            return (
              <motion.div
                key={activity.time}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: (index * 0.1) + (actIndex * 0.1) }}
                className="relative pl-8"
              >
                {/* Timeline dot and line */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getTimeColor(activity.time)} flex items-center justify-center shadow-lg`}>
                    <TimeIcon className="w-3 h-3 text-white" />
                  </div>
                  {actIndex < dayData.activities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-border to-transparent mt-2" />
                  )}
                </div>

                <div 
                  className="ml-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedPlace(activity.place)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground">{getTimeLabel(activity.time)}</span>
                      <h4 className="text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-2">
                        {activity.place.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-xs font-medium text-primary">
                      <CategoryIcon className="w-3 h-3" />
                      {getCategoryLabel(activity.place.category)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{activity.place.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.place.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {formatCurrency(activity.place.estimatedCost)}
                    </span>
                    {activity.place.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {activity.place.rating}
                      </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <MapPin className="w-3 h-3" />
                      View Details
                    </span>
                  </div>

                  {/* Quick Tips */}
                  {activity.tips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                          {activity.tips[0]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        destination={destination}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </>
  );
};

export default ItineraryCard;
