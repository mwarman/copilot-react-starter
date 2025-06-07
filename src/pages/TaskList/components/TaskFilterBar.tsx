import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Search, X } from 'lucide-react';

interface TaskFilterBarProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * A component that displays a search bar for filtering tasks
 * along with a count of filtered items vs total items.
 */
export const TaskFilterBar = ({ filterText, onFilterChange, filteredCount, totalCount }: TaskFilterBarProps) => {
  const handleClear = () => {
    onFilterChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-3 bg-muted rounded-md">
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
      <div className="text-sm text-muted-foreground">
        {filteredCount} of {totalCount} {totalCount === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
};

export default TaskFilterBar;
