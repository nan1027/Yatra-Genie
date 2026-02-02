import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Share2, Save, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/travel/HeroSection';
import TripForm from '@/components/travel/TripForm';
import DestinationBanner from '@/components/travel/DestinationBanner';
import WeatherCard from '@/components/travel/WeatherCard';
import BudgetMeter from '@/components/travel/BudgetMeter';
import ItineraryCard from '@/components/travel/ItineraryCard';
import TravelTips from '@/components/travel/TravelTips';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import { TripFormData, Itinerary } from '@/types/travel';
import { generateMockItinerary } from '@/data/mockItinerary';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated, saveTrip } = useAuth();
  const { toast } = useToast();

  const handleFormSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    setFormData(data);
    setIsSaved(false);

    // Simulate API call delay for realistic UX
    // In production, this would call the backend APIs (Google Places, OpenWeather, OpenAI)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock itinerary (replace with actual API integration)
    const mockItinerary = generateMockItinerary(data);
    setItinerary(mockItinerary);
    setIsLoading(false);

    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setItinerary(null);
    setFormData(null);
    setIsSaved(false);
  };

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (!itinerary || !formData) return;

    setIsSaving(true);
    try {
      await saveTrip(itinerary, formData);
      setIsSaved(true);
      toast({
        title: 'Trip Saved!',
        description: 'Your itinerary has been saved to My Trips.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!itinerary ? (
          // Planning View
          <motion.div
            key="planning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Bar */}
            <div className="absolute top-0 right-0 z-50 p-4">
              <div className="flex items-center gap-2">
                <Link to="/my-trips">
                  <Button variant="glass" size="sm">My Trips</Button>
                </Link>
                <UserMenu variant="glass" />
              </div>
            </div>

            <HeroSection />
            
            <div className="relative z-10 -mt-20 pb-20 px-4">
              <div className="max-w-2xl mx-auto">
                <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
              <p>AI-Powered India Travel Planner • Made with ❤️ for travelers</p>
            </footer>
          </motion.div>
        ) : (
          // Results View
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-20"
          >
            {/* Header */}
            <div className="sticky top-0 z-50 glass-card backdrop-blur-xl border-b border-border/50">
              <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Plan New Trip
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isSaved ? 'outline' : 'hero'}
                    size="sm" 
                    className="gap-2"
                    onClick={handleSaveTrip}
                    disabled={isSaving || isSaved}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSaved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Trip'}</span>
                  </Button>
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
                budgetLevel={formData?.budgetLevel || 'medium'}
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
                  budgetLevel={formData?.budgetLevel || 'medium'}
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
                    Day-by-day activities curated just for you • Click any place for details
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

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4">
                    Ready for Your Adventure?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Save your itinerary or start planning another incredible journey
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="gap-2"
                      onClick={handleSaveTrip}
                      disabled={isSaving || isSaved}
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isSaved ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isSaved ? 'Trip Saved!' : 'Save Itinerary'}
                    </Button>
                    <Button variant="glass" size="lg" onClick={handleReset}>
                      Plan Another Trip
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
              <p>AI-Powered India Travel Planner • Made with ❤️ for travelers</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleSaveTrip}
      />
    </div>
  );
};

export default Index;
