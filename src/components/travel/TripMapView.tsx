import { motion } from 'framer-motion';
import { ExternalLink, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Itinerary } from '@/types/travel';

interface TripMapViewProps {
  itinerary: Itinerary;
}

const TripMapView = ({ itinerary }: TripMapViewProps) => {
  const places = itinerary.days.flatMap((day) => day.activities.map((activity) => activity.place));
  const uniquePlaces = Array.from(new Map(places.map((place) => [place.id, place])).values());
  const destinationMapQuery = encodeURIComponent(`${itinerary.destination}, India`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Map View</h3>
          <p className="text-sm text-muted-foreground">Open the destination and each saved stop directly in Maps.</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${destinationMapQuery}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          Open City Map
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/40">
        <iframe
          title={`${itinerary.destination} map`}
          src={`https://www.google.com/maps?q=${destinationMapQuery}&output=embed`}
          className="h-72 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {uniquePlaces.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${itinerary.destination}, India`)}`,
                '_blank'
              )
            }
            className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-left transition hover:border-primary/50"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{place.name}</p>
              <p className="text-xs text-muted-foreground">{place.category}</p>
            </div>
            <MapPinned className="h-4 w-4 text-primary" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default TripMapView;
