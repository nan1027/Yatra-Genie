import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Loader2, PencilLine, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedTrip } from '@/types/auth';
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
import EditTripDialog from '@/components/travel/EditTripDialog';
import UserMenu from '@/components/auth/UserMenu';
import localTripStorageService from '@/services/localStorage/tripStorageService';
import { useToast } from '@/hooks/use-toast';
import { generateLiveItinerary } from '@/services/travelPlannerService';

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<ItineraryCategoryFilter>('all');
  const [timeFilter, setTimeFilter] = useState<ItineraryTimeFilter>('all');
  const [sortBy, setSortBy] = useState<ItinerarySortOption>('default');
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

  const buildItineraryExport = (activeTrip: SavedTrip) => {
    const lines = [
      `${activeTrip.itinerary.destination} Trip`,
      `${activeTrip.itinerary.totalDays} days | ${activeTrip.itinerary.travelType} | ${activeTrip.formData.budgetLevel}`,
      '',
    ];

    activeTrip.itinerary.days.forEach((day) => {
      lines.push(`Day ${day.day} - ${day.date}`);
      day.activities.forEach((activity) => {
        lines.push(`- ${activity.time}: ${activity.place.name} (${activity.place.duration}, INR ${activity.place.estimatedCost})`);
      });
      lines.push('');
    });

    return lines.join('\n');
  };

  useEffect(() => {
    const loadTrip = async () => {
      if (tripId) {
        const savedTrip = await localTripStorageService.getTrip(tripId);
        setTrip(savedTrip);
        setFavoritePlaceIds(savedTrip?.favoritePlaceIds ?? []);
        resetFilters();
      }
      setIsLoading(false);
    };

    loadTrip();
  }, [tripId]);

  const persistFavorites = async (nextFavorites: string[]) => {
    setFavoritePlaceIds(nextFavorites);

    if (!trip) return;

    const updated = await localTripStorageService.updateTrip(trip.id, {
      favoritePlaceIds: nextFavorites,
    });

    if (updated) {
      setTrip(updated);
    }
  };

  const handleToggleFavorite = async (placeId: string) => {
    const nextFavorites = favoritePlaceIds.includes(placeId)
      ? favoritePlaceIds.filter((id) => id !== placeId)
      : [...favoritePlaceIds, placeId];

    await persistFavorites(nextFavorites);
  };

  const handleEditTrip = async (nextFormData: SavedTrip['formData']) => {
    if (!trip) return;

    try {
      const nextItinerary = await generateLiveItinerary(nextFormData);
      const updated = await localTripStorageService.updateTrip(trip.id, {
        destination: nextItinerary.destination,
        totalDays: nextItinerary.totalDays,
        travelType: nextItinerary.travelType,
        budgetLevel: nextFormData.budgetLevel,
        formData: nextFormData,
        itinerary: nextItinerary,
        favoritePlaceIds: [],
      });

      if (updated) {
        setTrip(updated);
        setFavoritePlaceIds(updated.favoritePlaceIds ?? []);
        toast({
          title: 'Trip updated',
          description: 'Your saved trip has been refreshed with live place data.',
        });
      }
    } catch (error) {
      toast({
        title: 'Trip update failed',
        description: error instanceof Error ? error.message : 'Please check your backend configuration and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!trip) return;

    const exportText = buildItineraryExport(trip);
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trip.itinerary.destination.toLowerCase().replace(/\s+/g, '-')}-itinerary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!trip) return;

    const exportText = buildItineraryExport(trip);
    if (navigator.share) {
      await navigator.share({
        title: `${trip.itinerary.destination} Trip`,
        text: exportText,
      });
      return;
    }

    await navigator.clipboard.writeText(exportText);
    window.open(`https://wa.me/?text=${encodeURIComponent(exportText)}`, '_blank');
    toast({
      title: 'Trip copied and shared',
      description: 'The itinerary text was copied and a WhatsApp share window was opened.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-display font-bold">Trip not found</h1>
          <Link to="/my-trips">
            <Button variant="hero">Back to My Trips</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { itinerary, formData } = trip;
  const totalActivities = itinerary.days.reduce((count, day) => count + day.activities.length, 0);

  const filteredDays = useMemo(() => {
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
  }, [itinerary.days, categoryFilter, timeFilter, sortBy]);

  const visibleActivities = filteredDays.reduce((count, day) => count + day.activities.length, 0);
  const favoritePlaces = itinerary.days
    .flatMap((day) => day.activities.map((activity) => activity.place))
    .filter((place) => favoritePlaceIds.includes(place.id));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 border-b border-border/50 glass-card backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to="/my-trips">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                My Trips
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="glass" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="glass" size="sm" className="gap-2" onClick={() => setIsEditOpen(true)}>
              <PencilLine className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Trip</span>
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
          budgetLevel={formData.budgetLevel}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <WeatherCard weather={itinerary.weather} destination={itinerary.destination} />
          <BudgetMeter
            totalBudget={itinerary.totalBudget}
            totalDays={itinerary.totalDays}
            budgetLevel={formData.budgetLevel}
            breakdown={itinerary.budgetBreakdown}
          />
        </div>

        <TravelAssistantPanel itinerary={itinerary} />

        {favoritePlaces.length > 0 && (
          <div className="glass-card mt-12 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 fill-current text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Favorite Stops</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {favoritePlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${itinerary.destination}, India`)}`,
                      '_blank'
                    )
                  }
                >
                  {place.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
              Day-by-day activities curated just for you
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
              <h3 className="text-lg font-semibold text-foreground">No activities match these filters</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reset the filters to see the full itinerary again.
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
      </div>

      <footer className="mt-12 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>AI-Powered India Travel Planner. Made for travelers.</p>
      </footer>

      <EditTripDialog
        isOpen={isEditOpen}
        initialData={formData}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditTrip}
      />
    </div>
  );
};

export default TripDetail;
