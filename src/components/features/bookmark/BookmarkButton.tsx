import React from 'react';
import { useBookmark } from './BookmarkContext';
import { useLanguage } from '../../../hooks/useLanguage';
import { SearchResult } from '../../../types/common';

interface BookmarkButtonProps {
  item: SearchResult;
  iconOnly?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  item,
  iconOnly = false,
  className = '',
  size = 'medium'
}) => {
  const { t } = useLanguage();
  const { isBookmarked, toggleBookmark } = useBookmark();
  
  const isItemBookmarked = isBookmarked(item.id, item.type);
  
  // Size classes
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-2.5'
  };
  
  const iconSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Prevent event bubbling
    toggleBookmark(item);
  };

  return (
    <button
      onClick={handleClick}
      className={`bookmark-button ${sizeClasses[size]} 
                rounded-full transition-all duration-200 
                flex items-center justify-center
                ${isItemBookmarked 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'bg-white/90 text-gray-600 dark:bg-gray-800/90 dark:text-gray-400'}
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 
                ${className}`}
      aria-label={isItemBookmarked ? t('bookmarks.remove') : t('bookmarks.add')}
      title={isItemBookmarked ? t('bookmarks.remove') : t('bookmarks.add')}
    >
      {isItemBookmarked ? (
        // Filled bookmark icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizeClasses[size]}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
          />
        </svg>
      ) : (
        // Outline bookmark icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizeClasses[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
      
      {!iconOnly && (
        <span className="ml-2 text-sm font-medium">
          {isItemBookmarked ? t('bookmarks.remove') : t('bookmarks.add')}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;