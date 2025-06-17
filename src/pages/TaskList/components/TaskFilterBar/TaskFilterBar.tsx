import { useState, useEffect, type JSX } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Search, X, CheckCircle, Circle, Clock } from 'lucide-react';
import { useDebounce } from '@/common/hooks/useDebounce';

export interface FilterOptions {
  showComplete: boolean;
  showIncomplete: boolean;
  showOverdue: boolean;
}

interface TaskFilterBarProps {
  onFilterChange: (filter: string) => void;
  onFilterOptionsChange: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  filteredCount: number;
  totalCount: number;
}

export const TaskFilterBar = ({
  onFilterChange,
  onFilterOptionsChange,
  filterOptions,
  filteredCount,
  totalCount,
}: TaskFilterBarProps): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 300);

  // This effect will trigger after the debounce delay
  useEffect(() => {
    onFilterChange(debouncedValue);
  }, [debouncedValue, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearClick = () => {
    setInputValue('');
  };

  const toggleFilter = (filterName: keyof FilterOptions) => {
    onFilterOptionsChange({
      ...filterOptions,
      [filterName]: !filterOptions[filterName],
    });
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Filter tasks..."
          value={inputValue}
          onChange={handleInputChange}
          className="pl-8 pr-8"
          aria-label="Filter tasks"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-0 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
            onClick={handleClearClick}
            aria-label="Clear filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filterOptions.showComplete ? 'default' : 'outline'}
          onClick={() => toggleFilter('showComplete')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Complete</span>
        </Button>

        <Button
          size="sm"
          variant={filterOptions.showIncomplete ? 'default' : 'outline'}
          onClick={() => toggleFilter('showIncomplete')}
          className="flex items-center gap-1"
        >
          <Circle className="h-4 w-4" />
          <span>Incomplete</span>
        </Button>

        <Button
          size="sm"
          variant={filterOptions.showOverdue ? 'default' : 'outline'}
          onClick={() => toggleFilter('showOverdue')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          <span>Overdue</span>
        </Button>
      </div>

      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
        SHOWING {filteredCount} OF {totalCount}
      </div>
    </div>
  );
};
