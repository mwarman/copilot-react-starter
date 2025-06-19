import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster } from './sonner';

// Mock the useTheme hook
vi.mock('@/common/providers/useTheme', () => ({
  useTheme: vi.fn(),
}));

// Mock the sonner library
vi.mock('sonner', () => ({
  Toaster: vi.fn(({ children, ...props }) => (
    <div data-testid="sonner-toaster" {...props}>
      {children}
    </div>
  )),
}));

// Import the mocked dependencies
import { useTheme } from '@/common/providers/useTheme';
import { Toaster as SonnerToaster } from 'sonner';

// Cast to vi.MockedFunction for proper typing
const mockUseTheme = vi.mocked(useTheme);
const mockSonnerToaster = vi.mocked(SonnerToaster);

describe('Toaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Sonner toaster component', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalled();
  });

  it('passes the theme from useTheme hook to Sonner component', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'dark',
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });

  it('passes light theme correctly', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'light',
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });

  it('passes system theme correctly', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'system',
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });

  it('includes default className and style properties', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'light',
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });

  it('spreads additional props to the Sonner component', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
    const additionalProps = {
      position: 'top-right' as const,
      expand: true,
      richColors: true,
    };

    // Act
    render(<Toaster {...additionalProps} />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'light',
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
        ...additionalProps,
      },
      undefined,
    );
  });

  it('allows overriding className via props', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
    const customClassName = 'custom-toaster-class';

    // Act
    render(<Toaster className={customClassName} />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'light',
        className: customClassName,
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });

  it('allows overriding style via props', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
    const customStyle = {
      '--custom-prop': 'custom-value',
      zIndex: 9999,
    };

    // Act
    render(<Toaster style={customStyle} />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: 'light',
        className: 'toaster group',
        style: customStyle,
      },
      undefined,
    );
  });

  it('handles when useTheme returns undefined theme gracefully', () => {
    // Arrange
    mockUseTheme.mockReturnValue({
      theme: undefined as unknown as 'light' | 'dark' | 'system',
      setTheme: vi.fn(),
    });

    // Act
    render(<Toaster />);

    // Assert
    expect(mockSonnerToaster).toHaveBeenCalledWith(
      {
        theme: undefined,
        className: 'toaster group',
        style: {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        },
      },
      undefined,
    );
  });
});
