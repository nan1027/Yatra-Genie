import { MapPin, Clock, IndianRupee, Star, Navigation, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Place } from '@/types/travel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlaceDetailModalProps {
  place: Place | null;
  destination: string;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (placeId: string) => void;
}

const PlaceDetailModal = ({
  place,
  destination,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}: PlaceDetailModalProps) => {
  if (!place) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const getGoogleMapsUrl = (queryTarget = place.name) => {
    const query = encodeURIComponent(`${queryTarget}, ${destination}, India`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getGoogleMapsDirectionsUrl = () => {
    const query = encodeURIComponent(`${place.name}, ${destination}, India`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  const getBudgetLabel = (tier: string) => {
    switch (tier) {
      case 'low':
        return { label: 'Budget-Friendly', color: 'text-green-500 bg-green-500/10' };
      case 'medium':
        return { label: 'Mid-Range', color: 'text-amber-500 bg-amber-500/10' };
      case 'high':
        return { label: 'Premium', color: 'text-purple-500 bg-purple-500/10' };
      default:
        return { label: 'Standard', color: 'text-muted-foreground bg-muted' };
    }
  };

  const budget = getBudgetLabel(place.budgetTier);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <MapPin className="h-5 w-5 text-primary" />
            {place.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <p className="text-muted-foreground">{place.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{place.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <IndianRupee className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Est. Cost</p>
                <p className="text-sm font-medium">{formatCurrency(place.estimatedCost)}</p>
              </div>
            </div>
            {place.rating && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium">{place.rating}/5</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <div className={`rounded px-2 py-1 text-xs font-medium ${budget.color}`}>
                {budget.label}
              </div>
            </div>
          </div>

          {place.nearbyAlternatives && place.nearbyAlternatives.length > 0 && (
            <div className="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
              <h4 className="text-sm font-semibold text-foreground">Nearby Alternatives</h4>
              <div className="space-y-2">
                {place.nearbyAlternatives.map((alternative) => (
                  <button
                    key={alternative}
                    type="button"
                    onClick={() => window.open(getGoogleMapsUrl(alternative), '_blank')}
                    className="w-full rounded-lg border border-border/40 bg-background/40 px-3 py-2 text-left text-sm text-foreground transition hover:border-primary/50"
                  >
                    {alternative}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="hero" className="flex-1 gap-2" onClick={() => window.open(getGoogleMapsUrl(), '_blank')}>
              <MapPin className="h-4 w-4" />
              View on Maps
            </Button>
            <Button variant="glass" className="flex-1 gap-2" onClick={() => window.open(getGoogleMapsDirectionsUrl(), '_blank')}>
              <Navigation className="h-4 w-4" />
              Get Directions
            </Button>
          </div>

          {onToggleFavorite && (
            <Button
              variant={isFavorite ? 'hero' : 'outline'}
              className="w-full gap-2"
              onClick={() => onToggleFavorite(place.id)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceDetailModal;
