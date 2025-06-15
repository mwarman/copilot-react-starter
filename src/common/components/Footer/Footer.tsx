/**
 * Footer component that displays at the bottom of every page
 * Includes copyright information and branding
 * Adapts to the current theme (light/dark)
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto flex items-center justify-around px-4 h-12">
        <p className="text-sm">© {currentYear} learnBYdoing</p>
      </div>
    </footer>
  );
};

export default Footer;
