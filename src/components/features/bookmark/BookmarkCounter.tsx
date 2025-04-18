import React, { useEffect, useState } from 'react';
import { useBookmark } from './BookmarkContext';
import { useLanguage } from '../../../hooks/useLanguage';

interface BookmarkCounterProps {
  className?: string;
}

const BookmarkCounter: React.FC<BookmarkCounterProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const { bookmarks } = useBookmark();
  const [animated, setAnimated] = useState(false);
  
  // Animate when bookmarks change
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 300);
    
    return () => clearTimeout(timer);
  }, [bookmarks.length]);
  
  return (
    <div className={`bookmark-counter flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1 text-primary-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
      <span
        className={`text-sm font-medium transition-transform duration-300 ${
          animated ? 'transform scale-125' : ''
        }`}
        title={t('bookmarks.count', { count: bookmarks.length })}
      >
        {bookmarks.length}
      </span>
    </div>
  );
};

export default BookmarkCounter;