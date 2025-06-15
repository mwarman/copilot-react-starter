import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/common/providers/useTheme';

// Mock the useTheme hook
vi.mock('@/common/providers/useTheme', () => ({
  useTheme: vi.fn(),
}));

// Mock the dropdown-menu components
vi.mock('@/common/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button data-testid={`dropdown-item-${children}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    // Default mock implementation
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    // Reset mock before each test
    mockSetTheme.mockReset();
  });

  it('renders correctly with theme toggle button', () => {
    render(<ThemeToggle />);

    // Check if the dropdown components are rendered
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when light option is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Click the light theme option
    const lightOption = screen.getByTestId('dropdown-item-Light');
    await user.click(lightOption);

    // Check if setTheme was called with correct argument
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it("calls setTheme with 'dark' when dark option is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Click the dark theme option
    const darkOption = screen.getByTestId('dropdown-item-Dark');
    await user.click(darkOption);

    // Check if setTheme was called with correct argument
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it("calls setTheme with 'system' when system option is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Click the system theme option
    const systemOption = screen.getByTestId('dropdown-item-System');
    await user.click(systemOption);

    // Check if setTheme was called with correct argument
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
