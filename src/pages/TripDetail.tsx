import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SavedTrip } from '@/types/auth';
import DestinationBanner from '@/components/travel/DestinationBanner';
import WeatherCard from '@/components/travel/WeatherCard';
import BudgetMeter from '@/components/travel/BudgetMeter';
import ItineraryCard from '@/components/travel/ItineraryCard';
import TravelTips from '@/components/travel/TravelTips';
import UserMenu from '@/components/auth/UserMenu';
import localTripStorageService from '@/services/localStorage/tripStorageService';

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      if (tripId) {
        const savedTrip = await localTripStorageService.getTrip(tripId);
        setTrip(savedTrip);
      }
      setIsLoading(false);
    };
    loadTrip();
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Trip not found</h1>
          <Link to="/my-trips">
            <Button variant="hero">Back to My Trips</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { itinerary, formData } = trip;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-card backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/my-trips">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                My Trips
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="glass" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <UserMenu variant="glass" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Destination Banner */}
        <DestinationBanner
          destination={itinerary.destination}
          days={itinerary.totalDays}
          travelType={itinerary.travelType}
          budgetLevel={formData.budgetLevel}
        />

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <WeatherCard 
            weather={itinerary.weather} 
            destination={itinerary.destination} 
          />
          <BudgetMeter
            totalBudget={itinerary.totalBudget}
            totalDays={itinerary.totalDays}
            budgetLevel={formData.budgetLevel}
          />
        </div>

        {/* Itinerary Section */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Your Personalized Itinerary
            </h2>
            <p className="text-muted-foreground">
              Day-by-day activities curated just for you
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {itinerary.days.map((day, index) => (
              <ItineraryCard 
                key={day.day} 
                dayData={day} 
                index={index}
                destination={itinerary.destination}
              />
            ))}
          </div>
        </div>

        {/* Travel Tips Section */}
        <div className="mt-12">
          <TravelTips 
            tips={itinerary.tips} 
            destination={itinerary.destination} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>AI-Powered India Travel Planner • Made with ❤️ for travelers</p>
      </footer>
    </div>
  );
};

export default TripDetail;
