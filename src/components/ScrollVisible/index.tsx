import { useState, useRef } from 'react';

const useScrollVisibility = (isTransparentScreen: boolean = false ) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLIonContentElement>(null);

  const handleScroll = (event?: CustomEvent<any>) => {
    if (!event) return;
    
    const currentScrollPosition = event.detail.scrollTop;
    
    if (isTransparentScreen) {
      setIsVisible(currentScrollPosition <= 60);
    } else {
      if (lastScrollPosition - currentScrollPosition >= 60) {
        setIsVisible(true);
        setLastScrollPosition(currentScrollPosition);
      } else if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 0) {
        setIsVisible(false);
        setLastScrollPosition(currentScrollPosition);
      } else if (currentScrollPosition <= 0) {
        setIsVisible(true);
      }
    }
  };

  return {
    isVisible,
    scrollContainerRef,
    handleScroll,
  };
};

export { useScrollVisibility };