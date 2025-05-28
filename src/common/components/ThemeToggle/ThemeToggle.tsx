import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import Button from "../Button/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant="ghost"
        size="icon"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        data-testid="theme-toggle"
        className="relative size-9 p-0 hover:bg-slate-600/50 dark:hover:bg-slate-700/50"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-300" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300 inset-0 m-auto" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
