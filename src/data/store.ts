// Central data store - re-export dataManager as the main store
export { dataManager as store, dataManager as default } from './dataManager';

// Re-export types for convenience
export type { DataStore, ItemCore, ItemDetails, MapData } from '../types/data';