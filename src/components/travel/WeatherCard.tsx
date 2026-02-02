import { motion } from 'framer-motion';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '@/types/travel';

interface WeatherCardProps {
  weather: WeatherData;
  destination: string;
}

const WeatherCard = ({ weather, destination }: WeatherCardProps) => {
  const getWeatherEmoji = (condition: string) => {
    const conditions: Record<string, string> = {
      'Sunny': '☀️',
      'Clear': '🌤️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Stormy': '⛈️',
    };
    return conditions[condition] || '🌤️';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 overflow-hidden relative"
    >
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Weather in {destination}</h3>
            <p className="text-sm text-muted-foreground">{weather.description}</p>
          </div>
          <div className="text-5xl animate-float">
            {getWeatherEmoji(weather.condition)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{weather.temperature}°C</div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{weather.humidity}%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{weather.condition}</div>
              <div className="text-xs text-muted-foreground">Condition</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
