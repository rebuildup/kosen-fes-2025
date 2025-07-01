# Data Management Refactor Documentation

## Overview

This document describes the comprehensive refactor of the data management system for the Kosen Festival 2025 website. The refactor addresses critical performance and maintainability issues identified in the original implementation.

## Problems Addressed

### 1. データ重複

以前の状態では、同じデータ配列が 9 つ以上の異なるファイル（コンテキスト、ページ、コンポーネント）でインポートされていました。これを集約化された DataManager を使用した単一の情報源に変更しました。

### 2. 非効率的なローディング

以前は必要性に関係なく、すべてのページで 100 以上のアイテムがロードされていました。これを必須データは即座にロード、詳細データはオンデマンドでロードする方式に変更しました。

### 3. データアーキテクチャの不備

以前は必須データと詳細データの明確な分離がありませんでした。これを`ItemCore`と`ItemDetails`型を使用した明確な分離に変更しました。

### 4. マップデータの結合

以前は建物座標が部屋データやコンテンツと混在していました。これをコンテンツから独立した別のマップデータ構造に変更しました。

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

すべてのデータ操作を管理する中央クラスです。主な機能は以下の通りです。

- **コアデータ** - イベント、展示、屋台、スポンサー（必須情報のみ）
- **詳細キャッシュ** - 遅延ロードされた詳細情報
- **検索** - 全アイテムタイプ横断検索
- **ブックマーク** - 永続的なブックマーク管理
- **マップデータ** - 分離されたマップ位置と境界

### DataContext

以下を置き換える単一のコンテキストプロバイダです。

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
useSearchCompat(); // Maps to new DataContext
useBookmarkCompat(); // Maps to new DataContext
useTagCompat(); // Maps to new DataContext
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
