import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceCategory, TimeOfDay } from '@/types/travel';

export type ItineraryCategoryFilter = PlaceCategory | 'all';
export type ItineraryTimeFilter = TimeOfDay | 'all';
export type ItinerarySortOption = 'default' | 'lowest-cost' | 'highest-rated' | 'shortest-duration' | 'family-friendly';

interface ItineraryFiltersProps {
  category: ItineraryCategoryFilter;
  timeOfDay: ItineraryTimeFilter;
  sortBy: ItinerarySortOption;
  totalActivities: number;
  visibleActivities: number;
  onCategoryChange: (value: ItineraryCategoryFilter) => void;
  onTimeChange: (value: ItineraryTimeFilter) => void;
  onSortChange: (value: ItinerarySortOption) => void;
  onReset: () => void;
}

const categoryOptions: ItineraryCategoryFilter[] = [
  'all',
  'monument',
  'food',
  'nature',
  'adventure',
  'culture',
  'shopping',
];

const timeOptions: ItineraryTimeFilter[] = ['all', 'morning', 'afternoon', 'evening'];

const labelMap: Record<ItineraryCategoryFilter | ItineraryTimeFilter, string> = {
  all: 'All',
  monument: 'Monuments',
  food: 'Food',
  nature: 'Nature',
  adventure: 'Adventure',
  culture: 'Culture',
  shopping: 'Shopping',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

const sortOptions: { value: ItinerarySortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'lowest-cost', label: 'Lowest Cost' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'shortest-duration', label: 'Shortest Duration' },
  { value: 'family-friendly', label: 'Best for Families' },
];

const ItineraryFilters = ({
  category,
  timeOfDay,
  sortBy,
  totalActivities,
  visibleActivities,
  onCategoryChange,
  onTimeChange,
  onSortChange,
  onReset,
}: ItineraryFiltersProps) => {
  const hasActiveFilters = category !== 'all' || timeOfDay !== 'all' || sortBy !== 'default';

  return (
    <div className="glass-card mt-8 p-5 md:p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="w-4 h-4 text-primary" />
            Filter your itinerary
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {visibleActivities} of {totalActivities} activities
          </p>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="gap-2 self-start md:self-auto" onClick={onReset}>
            <X className="w-4 h-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Sort Activities
          </p>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={sortBy === option.value ? 'hero' : 'outline'}
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Time of Day
          </p>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={timeOfDay === option ? 'hero' : 'outline'}
                onClick={() => onTimeChange(option)}
              >
                {labelMap[option]}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={category === option ? 'hero' : 'outline'}
                onClick={() => onCategoryChange(option)}
              >
                {labelMap[option]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryFilters;
