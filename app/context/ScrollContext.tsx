'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
} from 'react';

interface ScrollContextType {
  scrollY: number;
  setScrollY: (scrollTop: number) => void;
  isVisible: boolean;
  updateScroll: (scrollTop: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const lastScrollYRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = (event: CustomEvent) => {
      const scrollTop = event.detail.scrollY;
      setScrollY(scrollTop);

      // Update visibility based on scroll position
      if (scrollTop <= 10) {
        setIsVisible(true);
      } else if (scrollTop > lastScrollYRef.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollYRef.current = scrollTop;
    };

    window.addEventListener('ensured-scroll', handleScroll as EventListener);
    return () => {
      window.removeEventListener(
        'ensured-scroll',
        handleScroll as EventListener
      );
    };
  }, []);

  const updateScroll = useCallback((scrollTop: number) => {
    // This is now just for compatibility, actual updates come from event
    setScrollY(scrollTop);
  }, []);

  return (
    <ScrollContext.Provider
      value={{ scrollY, setScrollY, isVisible, updateScroll }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}
