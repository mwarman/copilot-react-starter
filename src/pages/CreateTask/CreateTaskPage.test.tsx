import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskPage } from './CreateTaskPage';
import { MemoryRouter } from 'react-router-dom';

// Mock the CreateTaskForm component
vi.mock('./components/CreateTaskForm', () => ({
  CreateTaskForm: () => <div data-testid="mock-create-task-form">Mocked Create Task Form</div>,
}));

describe('CreateTaskPage', () => {
  // Helper function to render the component
  const renderComponent = (): RenderResult => {
    return render(
      <MemoryRouter>
        <CreateTaskPage />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  it('renders the page title correctly', () => {
    // Arrange - setup is handled by renderComponent

    // Act
    renderComponent();

    // Assert
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('renders the task form inside a card', () => {
    // Arrange - setup is handled by renderComponent

    // Act
    renderComponent();

    // Assert
    expect(screen.getByText('Task Details')).toBeInTheDocument();
    expect(screen.getByTestId('mock-create-task-form')).toBeInTheDocument();
  });
});
