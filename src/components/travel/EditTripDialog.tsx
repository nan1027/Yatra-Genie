import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  TripFormData,
  INDIAN_CITIES,
  TRAVEL_INTEREST_OPTIONS,
  TravelInterest,
  TripPace,
  TravelType,
  BudgetLevel,
} from '@/types/travel';

interface EditTripDialogProps {
  isOpen: boolean;
  initialData: TripFormData;
  onClose: () => void;
  onSave: (data: TripFormData) => Promise<void>;
}

const EditTripDialog = ({ isOpen, initialData, onClose, onSave }: EditTripDialogProps) => {
  const [formData, setFormData] = useState<TripFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const toggleInterest = (interest: TravelInterest) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter((item) => item !== interest)
      : [...formData.interests, interest];

    setFormData({ ...formData, interests });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card border-border/50 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Saved Trip</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="h-11 rounded-xl border border-border/50 bg-muted/30 px-3"
          >
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <div className="grid gap-4 sm:grid-cols-3">
            <select
              value={formData.travelType}
              onChange={(e) => setFormData({ ...formData, travelType: e.target.value as TravelType })}
              className="h-11 rounded-xl border border-border/50 bg-muted/30 px-3"
            >
              <option value="solo">Solo</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>

            <select
              value={formData.budgetLevel}
              onChange={(e) => setFormData({ ...formData, budgetLevel: e.target.value as BudgetLevel })}
              className="h-11 rounded-xl border border-border/50 bg-muted/30 px-3"
            >
              <option value="low">Budget</option>
              <option value="medium">Comfort</option>
              <option value="high">Luxury</option>
            </select>

            <select
              value={formData.tripPace}
              onChange={(e) => setFormData({ ...formData, tripPace: e.target.value as TripPace })}
              className="h-11 rounded-xl border border-border/50 bg-muted/30 px-3"
            >
              <option value="relaxed">Relaxed</option>
              <option value="packed">Packed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">Trip Length: {formData.days} days</label>
            <input
              type="range"
              min="1"
              max="14"
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: Number.parseInt(e.target.value, 10) })}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">Interests</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TRAVEL_INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => toggleInterest(interest.value)}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    formData.interests.includes(interest.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/50 bg-muted/20'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="hero" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Update Trip'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;
