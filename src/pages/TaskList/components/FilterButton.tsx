import { Button } from '@/common/components/ui/button';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/common/utils/css';

interface FilterButtonProps {
  /**
   * Label for the button
   */
  label: string;

  /**
   * Icon to display alongside the label
   */
  icon: LucideIcon;

  /**
   * Whether the filter is currently active
   */
  isActive: boolean;

  /**
   * Handler for when the button is clicked
   */
  onClick: () => void;

  /**
   * Optional data-testid for testing
   */
  testId?: string;
}

/**
 * A toggleable filter button with icon and label
 */
export const FilterButton = ({ label, icon: Icon, isActive, onClick, testId }: FilterButtonProps) => {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={cn(
        'ml-1 first:ml-0 h-9',
        isActive ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground',
      )}
      aria-pressed={isActive}
      data-testid={testId}
    >
      <Icon className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
};
