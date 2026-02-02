import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, Shield, MapPin, Clock, Camera } from 'lucide-react';

interface TravelTipsProps {
  tips: string[];
  destination: string;
}

const TravelTips = ({ tips, destination }: TravelTipsProps) => {
  const additionalTips = [
    { icon: Shield, tip: 'Keep digital copies of all documents' },
    { icon: MapPin, tip: 'Download offline maps of the area' },
    { icon: Clock, tip: 'Arrive 15 minutes early for activities' },
    { icon: Camera, tip: 'Best photos during golden hour' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Smart Travel Tips</h3>
          <p className="text-sm text-muted-foreground">For your {destination} trip</p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-sm text-foreground/90">{tip}</span>
          </motion.div>
        ))}
      </div>

      {/* Quick tips grid */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {additionalTips.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/30"
          >
            <item.icon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground">{item.tip}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TravelTips;
