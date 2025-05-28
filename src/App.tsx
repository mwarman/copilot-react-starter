import Router from "./common/components/Router/Router";
import { ThemeProvider } from "./common/components/ThemeProvider/ThemeProvider";

/**
 * The main App component that provides routing for the application.
 */
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router />
    </ThemeProvider>
  );
}

export default App;
