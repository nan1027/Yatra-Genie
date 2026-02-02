import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  IndianRupee,
  Trash2,
  Eye,
  Plane,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/auth/UserMenu";
import LoginModal from "@/components/auth/LoginModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* 🔹 Correct Firebase trip shape */
interface SavedTrip {
  id: string;
  itinerary: {
    destination: string;
    totalDays: number;
    travelType: string;
    imageUrl?: string;
  };
  formData: {
    budgetLevel: string;
  };
  createdAt: any;
}

const MyTrips = () => {
  const { isAuthenticated, loading: authLoading, getMyTrips, deleteTrip } =
    useAuth();
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
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    setDeleteId(null);
  };

  const formatDate = (date: any) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTravelTypeIcon = (type: string) => {
    switch (type) {
      case "solo":
        return "👤";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "friends":
        return "👥";
      default:
        return "✈️";
    }
  };

  const getBudgetLabel = (level: string) => {
    switch (level) {
      case "low":
        return "Budget";
      case "medium":
        return "Comfort";
      case "high":
        return "Luxury";
      default:
        return level;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Planner
            </Button>
          </Link>
          <UserMenu />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Trips</h1>

        {!isAuthenticated ? (
          <div className="text-center py-20">
            <Plane className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <p className="mb-6">Sign in to view your saved trips</p>
            <Button onClick={() => setIsLoginOpen(true)}>Sign In</Button>
            <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <p className="mb-6">No trips saved yet</p>
            <Link to="/">
              <Button>Plan a Trip</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border rounded-xl overflow-hidden"
                >
                  <img
                    src={trip.itinerary.imageUrl || "/placeholder.svg"}
                    alt={trip.itinerary.destination}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">
                      {trip.itinerary.destination}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trip.itinerary.totalDays} days
                      </span>
                      <span>
                        {getTravelTypeIcon(trip.itinerary.travelType)}{" "}
                        {trip.itinerary.travelType}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {getBudgetLabel(trip.formData.budgetLevel)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Saved on {formatDate(trip.createdAt)}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/trip/${trip.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
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

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyTrips;
