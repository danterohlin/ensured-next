'use client';

import { useEffect, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import { useScroll } from '../context/ScrollContext';

interface PageScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
}

export default function PageScrollWrapper({
  children,
  className = '',
  options = {},
}: PageScrollWrapperProps) {
  const osTargetRef = useRef<HTMLDivElement>(null);
  const osInstanceRef = useRef<OverlayScrollbars | null>(null);
  // Don't use the context here to avoid re-renders

  useEffect(() => {
    if (osTargetRef.current && !osInstanceRef.current) {
      console.log('Initializing OverlayScrollbars');
      // Default options that work well with dark themes
      const defaultOptions = {
        overflow: {
          x: 'hidden',
          y: 'scroll',
        },
        scrollbars: {
          theme: 'os-theme-dark',
          visibility: 'auto',
          autoHide: 'move',
          autoHideDelay: 1300,
          autoHideSuspend: false,
          dragScroll: true,
          clickScroll: false,
          pointers: ['mouse', 'touch', 'pen'],
        },
        cancel: {
          nativeScrollbarsOverlaid: false,
          body: null,
        },
        update: {
          elementEvents: [],
          debounce: [0, 33],
          attributes: null,
          ignoreMutation: () => true,
        },
        paddingAbsolute: false,
        ...options,
      };

      try {
        osInstanceRef.current = OverlayScrollbars(
          osTargetRef.current,
          defaultOptions
        );
        console.log(
          'OverlayScrollbars initialized successfully',
          osInstanceRef.current
        );

        // Listen to scroll events and dispatch custom event
        if (osInstanceRef.current) {
          osInstanceRef.current.on('scroll', (instance) => {
            const viewport = instance.elements().viewport;
            if (viewport) {
              // Dispatch custom event instead of calling context
              window.dispatchEvent(
                new CustomEvent('ensured-scroll', {
                  detail: { scrollY: viewport.scrollTop },
                })
              );
            }
          });
        }
      } catch (error) {
        console.error('Error initializing OverlayScrollbars:', error);
      }
    }

    return () => {
      // Only destroy on actual component unmount, not on re-renders
      if (osInstanceRef.current) {
        console.log('Cleaning up OverlayScrollbars on unmount');
        osInstanceRef.current.destroy();
        osInstanceRef.current = null;
      }
    };
  }, []); // Remove options dependency to prevent re-initialization

  return (
    <div
      ref={osTargetRef}
      className={`h-full w-full ${className}`}
      data-overlayscrollbars-initialize
    >
      {children}
    </div>
  );
}
