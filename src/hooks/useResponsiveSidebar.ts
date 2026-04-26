import { useState, useEffect, useCallback } from 'react';

interface UseResponsiveSidebarOptions {
  breakpoint?: number;
  initialCollapsed?: boolean;
}

interface UseResponsiveSidebarReturn {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openMobileSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  isMobile: boolean;
}

export function useResponsiveSidebar(
  options: UseResponsiveSidebarOptions = {}
): UseResponsiveSidebarReturn {
  const { breakpoint = 768, initialCollapsed = false } = options;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= breakpoint;
      setIsMobile(mobile);

      // Close mobile sidebar when resizing to desktop
      if (!mobile && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    // Initial check
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint, mobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  const collapseSidebar = useCallback(() => {
    setSidebarCollapsed(true);
  }, []);

  const expandSidebar = useCallback(() => {
    setSidebarCollapsed(false);
  }, []);

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    openMobileSidebar,
    collapseSidebar,
    expandSidebar,
    isMobile,
  };
}
