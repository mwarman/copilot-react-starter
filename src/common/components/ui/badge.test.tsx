import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    // Act
    render(<Badge>Default Badge</Badge>);

    // Assert
    expect(screen.getByText('Default Badge')).toBeInTheDocument();
  });

  it('renders with secondary variant', () => {
    // Act
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    // Assert
    expect(screen.getByText('Secondary Badge')).toBeInTheDocument();
  });

  it('renders with destructive variant', () => {
    // Act
    render(<Badge variant="destructive">Error Badge</Badge>);

    // Assert
    expect(screen.getByText('Error Badge')).toBeInTheDocument();
  });

  it('renders with outline variant', () => {
    // Act
    render(<Badge variant="outline">Outline Badge</Badge>);

    // Assert
    expect(screen.getByText('Outline Badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    // Act
    render(<Badge className="custom-class">Custom Badge</Badge>);

    // Assert
    const badgeElement = screen.getByText('Custom Badge');
    expect(badgeElement).toHaveClass('custom-class');
  });
});
