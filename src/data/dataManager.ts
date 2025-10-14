import {
  DataStore,
  ItemCore,
  EventCore,
  ExhibitCore,
  StallCore,
  SponsorCore,
  MapData,
  DataState,
  ItemDetails,
} from "../types/data";
import type { Item, Event, Exhibit, Stall, Sponsor } from "../types/common";
import { events } from "./events";
import { exhibits } from "./exhibits";
import { stalls } from "./stalls";
import { sponsors } from "./sponsors";

type StallDetails = ItemDetails & { products: string[] };
type SponsorDetails = ItemDetails & { website?: string; contactEmail?: string };
type CachedDetails = ItemDetails | StallDetails | SponsorDetails;

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
  lastUpdated: Date.now(),
});

// Helper to split data into core and details
const splitEventData = (event: Event): {
  core: EventCore;
  details: ItemDetails;
} => ({
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
    showOnMap: event.showOnMap,
    showOnSchedule: event.showOnSchedule,
    dayAvailability: event.dayAvailability,
  },
  details: {
    description: event.description,
  },
});

const splitExhibitData = (
  exhibit: Exhibit
): { core: ExhibitCore; details: ItemDetails } => ({
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

const splitStallData = (
  stall: Stall
): { core: StallCore; details: StallDetails } => ({
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

const splitSponsorData = (
  sponsor: Sponsor
): { core: SponsorCore; details: SponsorDetails } => ({
  core: {
    id: sponsor.id,
    type: sponsor.type,
    title: sponsor.title,
    date: sponsor.date,
    time: sponsor.time,
    location: sponsor.location,
    tags: sponsor.tags,
    imageUrl: sponsor.imageUrl,
  },
  details: {
    description: sponsor.description,
    website: sponsor.website,
    contactEmail: sponsor.contactEmail,
  },
});

class DataManager {
  private store: DataStore;
  private detailsCache = new Map<string, CachedDetails>();
  private fullItemIndex = new Map<string, Item>();

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
    events.forEach((event) => {
      this.fullItemIndex.set(event.id, event);
    });
    exhibits.forEach((exhibit) => {
      this.fullItemIndex.set(exhibit.id, exhibit);
    });
    stalls.forEach((stall) => {
      this.fullItemIndex.set(stall.id, stall);
    });
    sponsors.forEach((sponsor) => {
      this.fullItemIndex.set(sponsor.id, sponsor);
    });

    this.store = {
      // Core data (loaded immediately)
      events: createDataState(eventData.map((d) => d.core)),
      exhibits: createDataState(exhibitData.map((d) => d.core)),
      stalls: createDataState(stallData.map((d) => d.core)),
      sponsors: createDataState(sponsorData.map((d) => d.core)),

      // Detailed data (loaded on-demand)
      eventDetails: {},
      exhibitDetails: {},
      stallDetails: {},
      sponsorDetails: {},

      // Map data
      mapData: createDataState<MapData | null>(null),

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
  async getEventDetails(id: string): Promise<ItemDetails> {
    const cacheKey = `event-${id}`;
    const cachedState = this.store.eventDetails[id]?.data;
    if (cachedState) {
      return cachedState;
    }

    this.store.eventDetails[id] = createLoadingState<ItemDetails>();

    // Simulate async loading (in real app, this would be an API call)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const details = this.detailsCache.get(cacheKey);
    const eventDetails: ItemDetails =
      details && "description" in details
        ? { description: details.description }
        : { description: "" };

    this.store.eventDetails[id] =
      createDataState<ItemDetails>(eventDetails);

    return eventDetails;
  }

  async getExhibitDetails(id: string): Promise<ItemDetails> {
    const cacheKey = `exhibit-${id}`;
    const cachedState = this.store.exhibitDetails[id]?.data;
    if (cachedState) {
      return cachedState;
    }

    this.store.exhibitDetails[id] = createLoadingState<ItemDetails>();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const details = this.detailsCache.get(cacheKey);
    const exhibitDetails: ItemDetails =
      details && "description" in details
        ? { description: details.description }
        : { description: "" };

    this.store.exhibitDetails[id] =
      createDataState<ItemDetails>(exhibitDetails);

    return exhibitDetails;
  }

  async getStallDetails(id: string): Promise<StallDetails> {
    const cacheKey = `stall-${id}`;
    const cachedState = this.store.stallDetails[id]?.data;
    if (cachedState) {
      const cachedDetails = cachedState as Partial<StallDetails>;
      return {
        description: cachedState.description,
        products: Array.isArray(cachedDetails.products)
          ? cachedDetails.products
          : [],
      };
    }

    this.store.stallDetails[id] = createLoadingState<ItemDetails>();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const details = this.detailsCache.get(cacheKey);
    const stallDetailsSource = details as Partial<StallDetails> | undefined;
    const products = Array.isArray(stallDetailsSource?.products)
      ? (stallDetailsSource.products as string[])
      : [];
    const stallDetails: StallDetails = {
      description: stallDetailsSource?.description ?? "",
      products,
    };

    this.store.stallDetails[id] =
      createDataState<ItemDetails>(stallDetails);

    return stallDetails;
  }

  async getSponsorDetails(id: string): Promise<SponsorDetails> {
    const cacheKey = `sponsor-${id}`;
    const cachedState = this.store.sponsorDetails[id]?.data;
    if (cachedState) {
      const cachedDetails = cachedState as Partial<SponsorDetails>;
      return {
        description: cachedState.description,
        website: cachedDetails.website,
        contactEmail: cachedDetails.contactEmail,
      };
    }

    this.store.sponsorDetails[id] = createLoadingState<ItemDetails>();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const details = this.detailsCache.get(cacheKey) as
      | Partial<SponsorDetails>
      | undefined;
    const sponsorDetails: SponsorDetails = {
      description: details?.description ?? "",
      website: details?.website,
      contactEmail: details?.contactEmail,
    };

    this.store.sponsorDetails[id] =
      createDataState<ItemDetails>(sponsorDetails);

    return sponsorDetails;
  }

  // Get map data
  getMapData(): MapData | null {
    return this.store.mapData.data;
  }

  // Search functionality
  searchItems(query: string): Item[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const allItems = this.getAllCoreItems();

    const matchedCores = allItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag: string) =>
          tag.toLowerCase().includes(normalizedQuery)
        ) ||
        item.location.toLowerCase().includes(normalizedQuery)
      );
    });

    return matchedCores
      .map((core) => this.fullItemIndex.get(core.id))
      .filter((item): item is Item => Boolean(item));
  }

  filterByTags(tags: string[]): ItemCore[] {
    if (tags.length === 0) return this.getAllCoreItems();

    const allItems = this.getAllCoreItems();
    return allItems.filter((item) =>
      tags.every((tag) => item.tags.includes(tag))
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
    this.store.bookmarks = this.store.bookmarks.filter(
      (bookmarkId: string) => bookmarkId !== id
    );
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
        ...this.store.searchHistory.filter((q: string) => q !== query),
      ].slice(0, 10); // Keep only last 10
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(this.store.searchHistory)
      );
    }
  }

  getSearchHistory(): string[] {
    return this.store.searchHistory;
  }

  // Preferences
  private loadPreferences() {
    const saved = localStorage.getItem("preferences");
    return saved
      ? JSON.parse(saved)
      : {
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

  getAllEvents(): Event[] {
    return events;
  }

  getAllExhibits(): Exhibit[] {
    return exhibits;
  }

  getAllStalls(): Stall[] {
    return stalls;
  }

  getAllSponsors(): Sponsor[] {
    return sponsors;
  }

  getAllTags(): string[] {
    const allItems = this.getAllCoreItems();
    const tagSet = new Set<string>();
    allItems.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }

  getTagCounts(): Record<string, number> {
    const allItems = this.getAllCoreItems();
    const counts: Record<string, number> = {};
    allItems.forEach((item) => {
      item.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }

  getPopularTags(limit: number): string[] {
    const counts = this.getTagCounts();
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  getFullItemsByIds(ids: string[]): Item[] {
    return ids
      .map((id) => this.fullItemIndex.get(id))
      .filter((item): item is Item => Boolean(item));
  }

  getItemsByIds(ids: string[]): ItemCore[] {
    const allItems = this.getAllCoreItems();
    return allItems.filter((item) => ids.includes(item.id));
  }
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;
