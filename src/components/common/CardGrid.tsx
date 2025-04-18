import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface CardGridProps {
  title?: string;
  showMoreLink?: string;
  showMoreLabel?: string;
  className?: string;
  children: React.ReactNode;
}

const CardGrid: React.FC<CardGridProps> = ({
  title,
  showMoreLink,
  showMoreLabel,
  className = '',
  children
}) => {
  const { t } = useLanguage();
  
  return (
    <div className={`card-grid ${className}`}>
      {/* Section header with optional title and "Show more" link */}
      {(title || showMoreLink) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          
          {showMoreLink && (
            
              href={showMoreLink}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {showMoreLabel || t('common.viewAll')}
            </a>
          )}
        </div>
      )}
      
      {/* Card grid content */}
      {children}
    </div>
  );
};

export default CardGrid;