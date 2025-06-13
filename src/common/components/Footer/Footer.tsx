import { type JSX } from 'react';

/**
 * Application footer component that displays across all pages.
 * Shows the copyright year and "learnBYdoing" text with appropriate styling.
 */
export const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-16 bg-secondary border-t">
      <div className="container h-full px-4 mx-auto flex justify-center items-center">
        <p className="text-sm text-muted-foreground">© {currentYear} learnBYdoing</p>
      </div>
    </footer>
  );
};

export default Footer;
