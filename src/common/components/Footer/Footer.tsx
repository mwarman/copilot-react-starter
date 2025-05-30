/**
 * The Footer component provides a standard application footer with copyright information.
 */
const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-slate-900 dark:bg-slate-800 text-slate-100 transition-colors">
      <div className="container mx-auto flex items-center justify-center">
        <div className="text-sm">
          © {currentYear} <span className="ml-1">learnBYdoing</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
