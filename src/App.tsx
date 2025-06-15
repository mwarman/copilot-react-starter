import { BrowserRouter } from 'react-router-dom';
import Router from './common/components/Router/Router';

/**
 * Main App component that wraps the Router with necessary providers
 */
function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
