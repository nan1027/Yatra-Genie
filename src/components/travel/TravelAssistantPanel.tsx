import { motion } from 'framer-motion';
import { Backpack, ClipboardList, CloudSun, Compass, Sparkles } from 'lucide-react';
import { Itinerary } from '@/types/travel';

interface TravelAssistantPanelProps {
  itinerary: Itinerary;
}

const TravelAssistantPanel = ({ itinerary }: TravelAssistantPanelProps) => {
  const assistantHighlights = itinerary.assistantHighlights ?? {
    summary: 'This itinerary is ready to use and can be refined further as you save preferences.',
    weatherNote: 'Review the weather on the day of travel for any final adjustments.',
    paceNote: 'Balance sightseeing with food and rest so the trip stays enjoyable.',
  };
  const packingChecklist = itinerary.packingChecklist ?? [
    'Government ID and booking confirmations',
    'Phone charger and power bank',
    'Comfortable walking shoes',
  ];
  const travelChecklist = itinerary.travelChecklist ?? [
    'Confirm bookings',
    'Save your hotel address offline',
    'Keep emergency contacts handy',
  ];

  const cards = [
    {
      title: 'Assistant Summary',
      icon: Sparkles,
      body: assistantHighlights.summary,
    },
    {
      title: 'Weather Strategy',
      icon: CloudSun,
      body: assistantHighlights.weatherNote,
    },
    {
      title: 'Pace Guidance',
      icon: Compass,
      body: assistantHighlights.paceNote,
    },
  ];

  return (
    <div className="mt-12 space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
            className="glass-card p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{card.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{card.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/15">
              <Backpack className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Packing Checklist</h3>
              <p className="text-sm text-muted-foreground">Built around your pace, weather, and trip style</p>
            </div>
          </div>
          <div className="space-y-2">
            {packingChecklist.map((item) => (
              <div key={item} className="rounded-xl border border-border/40 bg-muted/25 px-4 py-3 text-sm text-foreground/90">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42 }}
          className="glass-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15">
              <ClipboardList className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Travel Checklist</h3>
              <p className="text-sm text-muted-foreground">Quick pre-departure essentials to stay organized</p>
            </div>
          </div>
          <div className="space-y-2">
            {travelChecklist.map((item) => (
              <div key={item} className="rounded-xl border border-border/40 bg-muted/25 px-4 py-3 text-sm text-foreground/90">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelAssistantPanel;
