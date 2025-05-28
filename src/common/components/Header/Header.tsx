import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

/**
 * The Header component displays the application header with the app name and theme toggle.
 */
const Header = (): JSX.Element => {
  return (
    <header className="bg-slate-900 dark:bg-slate-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">React Starter Kit</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
