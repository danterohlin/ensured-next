'use client';

import { useEffect, useRef } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

interface OverlayScrollbarsWrapperProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
}

export default function OverlayScrollbarsWrapper({
  children,
  className = '',
  options = {},
}: OverlayScrollbarsWrapperProps) {
  const osTargetRef = useRef<HTMLDivElement>(null);
  const osInstanceRef = useRef<OverlayScrollbars | null>(null);

  useEffect(() => {
    if (osTargetRef.current && !osInstanceRef.current) {
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
        ...options,
      };

      osInstanceRef.current = OverlayScrollbars(
        osTargetRef.current,
        defaultOptions
      );
    }

    return () => {
      if (osInstanceRef.current) {
        osInstanceRef.current.destroy();
        osInstanceRef.current = null;
      }
    };
  }, [options]);

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
