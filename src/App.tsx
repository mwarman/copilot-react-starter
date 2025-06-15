import { BrowserRouter } from 'react-router-dom';
import Router from './common/components/Router/Router';
import { ThemeProvider } from './common/providers/ThemeProvider';

/**
 * Main App component that wraps the Router with necessary providers
 */
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="task-ui-theme">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
