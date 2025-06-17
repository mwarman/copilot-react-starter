import { useState, useEffect, type JSX } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/common/hooks/useDebounce';

interface TaskFilterBarProps {
  onFilterChange: (filter: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const TaskFilterBar = ({ onFilterChange, filteredCount, totalCount }: TaskFilterBarProps): JSX.Element => {
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
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
        SHOWING {filteredCount} OF {totalCount}
      </div>
    </div>
  );
};
