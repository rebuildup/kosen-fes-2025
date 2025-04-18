import React, { useEffect, useState } from 'react';
import { useBookmark } from './BookmarkContext';

interface BookmarkToastProps {
  className?: string;
}

const BookmarkToast: React.FC<BookmarkToastProps> = ({ className = '' }) => {
  const { toast } = useBookmark();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (toast.isVisible) {
      setIsVisible(true);
      
      // Hide toast after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div
      className={`bookmark-toast fixed bottom-8 left-1/2 transform -translate-x-1/2 
                 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 
                 animate-fade-in-up ${className}`}
    >
      {toast.message}
    </div>
  );
};

export default BookmarkToast;