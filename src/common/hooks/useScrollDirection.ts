import { useEffect, useState } from 'react';

/**
 * Custom hook to track scroll direction and visibility state for header animations
 * @param threshold - Minimum scroll distance before triggering direction change (default: 10px)
 * @returns Object containing scroll direction and visibility state
 */
export const useScrollDirection = (threshold: number = 10) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      // Only update if scroll distance exceeds threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        return;
      }

      setScrollDirection(direction);
      setIsVisible(direction === 'up' || scrollY < 100); // Always show at top
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    const onScroll = () => window.requestAnimationFrame(updateScrollDirection);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY, threshold]);

  return { scrollDirection, isVisible };
};
