import { type JSX } from 'react';

/**
 * Application footer component that displays across all pages.
 * Shows the copyright year and "learnBYdoing" text with appropriate styling.
 */
export const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 bg-background border-t">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm text-muted-foreground">© {currentYear} learnBYdoing</p>
      </div>
    </footer>
  );
};

export default Footer;
