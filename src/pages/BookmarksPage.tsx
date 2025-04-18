import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useBookmark } from '../components/features/bookmark/BookmarkContext';
import BookmarkList from '../components/features/bookmark/BookmarkList';

const BookmarksPage: React.FC = () => {
  const { t } = useLanguage();
  const { bookmarks, clearAllBookmarks } = useBookmark();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  return (
    <div className="bookmarks-page py-6 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('bookmarks.title')}</h1>
          
          {bookmarks.length > 0 && (
            <div>
              {showConfirmClear ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('bookmarks.confirmClear')}
                  </span>
                  <button
                    onClick={clearAllBookmarks}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    {t('bookmarks.yes')}
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="text-sm px-3 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {t('bookmarks.no')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t('bookmarks.clearAll')}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Bookmark stats */}
        {bookmarks.length > 0 && (
          <div className="bg-background-card rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-2">{t('bookmarks.stats')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background-tertiary rounded-md p-3">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 dark:text-blue-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('header.events')}
                    </p>
                    <p className="text-xl font-semibold">
                      {bookmarks.filter(item => item.type === 'event').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-tertiary rounded-md p-3">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 dark:text-purple-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('exhibitions.exhibitions')}
                    </p>
                    <p className="text-xl font-semibold">
                      {bookmarks.filter(item => item.type === 'exhibition').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-tertiary rounded-md p-3">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('exhibitions.foodStalls')}
                    </p>
                    <p className="text-xl font-semibold">
                      {bookmarks.filter(item => item.type === 'foodStall').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bookmarks list */}
        <BookmarkList />
      </div>
    </div>
  );
};

export default BookmarksPage;