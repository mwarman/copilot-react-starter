import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Search, X, CheckCircle, Circle, Clock } from 'lucide-react';
import { FilterButton } from './FilterButton';
import { type TaskFilters } from '../hooks/useFilterTasks';

interface TaskFilterBarProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
  filters: TaskFilters;
  onFilterToggle: (filterName: keyof TaskFilters) => void;
}

/**
 * A component that displays a search bar for filtering tasks
 * along with a count of filtered items vs total items.
 * Also includes filter buttons for Complete, Incomplete, and Overdue tasks.
 */
export const TaskFilterBar = ({
  filterText,
  onFilterChange,
  filteredCount,
  totalCount,
  filters,
  onFilterToggle,
}: TaskFilterBarProps) => {
  const handleClear = () => {
    onFilterChange('');
  };

  return (
    <div className="flex flex-col mb-4 p-3 bg-muted rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-3">
        <div className="relative w-full sm:w-80 mb-2 sm:mb-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter tasks..."
            value={filterText}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-8 pr-8 w-full bg-background/70"
            aria-label="Filter tasks"
            data-testid="task-filter-input"
          />
          {filterText && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={handleClear}
              aria-label="Clear filter"
              data-testid="clear-filter-button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground sm:ml-4">
          {filteredCount} of {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <FilterButton
          label="Complete"
          icon={CheckCircle}
          isActive={filters.showComplete}
          onClick={() => onFilterToggle('showComplete')}
          testId="filter-complete-button"
        />
        <FilterButton
          label="Incomplete"
          icon={Circle}
          isActive={filters.showIncomplete}
          onClick={() => onFilterToggle('showIncomplete')}
          testId="filter-incomplete-button"
        />
        <FilterButton
          label="Overdue"
          icon={Clock}
          isActive={filters.showOverdue}
          onClick={() => onFilterToggle('showOverdue')}
          testId="filter-overdue-button"
        />
      </div>
    </div>
  );
};

export default TaskFilterBar;
