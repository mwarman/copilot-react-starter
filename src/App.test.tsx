import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the Vite and React logos', () => {
    // Arrange
    render(<App />);

    // Act & Assert
    expect(screen.getByRole('img', { name: 'Vite logo' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'React logo' })).toBeInTheDocument();
  });

  it('increments counter when button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<App />);

    // Act
    const button = screen.getByRole('button', { name: /count is/i });
    await user.click(button);

    // Assert
    expect(button).toHaveTextContent('count is 1');
  });

  it('displays the correct heading', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });
});
