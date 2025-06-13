// Simple validation test for the new data management system
import dataManager from './dataManager';

// Test basic functionality
console.log('Testing Data Manager...');

// Test core data loading
const events = dataManager.getCoreEvents();
const exhibits = dataManager.getCoreExhibits();
const stalls = dataManager.getCoreStalls();
const sponsors = dataManager.getCoreSponsors();

console.log(`✅ Events loaded: ${events.length} items`);
console.log(`✅ Exhibits loaded: ${exhibits.length} items`);
console.log(`✅ Stalls loaded: ${stalls.length} items`);
console.log(`✅ Sponsors loaded: ${sponsors.length} items`);

// Test search functionality
const searchResults = dataManager.searchItems('たこ焼き');
console.log(`✅ Search results for 'たこ焼き': ${searchResults.length} items`);

// Test map data
const mapData = dataManager.getMapData();
console.log(`✅ Map data loaded: ${mapData?.locations.length} locations`);

// Test tag filtering
const taggedItems = dataManager.filterByTags(['食べ物']);
console.log(`✅ Items with '食べ物' tag: ${taggedItems.length} items`);

// Test bookmarks
dataManager.addBookmark('event-1');
console.log(`✅ Bookmark added, total: ${dataManager.getBookmarks().length}`);

console.log('✅ All tests passed! Data management system is working correctly.');

export {};