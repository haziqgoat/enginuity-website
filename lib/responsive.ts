// Utility functions for responsive design

export const isMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

export const isTablet = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }
  return false;
};

export const isDesktop = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024;
  }
  return false;
};

// Responsive breakpoints matching Tailwind CSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const getCurrentBreakpoint = () => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    if (width < breakpoints['2xl']) return 'xl';
    return '2xl';
  }
  return 'md'; // default
};