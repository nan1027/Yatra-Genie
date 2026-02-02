import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Coffee, Hotel, Car, Ticket } from 'lucide-react';
import { BudgetLevel, BUDGET_ESTIMATES } from '@/types/travel';

interface BudgetMeterProps {
  totalBudget: number;
  totalDays: number;
  budgetLevel: BudgetLevel;
}

const BudgetMeter = ({ totalBudget, totalDays, budgetLevel }: BudgetMeterProps) => {
  const budgetInfo = BUDGET_ESTIMATES[budgetLevel];
  const dailyBudget = Math.floor(totalBudget / totalDays);
  
  // Budget breakdown percentages
  const breakdown = {
    accommodation: 35,
    food: 25,
    transport: 20,
    activities: 20,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = () => {
    switch (budgetLevel) {
      case 'low': return 'from-emerald-500 to-emerald-400';
      case 'medium': return 'from-primary to-secondary';
      case 'high': return 'from-amber-500 to-orange-400';
    }
  };

  const breakdownItems = [
    { label: 'Accommodation', icon: Hotel, percentage: breakdown.accommodation, color: 'bg-primary' },
    { label: 'Food & Dining', icon: Coffee, percentage: breakdown.food, color: 'bg-secondary' },
    { label: 'Transport', icon: Car, percentage: breakdown.transport, color: 'bg-accent' },
    { label: 'Activities', icon: Ticket, percentage: breakdown.activities, color: 'bg-emerald-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
            <p className="text-sm text-muted-foreground">{budgetInfo.label} Travel • {totalDays} Days</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</div>
          <div className="text-sm text-muted-foreground">{formatCurrency(dailyBudget)}/day</div>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="mb-6">
        <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatCurrency(budgetInfo.min * totalDays)} min</span>
          <span>{formatCurrency(budgetInfo.max * totalDays)} max</span>
        </div>
      </div>

      {/* Budget breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Estimated Breakdown
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {breakdownItems.map((item, index) => {
            const amount = Math.floor(totalBudget * (item.percentage / 100));
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="p-3 rounded-xl bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${item.color}/20 flex items-center justify-center`}>
                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(amount)}</span>
                  <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetMeter;
