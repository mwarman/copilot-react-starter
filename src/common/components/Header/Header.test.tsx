import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Create a wrapper component that provides the BrowserRouter context
const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header', () => {
  it('renders the application logo and name', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Assert
    expect(screen.getByText('Task Hero')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Hero homepage')).toBeInTheDocument();
  });

  it('contains a link to the home page', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Act
    const homeLink = screen.getByLabelText('Task Hero homepage');

    // Assert
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('has the BadgeCheck icon', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Assert
    // Since Lucide icons are SVG elements, we can check if an SVG is present within the header
    const header = screen.getByRole('banner');
    const svg = header.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
