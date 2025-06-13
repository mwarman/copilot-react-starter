# Requirement: Application Footer Component

## Overview

This document outlines the requirements for creating an application-wide footer component that will appear at the bottom of every page in the application. The footer will display copyright information and branding for "learnBYdoing" while adapting to the application's current theme.

## Requirements

### Technical Requirements

- Create the Footer component in `src/common/components/Footer/Footer.tsx` with accompanying test file `src/common/components/Footer/Footer.test.tsx`
- Utilize the ThemeProvider context to access and adapt to the current theme
- Implement styling using Tailwind CSS utility classes
- Ensure the component is fully accessible according to WCAG standards
- Ensure the component is fully responsive across all device sizes
- Incorporate the footer into the main application layout to ensure it appears consistently across all pages
- Generate the copyright year dynamically to always display the current year

### Dependencies

- ThemeProvider for theme-aware styling
- Tailwind CSS for utility-based styling

## User Experience / Design

### Visual Design

- The footer should span the full width of the application
- Content should be centered both horizontally and vertically within the footer
- The footer should maintain a consistent height across all pages
- Apply appropriate padding and margins for visual balance
- Style should adapt based on the current application theme (light/dark mode)

### Content

- Display the current year in the copyright notice (e.g., "© 2025 learnBYdoing")
- Include the "learnBYdoing" branding text
- Implement responsive design principles to ensure proper display on all device sizes

## Acceptance Criteria

1. **Footer Placement**

   - Footer appears at the bottom of all pages in the application
   - Footer spans the full width of the viewport

2. **Content Display**

   - Copyright notice displays the current year (2025) dynamically
   - "learnBYdoing" branding text is clearly visible
   - All content is centered horizontally and vertically

3. **Theming**

   - Footer properly adapts its styling based on the current application theme
   - Colors and contrast meet accessibility standards in both light and dark themes

4. **Accessibility**

   - Footer meets WCAG accessibility standards
   - Component passes automated accessibility testing

5. **Technical Implementation**
   - Component is properly organized in the common components directory
   - Unit tests successfully verify all required functionality
   - Tests confirm the copyright year is the current year
   - Tests verify the "learnBYdoing" text is present
   - Tests confirm proper styling according to theme
