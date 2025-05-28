/**
 * The Footer component provides a standard application footer with copyright information.
 */
const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-slate-100 dark:bg-slate-800 transition-colors">
      <div className="container mx-auto flex items-center justify-center">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          © {currentYear} <span className="ml-1">IlearnBYdoing</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
