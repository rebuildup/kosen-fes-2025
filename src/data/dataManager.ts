import { DataStore, ItemCore, ItemDetails, EventCore, ExhibitCore, StallCore, SponsorCore, MapData, DataState } from '../types/data';
import { events } from './events';
import { exhibits } from './exhibits';
import { stalls } from './stalls';
import { sponsors } from './sponsors';
import { campusMapData } from './mapData';

// Helper to create data state
const createDataState = <T>(data: T): DataState<T> => ({
  data,
  loading: false,
  error: null,
  lastUpdated: Date.now(),
});

// Helper to create loading state
const createLoadingState = <T>(): DataState<T> => ({
  data: null,
  loading: true,
  error: null,
});

// Helper to split data into core and details
const splitEventData = (event: any): { core: EventCore; details: any } => ({
  core: {
    id: event.id,
    type: event.type,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    tags: event.tags,
    imageUrl: event.imageUrl,
    organizer: event.organizer,
    duration: event.duration,
  },
  details: {
    description: event.description,
  },
});

const splitExhibitData = (exhibit: any): { core: ExhibitCore; details: any } => ({
  core: {
    id: exhibit.id,
    type: exhibit.type,
    title: exhibit.title,
    date: exhibit.date,
    time: exhibit.time,
    location: exhibit.location,
    tags: exhibit.tags,
    imageUrl: exhibit.imageUrl,
    creator: exhibit.creator,
  },
  details: {
    description: exhibit.description,
  },
});

const splitStallData = (stall: any): { core: StallCore; details: any } => ({
  core: {
    id: stall.id,
    type: stall.type,
    title: stall.title,
    date: stall.date,
    time: stall.time,
    location: stall.location,
    tags: stall.tags,
    imageUrl: stall.imageUrl,
  },
  details: {
    description: stall.description,
    products: stall.products || [],
  },
});

const splitSponsorData = (sponsor: any): { core: SponsorCore; details: any } => ({
  core: {
    id: sponsor.id,
    type: sponsor.type,
    title: sponsor.title,
    date: sponsor.date,
    time: sponsor.time,
    location: sponsor.location,
    tags: sponsor.tags,
    imageUrl: sponsor.imageUrl,
    tier: sponsor.tier,
  },
  details: {
    description: sponsor.description,
    website: sponsor.website,
    contactEmail: sponsor.contactEmail,
  },
});

// Get map data from the new centralized map data
const getMapData = (): MapData => campusMapData;

class DataManager {
  private store: DataStore;
  private detailsCache = new Map<string, any>();

  constructor() {
    // Initialize core data immediately
    const eventData = events.map(splitEventData);
    const exhibitData = exhibits.map(splitExhibitData);
    const stallData = stalls.map(splitStallData);
    const sponsorData = sponsors.map(splitSponsorData);

    // Store details for later use
    eventData.forEach(({ details }, index) => {
      this.detailsCache.set(`event-${events[index].id}`, details);
    });
    exhibitData.forEach(({ details }, index) => {
      this.detailsCache.set(`exhibit-${exhibits[index].id}`, details);
    });
    stallData.forEach(({ details }, index) => {
      this.detailsCache.set(`stall-${stalls[index].id}`, details);
    });
    sponsorData.forEach(({ details }, index) => {
      this.detailsCache.set(`sponsor-${sponsors[index].id}`, details);
    });

    this.store = {
      // Core data (loaded immediately)
      events: createDataState(eventData.map(d => d.core)),
      exhibits: createDataState(exhibitData.map(d => d.core)),
      stalls: createDataState(stallData.map(d => d.core)),
      sponsors: createDataState(sponsorData.map(d => d.core)),
      
      // Detailed data (loaded on-demand)
      eventDetails: {},
      exhibitDetails: {},
      stallDetails: {},
      sponsorDetails: {},
      
      // Map data
      mapData: createDataState(getMapData()),
      
      // User data (loaded from localStorage)
      bookmarks: this.loadBookmarks(),
      searchHistory: this.loadSearchHistory(),
      preferences: this.loadPreferences(),
    };
  }

  // Get core data (always available)
  getCoreEvents(): EventCore[] {
    return this.store.events.data || [];
  }

  getCoreExhibits(): ExhibitCore[] {
    return this.store.exhibits.data || [];
  }

  getCoreStalls(): StallCore[] {
    return this.store.stalls.data || [];
  }

  getCoreSponsors(): SponsorCore[] {
    return this.store.sponsors.data || [];
  }

  getAllCoreItems(): ItemCore[] {
    return [
      ...this.getCoreEvents(),
      ...this.getCoreExhibits(),
      ...this.getCoreStalls(),
      ...this.getCoreSponsors(),
    ];
  }

  // Get detailed data (loaded on-demand)
  async getEventDetails(id: string): Promise<any> {
    const cacheKey = `event-${id}`;
    if (this.store.eventDetails[id]?.data) {
      return this.store.eventDetails[id].data;
    }

    this.store.eventDetails[id] = createLoadingState();
    
    // Simulate async loading (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const details = this.detailsCache.get(cacheKey);
    this.store.eventDetails[id] = createDataState(details);
    
    return details;
  }

  async getExhibitDetails(id: string): Promise<any> {
    const cacheKey = `exhibit-${id}`;
    if (this.store.exhibitDetails[id]?.data) {
      return this.store.exhibitDetails[id].data;
    }

    this.store.exhibitDetails[id] = createLoadingState();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const details = this.detailsCache.get(cacheKey);
    this.store.exhibitDetails[id] = createDataState(details);
    
    return details;
  }

  async getStallDetails(id: string): Promise<any> {
    const cacheKey = `stall-${id}`;
    if (this.store.stallDetails[id]?.data) {
      return this.store.stallDetails[id].data;
    }

    this.store.stallDetails[id] = createLoadingState();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const details = this.detailsCache.get(cacheKey);
    this.store.stallDetails[id] = createDataState(details);
    
    return details;
  }

  async getSponsorDetails(id: string): Promise<any> {
    const cacheKey = `sponsor-${id}`;
    if (this.store.sponsorDetails[id]?.data) {
      return this.store.sponsorDetails[id].data;
    }

    this.store.sponsorDetails[id] = createLoadingState();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const details = this.detailsCache.get(cacheKey);
    this.store.sponsorDetails[id] = createDataState(details);
    
    return details;
  }

  // Get map data
  getMapData(): MapData | null {
    return this.store.mapData.data;
  }

  // Search functionality
  searchItems(query: string): ItemCore[] {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    const allItems = this.getAllCoreItems();
    
    return allItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        item.location.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  // Filter by tags
  filterByTags(tags: string[]): ItemCore[] {
    if (tags.length === 0) return this.getAllCoreItems();
    
    return this.getAllCoreItems().filter((item) =>
      tags.some((tag) => item.tags.includes(tag))
    );
  }

  // Bookmarks management
  private loadBookmarks(): string[] {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  }

  getBookmarks(): string[] {
    return this.store.bookmarks;
  }

  addBookmark(id: string): void {
    if (!this.store.bookmarks.includes(id)) {
      this.store.bookmarks.push(id);
      this.saveBookmarks();
    }
  }

  removeBookmark(id: string): void {
    this.store.bookmarks = this.store.bookmarks.filter(bookmarkId => bookmarkId !== id);
    this.saveBookmarks();
  }

  isBookmarked(id: string): boolean {
    return this.store.bookmarks.includes(id);
  }

  private saveBookmarks(): void {
    localStorage.setItem("bookmarks", JSON.stringify(this.store.bookmarks));
  }

  // Search history
  private loadSearchHistory(): string[] {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  }

  addToSearchHistory(query: string): void {
    if (query.trim()) {
      this.store.searchHistory = [
        query,
        ...this.store.searchHistory.filter(q => q !== query)
      ].slice(0, 10); // Keep only last 10
      localStorage.setItem("searchHistory", JSON.stringify(this.store.searchHistory));
    }
  }

  getSearchHistory(): string[] {
    return this.store.searchHistory;
  }

  // Preferences
  private loadPreferences() {
    const saved = localStorage.getItem("preferences");
    return saved ? JSON.parse(saved) : {
      language: "ja",
      theme: "light",
    };
  }

  updatePreferences(preferences: Partial<typeof this.store.preferences>): void {
    this.store.preferences = { ...this.store.preferences, ...preferences };
    localStorage.setItem("preferences", JSON.stringify(this.store.preferences));
  }

  getPreferences() {
    return this.store.preferences;
  }
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;