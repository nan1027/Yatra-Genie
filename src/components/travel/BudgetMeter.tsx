import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Coffee, Hotel, Car, Ticket, ShoppingBag } from 'lucide-react';
import { BudgetBreakdown, BudgetLevel, BUDGET_ESTIMATES } from '@/types/travel';

interface BudgetMeterProps {
  totalBudget: number;
  totalDays: number;
  budgetLevel: BudgetLevel;
  breakdown?: BudgetBreakdown;
}

const BudgetMeter = ({ totalBudget, totalDays, budgetLevel, breakdown }: BudgetMeterProps) => {
  const budgetInfo = BUDGET_ESTIMATES[budgetLevel];
  const dailyBudget = Math.floor(totalBudget / totalDays);

  const budgetBreakdown = breakdown ?? {
    accommodation: Math.floor(totalBudget * 0.32),
    food: Math.floor(totalBudget * 0.22),
    transport: Math.floor(totalBudget * 0.18),
    activities: Math.floor(totalBudget * 0.18),
    shopping: Math.floor(totalBudget * 0.1),
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const getProgressColor = () => {
    switch (budgetLevel) {
      case 'low':
        return 'from-emerald-500 to-emerald-400';
      case 'medium':
        return 'from-primary to-secondary';
      case 'high':
        return 'from-amber-500 to-orange-400';
    }
  };

  const items = [
    { label: 'Stay', icon: Hotel, amount: budgetBreakdown.accommodation, color: 'bg-primary' },
    { label: 'Food', icon: Coffee, amount: budgetBreakdown.food, color: 'bg-secondary' },
    { label: 'Transport', icon: Car, amount: budgetBreakdown.transport, color: 'bg-accent' },
    { label: 'Activities', icon: Ticket, amount: budgetBreakdown.activities, color: 'bg-emerald-500' },
    { label: 'Shopping', icon: ShoppingBag, amount: budgetBreakdown.shopping, color: 'bg-amber-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
            <p className="text-sm text-muted-foreground">{budgetInfo.label} travel for {totalDays} days</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</div>
          <div className="text-sm text-muted-foreground">{formatCurrency(dailyBudget)}/day</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-4 overflow-hidden rounded-full bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`relative h-full rounded-full bg-gradient-to-r ${getProgressColor()}`}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(budgetInfo.min * totalDays)} min</span>
          <span>{formatCurrency(budgetInfo.max * totalDays)} max</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <TrendingUp className="h-4 w-4" />
          Smart Budget Breakdown
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
              className="rounded-xl border border-border bg-muted/30 p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}/20`}>
                  <item.icon className={`h-4 w-4 ${item.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetMeter;
