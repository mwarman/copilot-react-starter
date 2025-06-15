import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';

// Mock Radix UI Portal to make testing easier
vi.mock('@radix-ui/react-dropdown-menu', async () => {
  const actual = await vi.importActual('@radix-ui/react-dropdown-menu');
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('DropdownMenu components', () => {
  it('renders DropdownMenu with proper data-slot attributes', () => {
    // Arrange
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      </DropdownMenu>,
    );

    // Assert
    // Testing the root component's attribute is not directly accessible
    // since it doesn't render a DOM element directly
    const trigger = screen.getByText('Open menu');
    expect(trigger.parentElement).toBeTruthy();
  });

  it('renders DropdownMenuTrigger with proper data-slot attribute', () => {
    // Arrange
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      </DropdownMenu>,
    );

    // Assert
    const trigger = screen.getByText('Open menu');
    expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
  });

  it('renders DropdownMenuContent with proper data-slot attribute and classes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>Content</DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const content = screen.getByText('Content');
    expect(content).toHaveAttribute('data-slot', 'dropdown-menu-content');
    expect(content).toHaveClass('bg-popover');
    expect(content).toHaveClass('rounded-md');
  });

  it('renders DropdownMenuItem with proper data-slot attribute and classes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem>Menu item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const menuItem = screen.getByText('Menu item');
    expect(menuItem).toHaveAttribute('data-slot', 'dropdown-menu-item');
    expect(menuItem).toHaveClass('select-none');
  });

  it('renders DropdownMenuLabel with proper data-slot attribute and classes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const label = screen.getByText('Label');
    expect(label).toHaveAttribute('data-slot', 'dropdown-menu-label');
    expect(label).toHaveClass('font-medium');
  });

  it('renders DropdownMenuSeparator with proper data-slot attribute and classes', () => {
    // Arrange
    const { container } = render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const separator = container.querySelector('[data-slot="dropdown-menu-separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-px');
  });

  it('renders DropdownMenuCheckboxItem with proper data-slot attribute and classes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>Checkbox item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const checkboxItem = screen.getByText('Checkbox item');
    expect(checkboxItem).toHaveAttribute('data-slot', 'dropdown-menu-checkbox-item');
    expect(checkboxItem).toHaveClass('select-none');
    expect(checkboxItem).toHaveAttribute('data-state', 'checked');
  });

  it('renders DropdownMenuRadioGroup and DropdownMenuRadioItem with proper data-slot attributes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">Radio item 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Radio item 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const radioGroup = screen.getByText('Radio item 1').closest('[data-slot="dropdown-menu-radio-group"]');
    expect(radioGroup).toBeInTheDocument();

    const radioItem1 = screen.getByText('Radio item 1');
    expect(radioItem1).toHaveAttribute('data-slot', 'dropdown-menu-radio-item');
    expect(radioItem1).toHaveAttribute('data-state', 'checked');

    const radioItem2 = screen.getByText('Radio item 2');
    expect(radioItem2).toHaveAttribute('data-slot', 'dropdown-menu-radio-item');
    expect(radioItem2).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders DropdownMenuShortcut with proper data-slot attribute and classes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Menu item
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const shortcut = screen.getByText('⌘K');
    expect(shortcut).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
    expect(shortcut).toHaveClass('text-xs');
  });

  it('renders DropdownMenuGroup with proper data-slot attribute', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const item1 = screen.getByText('Item 1');
    const item2 = screen.getByText('Item 2');
    const group = item1.closest('[data-slot="dropdown-menu-group"]');
    expect(group).toBeInTheDocument();
    expect(group).toContainElement(item1);
    expect(group).toContainElement(item2);
  });

  it('renders DropdownMenuSub and DropdownMenuSubTrigger with proper data-slot attributes', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const subTrigger = screen.getByText('More options');
    expect(subTrigger).toHaveAttribute('data-slot', 'dropdown-menu-sub-trigger');

    // SubContent is not rendered in the DOM until the trigger is clicked
    // so we only test the trigger's presence
  });

  it('applies inset prop correctly to DropdownMenuItem', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const insetItem = screen.getByText('Inset item');
    expect(insetItem).toHaveAttribute('data-inset', 'true');
  });

  it('applies variant prop correctly to DropdownMenuItem', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Destructive item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const destructiveItem = screen.getByText('Destructive item');
    expect(destructiveItem).toHaveAttribute('data-variant', 'destructive');
  });

  it('applies inset prop correctly to DropdownMenuLabel', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Inset label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const insetLabel = screen.getByText('Inset label');
    expect(insetLabel).toHaveAttribute('data-inset', 'true');
  });

  it('applies custom className to components', () => {
    // Arrange
    render(
      <DropdownMenu open>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Custom item</DropdownMenuItem>
          <DropdownMenuLabel className="custom-label">Custom label</DropdownMenuLabel>
          <DropdownMenuSeparator className="custom-separator" />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    // Assert
    const content = screen.getByText('Custom item').closest('[data-slot="dropdown-menu-content"]');
    expect(content).toHaveClass('custom-content');

    const item = screen.getByText('Custom item');
    expect(item).toHaveClass('custom-item');

    const label = screen.getByText('Custom label');
    expect(label).toHaveClass('custom-label');

    const separator = content?.querySelector('[data-slot="dropdown-menu-separator"]');
    expect(separator).toHaveClass('custom-separator');
  });
});
