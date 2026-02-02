import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Trash2, 
  Eye,
  Plane,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SavedTrip } from '@/types/auth';
import UserMenu from '@/components/auth/UserMenu';
import LoginModal from '@/components/auth/LoginModal';
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
  const { isAuthenticated, isLoading: authLoading, getMyTrips, deleteTrip } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        const userTrips = await getMyTrips();
        setTrips(userTrips);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, [isAuthenticated, getMyTrips]);

  const handleDelete = async (tripId: string) => {
    await deleteTrip(tripId);
    setTrips(trips.filter(t => t.id !== tripId));
    setDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTravelTypeIcon = (type: string) => {
    switch (type) {
      case 'solo': return '👤';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'friends': return '👥';
      default: return '✈️';
    }
  };

  const getBudgetLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Budget';
      case 'medium': return 'Comfort';
      case 'high': return 'Luxury';
      default: return level;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Planner
            </Button>
          </Link>
          <UserMenu variant="glass" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            My Trips
          </h1>
          <p className="text-muted-foreground">
            Your saved travel itineraries
          </p>
        </motion.div>

        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-md mx-auto"
          >
            <Plane className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold mb-2">Sign in to view your trips</h2>
            <p className="text-muted-foreground mb-6">
              Save and access your travel itineraries from anywhere
            </p>
            <Button variant="hero" onClick={() => setIsLoginOpen(true)}>
              Sign In
            </Button>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          </motion.div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-md mx-auto"
          >
            <MapPin className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold mb-2">No trips yet</h2>
            <p className="text-muted-foreground mb-6">
              Start planning your first adventure!
            </p>
            <Link to="/">
              <Button variant="hero">Plan a Trip</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-hover overflow-hidden group"
                >
                  {/* Card Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={trip.itinerary.imageUrl || '/placeholder.svg'}
                      alt={trip.destination}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {trip.destination}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trip.totalDays} days
                      </span>
                      <span className="flex items-center gap-1">
                        {getTravelTypeIcon(trip.travelType)}
                        {trip.travelType.charAt(0).toUpperCase() + trip.travelType.slice(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {getBudgetLabel(trip.budgetLevel)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Saved on {formatDate(trip.createdAt)}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="glass"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => navigate(`/trip/${trip.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(trip.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your saved itinerary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>AI-Powered India Travel Planner • Made with ❤️ for travelers</p>
      </footer>
    </div>
  );
};

export default MyTrips;
