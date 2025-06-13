// Centralized Data Management System
// This provides a unified interface for all data operations

import { Item, Event, Exhibit, Stall, Sponsor } from '../types/common';
import { events } from './events';
import { exhibits } from './exhibits';  
import { stalls } from './stalls';
import { sponsors } from './sponsors';

export class DataManager {
  private static instance: DataManager;
  private allItems: Item[] = [];
  private itemsById: Map<string, Item> = new Map();
  private itemsByType: Map<string, Item[]> = new Map();
  private allTags: string[] = [];
  private tagCounts: Map<string, number> = new Map();

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private initializeData(): void {
    // Combine all items
    const allItemsArray: Item[] = [
      ...(events as Event[]),
      ...(exhibits as Exhibit[]),
      ...(stalls as Stall[]),
      ...(sponsors as Sponsor[])
    ];

    this.allItems = allItemsArray;
    
    // Build lookup maps
    this.buildItemMaps();
    this.buildTagMaps();
  }

  private buildItemMaps(): void {
    this.itemsById.clear();
    this.itemsByType.clear();

    // Build ID lookup and type grouping
    for (const item of this.allItems) {
      this.itemsById.set(item.id, item);

      if (!this.itemsByType.has(item.type)) {
        this.itemsByType.set(item.type, []);
      }
      this.itemsByType.get(item.type)!.push(item);
    }
  }

  private buildTagMaps(): void {
    const tagFrequency = new Map<string, number>();
    const uniqueTags = new Set<string>();

    // Count tag occurrences
    for (const item of this.allItems) {
      for (const tag of item.tags) {
        uniqueTags.add(tag);
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
      }
    }

    this.allTags = Array.from(uniqueTags).sort();
    this.tagCounts = tagFrequency;
  }

  // Public API methods

  public getAllItems(): Item[] {
    return [...this.allItems];
  }

  public getItemById(id: string): Item | undefined {
    return this.itemsById.get(id);
  }

  public getItemsByType(type: string): Item[] {
    return [...(this.itemsByType.get(type) || [])];
  }

  public getAllEvents(): Event[] {
    return this.getItemsByType('event') as Event[];
  }

  public getAllExhibits(): Exhibit[] {
    return this.getItemsByType('exhibit') as Exhibit[];
  }

  public getAllStalls(): Stall[] {
    return this.getItemsByType('stall') as Stall[];
  }

  public getAllSponsors(): Sponsor[] {
    return this.getItemsByType('sponsor') as Sponsor[];
  }

  // Tag-related methods
  public getAllTags(): string[] {
    return [...this.allTags];
  }

  public getTagCounts(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [tag, count] of this.tagCounts.entries()) {
      result[tag] = count;
    }
    return result;
  }

  public getPopularTags(limit: number = 10): string[] {
    return [...this.allTags]
      .sort((a, b) => (this.tagCounts.get(b) || 0) - (this.tagCounts.get(a) || 0))
      .slice(0, limit);
  }

  // Search methods
  public searchItems(query: string): Item[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    return this.allItems.filter(item => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }

  // Filter methods
  public filterItemsByTags(items: Item[], selectedTags: string[]): Item[] {
    if (selectedTags.length === 0) {
      return items;
    }

    return items.filter(item =>
      selectedTags.some(tag => item.tags.includes(tag))
    );
  }

  public filterItemsByType(items: Item[], types: string[]): Item[] {
    if (types.length === 0) {
      return items;
    }

    return items.filter(item => types.includes(item.type));
  }

  // Bookmark helper methods
  public getItemsByIds(ids: string[]): Item[] {
    return ids
      .map(id => this.getItemById(id))
      .filter((item): item is Item => item !== undefined);
  }

  // Data validation and health check
  public validateData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate IDs
    const ids = new Set<string>();
    for (const item of this.allItems) {
      if (ids.has(item.id)) {
        errors.push(`Duplicate ID found: ${item.id}`);
      }
      ids.add(item.id);
    }

    // Check for required fields
    for (const item of this.allItems) {
      if (!item.title) errors.push(`Item ${item.id} missing title`);
      if (!item.description) errors.push(`Item ${item.id} missing description`);
      if (!item.location) errors.push(`Item ${item.id} missing location`);
      if (!item.tags || item.tags.length === 0) {
        errors.push(`Item ${item.id} missing tags`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Statistics
  public getStats() {
    return {
      totalItems: this.allItems.length,
      totalEvents: this.getItemsByType('event').length,
      totalExhibits: this.getItemsByType('exhibit').length,
      totalStalls: this.getItemsByType('stall').length,
      totalSponsors: this.getItemsByType('sponsor').length,
      totalTags: this.allTags.length,
      averageTagsPerItem: this.allItems.length > 0 
        ? this.allItems.reduce((sum, item) => sum + item.tags.length, 0) / this.allItems.length 
        : 0
    };
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance();

// Export convenience functions for common operations
export const getAllItems = () => dataManager.getAllItems();
export const getItemById = (id: string) => dataManager.getItemById(id);
export const searchItems = (query: string) => dataManager.searchItems(query);
export const getAllTags = () => dataManager.getAllTags();
export const getTagCounts = () => dataManager.getTagCounts();
export const getPopularTags = (limit?: number) => dataManager.getPopularTags(limit);
export const filterItemsByTags = (items: Item[], tags: string[]) => dataManager.filterItemsByTags(items, tags);