import { ExternalLink, MapPin, Clock, IndianRupee, Star, Navigation } from 'lucide-react';
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
}

const PlaceDetailModal = ({ place, destination, isOpen, onClose }: PlaceDetailModalProps) => {
  if (!place) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${place.name}, ${destination}, India`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getGoogleMapsDirectionsUrl = () => {
    const query = encodeURIComponent(`${place.name}, ${destination}, India`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  const getBudgetLabel = (tier: string) => {
    switch (tier) {
      case 'low': return { label: 'Budget-Friendly', color: 'text-green-500 bg-green-500/10' };
      case 'medium': return { label: 'Mid-Range', color: 'text-amber-500 bg-amber-500/10' };
      case 'high': return { label: 'Premium', color: 'text-purple-500 bg-purple-500/10' };
      default: return { label: 'Standard', color: 'text-muted-foreground bg-muted' };
    }
  };

  const budget = getBudgetLabel(place.budgetTier);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {place.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Place Image Placeholder */}
          {place.imageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground">{place.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{place.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
              <IndianRupee className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Est. Cost</p>
                <p className="text-sm font-medium">{formatCurrency(place.estimatedCost)}</p>
              </div>
            </div>
            {place.rating && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium">{place.rating}/5</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
              <div className={`px-2 py-1 rounded text-xs font-medium ${budget.color}`}>
                {budget.label}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="hero"
              className="flex-1 gap-2"
              onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
            >
              <MapPin className="w-4 h-4" />
              View on Maps
            </Button>
            <Button
              variant="glass"
              className="flex-1 gap-2"
              onClick={() => window.open(getGoogleMapsDirectionsUrl(), '_blank')}
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceDetailModal;
