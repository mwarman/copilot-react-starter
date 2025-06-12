import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mockServer';

// Start the mock server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close the server after all tests are done
afterAll(() => server.close());

// Mock matchMedia for theme detection in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Add the mock to the global object
window.ResizeObserver = ResizeObserverMock;
