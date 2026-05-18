import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  IndianRupee,
  Trash2,
  Eye,
  Plane,
  Loader2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import { SavedTrip } from '@/types/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MyTrips = () => {
  const { isAuthenticated, loading: authLoading, getMyTrips, deleteTrip } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [travelTypeFilter, setTravelTypeFilter] = useState<'all' | 'solo' | 'family' | 'friends'>('all');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const loadTrips = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        const userTrips = await getMyTrips();
        setTrips(userTrips);
      }
      setIsLoading(false);
    };

    loadTrips();
  }, [isAuthenticated, getMyTrips]);

  const handleDelete = async (tripId: string) => {
    await deleteTrip(tripId);
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    setDeleteId(null);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getTravelTypeLabel = (type: string) => {
    switch (type) {
      case 'solo':
        return 'Solo';
      case 'family':
        return 'Family';
      case 'friends':
        return 'Friends';
      default:
        return type;
    }
  };

  const getBudgetLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Budget';
      case 'medium':
        return 'Comfort';
      case 'high':
        return 'Luxury';
      default:
        return level;
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = trip.itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTravelType =
        travelTypeFilter === 'all' || trip.itinerary.travelType === travelTypeFilter;
      const matchesBudget =
        budgetFilter === 'all' || trip.formData.budgetLevel === budgetFilter;

      return matchesSearch && matchesTravelType && matchesBudget;
    });
  }, [trips, searchQuery, travelTypeFilter, budgetFilter]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Planner
            </Button>
          </Link>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Trips</h1>

        {!isAuthenticated ? (
          <div className="py-20 text-center">
            <Plane className="mx-auto mb-4 h-16 w-16 text-primary/50" />
            <p className="mb-6">Sign in to view your saved trips</p>
            <Button onClick={() => setIsLoginOpen(true)}>Sign In</Button>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="py-20 text-center">
            <MapPin className="mx-auto mb-4 h-16 w-16 text-primary/50" />
            <p className="mb-6">No trips saved yet</p>
            <Link to="/">
              <Button>Plan a Trip</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="glass-card mb-6 grid gap-4 p-5 md:grid-cols-[1.5fr,1fr,1fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by destination"
                  className="border-border/50 bg-muted/30 pl-10"
                />
              </div>

              <select
                value={travelTypeFilter}
                onChange={(e) => setTravelTypeFilter(e.target.value as 'all' | 'solo' | 'family' | 'friends')}
                className="h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm"
              >
                <option value="all">All travel types</option>
                <option value="solo">Solo</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>

              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                className="h-10 rounded-md border border-border/50 bg-muted/30 px-3 text-sm"
              >
                <option value="all">All budgets</option>
                <option value="low">Budget</option>
                <option value="medium">Comfort</option>
                <option value="high">Luxury</option>
              </select>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <p className="text-lg font-semibold text-foreground">No trips match your filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different destination, travel type, or budget filter.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredTrips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden rounded-xl border"
                    >
                      <img
                        src={trip.itinerary.imageUrl || '/placeholder.svg'}
                        alt={trip.itinerary.destination}
                        className="h-40 w-full object-cover"
                      />

                      <div className="space-y-2 p-4">
                        <h3 className="text-lg font-semibold">{trip.itinerary.destination}</h3>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {trip.itinerary.totalDays} days
                          </span>
                          <span>{getTravelTypeLabel(trip.itinerary.travelType)}</span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {getBudgetLabel(trip.formData.budgetLevel)}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Saved on {formatDate(trip.createdAt)}
                        </p>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" onClick={() => navigate(`/trip/${trip.id}`)}>
                            <Eye className="mr-1 h-4 w-4" /> View
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteId(trip.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete trip?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyTrips;
