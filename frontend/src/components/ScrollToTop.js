import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top of the page on route change
    window.scrollTo(0, 0);
  }, [location]); // Dependency on location means this will run on every route change

  return null; // This component doesn't render anything
};

export default ScrollToTop;
