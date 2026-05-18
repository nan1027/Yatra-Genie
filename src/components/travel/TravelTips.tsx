import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, Shield, MapPin, Clock, Camera } from 'lucide-react';

interface TravelTipsProps {
  tips: string[];
  destination: string;
}

const TravelTips = ({ tips, destination }: TravelTipsProps) => {
  const additionalTips = [
    { icon: Shield, tip: 'Keep digital copies of documents and bookings.' },
    { icon: MapPin, tip: 'Save offline maps before long day trips.' },
    { icon: Clock, tip: 'Reach major stops early to avoid queues.' },
    { icon: Camera, tip: 'Golden hour is still your best photo window.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
          <Lightbulb className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Smart Travel Tips</h3>
          <p className="text-sm text-muted-foreground">Practical advice for your {destination} trip</p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-3"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <span className="text-sm text-foreground/90">{tip}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {additionalTips.map((item, index) => (
          <motion.div
            key={item.tip}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            className="flex items-center gap-2 rounded-xl border border-border/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-3"
          >
            <item.icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs text-muted-foreground">{item.tip}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TravelTips;
