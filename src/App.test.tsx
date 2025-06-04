import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
  it('renders the header', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByRole('heading', { name: /task hero/i })).toBeInTheDocument();
  });

  it('renders headline', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);

    // Act
    const button = screen.getByRole('button', { name: /count is 0/i });
    await user.click(button);

    // Assert
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });
});
