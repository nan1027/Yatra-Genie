import { useMemo, useState } from 'react';
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
import ItineraryFilters, {
  ItineraryCategoryFilter,
  ItineraryTimeFilter,
  ItinerarySortOption,
} from '@/components/travel/ItineraryFilters';
import TravelAssistantPanel from '@/components/travel/TravelAssistantPanel';
import TravelTips from '@/components/travel/TravelTips';
import TripMapView from '@/components/travel/TripMapView';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import { TripFormData, Itinerary } from '@/types/travel';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { generateLiveItinerary } from '@/services/travelPlannerService';

const Index = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ItineraryCategoryFilter>('all');
  const [timeFilter, setTimeFilter] = useState<ItineraryTimeFilter>('all');
  const [sortBy, setSortBy] = useState<ItinerarySortOption>('default');
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);

  const { isAuthenticated, saveTrip } = useAuth();
  const { toast } = useToast();

  const resetFilters = () => {
    setCategoryFilter('all');
    setTimeFilter('all');
    setSortBy('default');
  };

  const getDurationScore = (duration: string) => {
    const values = duration.match(/\d+/g)?.map(Number) ?? [2];
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const handleFormSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    setFormData(data);
    setIsSaved(false);

    try {
      const nextItinerary = await generateLiveItinerary(data);
      setItinerary(nextItinerary);
      setFavoritePlaceIds([]);
      resetFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: 'Live trip planning failed',
        description: error instanceof Error ? error.message : 'Please check your backend configuration and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setFormData(null);
    setIsSaved(false);
    setFavoritePlaceIds([]);
    resetFilters();
  };

  const buildItineraryExport = () => {
    if (!itinerary || !formData) return '';

    const lines = [
      `${itinerary.destination} Trip`,
      `${itinerary.totalDays} days | ${itinerary.travelType} | ${formData.budgetLevel}`,
      '',
    ];

    itinerary.days.forEach((day) => {
      lines.push(`Day ${day.day} - ${day.date}`);
      day.activities.forEach((activity) => {
        lines.push(`- ${activity.time}: ${activity.place.name} (${activity.place.duration}, INR ${activity.place.estimatedCost})`);
      });
      lines.push('');
    });

    return lines.join('\n');
  };

  const handleDownload = () => {
    const exportText = buildItineraryExport();
    if (!exportText || !itinerary) return;

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${itinerary.destination.toLowerCase().replace(/\s+/g, '-')}-itinerary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const exportText = buildItineraryExport();
    if (!exportText || !itinerary) return;

    if (navigator.share) {
      await navigator.share({
        title: `${itinerary.destination} Trip`,
        text: exportText,
      });
      return;
    }

    await navigator.clipboard.writeText(exportText);
    window.open(`https://wa.me/?text=${encodeURIComponent(exportText)}`, '_blank');
    toast({
      title: 'Itinerary copied',
      description: 'The trip summary was copied and WhatsApp share was opened.',
    });
  };

  const handleToggleFavorite = (placeId: string) => {
    setFavoritePlaceIds((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId]
    );
  };

  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (!itinerary || !formData) return;

    setIsSaving(true);
    try {
      await saveTrip(itinerary, formData, favoritePlaceIds);
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

  const totalActivities = itinerary?.days.reduce((count, day) => count + day.activities.length, 0) ?? 0;

  const filteredDays = useMemo(() => {
    if (!itinerary) return [];

    return itinerary.days
      .map((day) => ({
        ...day,
        activities: day.activities
          .filter((activity) => {
            const matchesCategory =
              categoryFilter === 'all' || activity.place.category === categoryFilter;
            const matchesTime = timeFilter === 'all' || activity.time === timeFilter;
            return matchesCategory && matchesTime;
          })
          .sort((left, right) => {
            switch (sortBy) {
              case 'lowest-cost':
                return left.place.estimatedCost - right.place.estimatedCost;
              case 'highest-rated':
                return (right.place.rating ?? 0) - (left.place.rating ?? 0);
              case 'shortest-duration':
                return getDurationScore(left.place.duration) - getDurationScore(right.place.duration);
              case 'family-friendly':
                return Number(right.place.familyFriendly) - Number(left.place.familyFriendly);
              default:
                return 0;
            }
          }),
      }))
      .filter((day) => day.activities.length > 0);
  }, [itinerary, categoryFilter, timeFilter, sortBy]);

  const visibleActivities = filteredDays.reduce((count, day) => count + day.activities.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!itinerary ? (
          <motion.div
            key="planning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 z-50 p-4">
              <div className="flex items-center gap-2">
                <Link to="/my-trips">
                  <Button variant="glass" size="sm">My Trips</Button>
                </Link>
                <UserMenu variant="glass" />
              </div>
            </div>

            <HeroSection />

            <div className="relative z-10 -mt-20 px-4 pb-20">
              <div className="mx-auto max-w-2xl">
                <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
            </div>

            <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
              <p>AI-Powered India Travel Planner. Made for travelers.</p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-20"
          >
            <div className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Button variant="ghost" onClick={handleReset} className="gap-2">
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
                  <Button variant="glass" size="sm" className="gap-2" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button variant="glass" size="sm" className="gap-2" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <UserMenu variant="glass" />
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8">
              <DestinationBanner
                destination={itinerary.destination}
                days={itinerary.totalDays}
                travelType={itinerary.travelType}
                budgetLevel={formData?.budgetLevel || 'medium'}
              />

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <WeatherCard weather={itinerary.weather} destination={itinerary.destination} />
                <BudgetMeter
                  totalBudget={itinerary.totalBudget}
                  totalDays={itinerary.totalDays}
                  budgetLevel={formData?.budgetLevel || 'medium'}
                  breakdown={itinerary.budgetBreakdown}
                />
              </div>

              <TravelAssistantPanel itinerary={itinerary} />

              <div className="mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h2 className="mb-2 text-2xl font-display font-bold text-foreground md:text-3xl">
                    Your Personalized Itinerary
                  </h2>
                  <p className="text-muted-foreground">
                    Day-by-day activities curated just for you. Click any place for details.
                  </p>
                </motion.div>

                <ItineraryFilters
                  category={categoryFilter}
                  timeOfDay={timeFilter}
                  sortBy={sortBy}
                  totalActivities={totalActivities}
                  visibleActivities={visibleActivities}
                  onCategoryChange={setCategoryFilter}
                  onTimeChange={setTimeFilter}
                  onSortChange={setSortBy}
                  onReset={resetFilters}
                />

                {filteredDays.length > 0 ? (
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {filteredDays.map((day, index) => (
                      <ItineraryCard
                        key={day.day}
                        dayData={day}
                        index={index}
                        destination={itinerary.destination}
                        favoritePlaceIds={favoritePlaceIds}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card mt-6 p-8 text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      No activities match these filters
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try a different category or time of day to explore more options.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-12">
                <TripMapView itinerary={itinerary} />
              </div>

              <div className="mt-12">
                <TravelTips tips={itinerary.tips} destination={itinerary.destination} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12 text-center"
              >
                <div className="glass-card mx-auto max-w-2xl p-8 md:p-12">
                  <h3 className="mb-4 text-xl font-display font-bold text-foreground md:text-2xl">
                    Ready for Your Adventure?
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Save your itinerary or start planning another incredible journey
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
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

            <footer className="mt-12 border-t border-border py-8 text-center text-sm text-muted-foreground">
              <p>AI-Powered India Travel Planner. Made for travelers.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleSaveTrip}
      />
    </div>
  );
};

export default Index;
