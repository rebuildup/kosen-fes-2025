# Data Management Refactor Documentation

## Overview

This document describes the comprehensive refactor of the data management system for the Kosen Festival 2025 website. The refactor addresses critical performance and maintainability issues identified in the original implementation.

## Problems Addressed

### 1. Data Duplication
- **Before**: Same data arrays imported in 9+ different files (contexts, pages, components)
- **After**: Single source of truth with centralized DataManager

### 2. Inefficient Loading
- **Before**: All 100+ items loaded on every page regardless of need
- **After**: Essential data loaded immediately, detailed data loaded on-demand

### 3. No Data Architecture
- **Before**: No clear separation between essential vs detailed data
- **After**: Clear separation with `ItemCore` vs `ItemDetails` types

### 4. Map Data Coupling
- **Before**: Building coordinates mixed with room data and content
- **After**: Separate map data structure independent of content

## New Architecture

### Data Types

```typescript
// Essential data (loaded immediately)
interface ItemCore {
  id: string;
  type: ItemType;
  title: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  imageUrl: string;
}

// Detailed data (loaded on-demand)  
interface ItemDetails {
  description: string;
  // Type-specific details...
}
```

### DataManager Class

Central class managing all data operations:

- **Core Data**: Events, exhibits, stalls, sponsors (essential info only)
- **Details Cache**: Lazy-loaded detailed information
- **Search**: Unified search across all item types
- **Bookmarks**: Persistent bookmark management
- **Map Data**: Separated map locations and bounds

### DataContext

Single context provider replacing:
- SearchContext
- BookmarkContext  
- TagContext
- (Partial) ThemeContext functionality

## Performance Improvements

### Bundle Size Reduction
- **Estimated 60% reduction** in initial data loading
- Only essential fields loaded upfront
- Detailed descriptions loaded when needed

### Memory Efficiency
- Single data instance instead of 9+ duplicates
- Efficient caching for detailed data
- Optimized search and filtering

### Loading Performance
- Immediate availability of core data for lists/previews
- Progressive loading of detailed information
- Reduced Time to Interactive (TTI)

## Migration Strategy

### Backward Compatibility
- Created compatibility adapters for existing hooks
- Gradual migration path for components
- No breaking changes to existing component APIs

### Compatibility Hooks
```typescript
// Old hooks still work through adapters
useSearchCompat() // Maps to new DataContext
useBookmarkCompat() // Maps to new DataContext  
useTagCompat() // Maps to new DataContext
```

## File Structure Changes

### New Files
- `src/types/data.ts` - Enhanced type definitions
- `src/data/dataManager.ts` - Central data management
- `src/context/DataContext.tsx` - Unified data context
- `src/data/mapData.ts` - Separated map data
- `src/context/compatibilityHooks.ts` - Backward compatibility

### Modified Files
- `src/data/store.ts` - Now exports dataManager
- `src/AppProviders.tsx` - Simplified provider structure

## Usage Examples

### Basic Data Access
```typescript
const { events, exhibits, allItems } = useData();

// Search
const results = searchItems("たこ焼き");

// Filter by tags
const foodItems = filterByTags(["食べ物"]);
```

### Detailed Data Loading
```typescript
const { getItemDetails } = useData();

// Load detailed information on-demand
const details = await getItemDetails("event-1", "event");
```

### Map Integration
```typescript
const { mapData } = useData();
const locations = mapData?.locations || [];
```

## Benefits

### For Developers
- Single source of truth for all data operations
- Clear separation of concerns
- Type-safe data access
- Easier testing and debugging

### For Users
- Faster initial page loads
- Improved search performance
- Better memory usage
- Smoother navigation

### For Maintenance
- Reduced code duplication
- Centralized data validation
- Easier to add new data sources
- Better error handling

## Future Enhancements

### Potential Improvements
1. **API Integration**: Easy to connect to backend services
2. **Data Validation**: Centralized validation rules
3. **Caching Strategy**: Advanced caching with TTL
4. **Offline Support**: Service worker integration
5. **Real-time Updates**: WebSocket support for live data

### Migration Steps
1. Update components to use new `useData()` hook
2. Remove old context provider imports
3. Delete old context files once migration complete
4. Add comprehensive testing

## Conclusion

This refactor establishes a solid foundation for the festival website's data management, addressing performance issues while maintaining backward compatibility. The new architecture is more maintainable, performant, and ready for future enhancements.