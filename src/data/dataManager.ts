import type { Event, Exhibit, Item, Sponsor, Stall } from "../types/common";
import type {
  DataState,
  DataStore,
  EventCore,
  ExhibitCore,
  ItemCore,
  ItemDetails,
  MapData,
  SponsorCore,
  StallCore,
} from "../types/data";
import { events } from "./events";
import { exhibits } from "./exhibits";
import { sponsors } from "./sponsors";
import { stalls } from "./stalls";

type StallDetails = ItemDetails & { products: string[] };
type SponsorDetails = ItemDetails & { website?: string; contactEmail?: string };
type CachedDetails = ItemDetails | StallDetails | SponsorDetails;

// Helper to create data state
const createDataState = <T>(data: T): DataState<T> => ({
  data,
  error: null,
  lastUpdated: Date.now(),
  loading: false,
});

// Helper to create loading state
const createLoadingState = <T>(): DataState<T> => ({
  data: null,
  error: null,
  lastUpdated: Date.now(),
  loading: true,
});

// Helper to split data into core and details
const splitEventData = (
  event: Event,
): {
  core: EventCore;
  details: ItemDetails;
} => ({
  core: {
    date: event.date,
    dayAvailability: event.dayAvailability,
    duration: event.duration,
    id: event.id,
    imageUrl: event.imageUrl,
    location: event.location,
    organizer: event.organizer,
    showOnMap: event.showOnMap,
    showOnSchedule: event.showOnSchedule,
    tags: event.tags,
    time: event.time,
    title: event.title,
    type: event.type,
  },
  details: {
    description: event.description,
  },
});

const splitExhibitData = (
  exhibit: Exhibit,
): { core: ExhibitCore; details: ItemDetails } => ({
  core: {
    creator: exhibit.creator,
    date: exhibit.date,
    id: exhibit.id,
    imageUrl: exhibit.imageUrl,
    location: exhibit.location,
    tags: exhibit.tags,
    time: exhibit.time,
    title: exhibit.title,
    type: exhibit.type,
  },
  details: {
    description: exhibit.description,
  },
});

const splitStallData = (
  stall: Stall,
): { core: StallCore; details: StallDetails } => ({
  core: {
    date: stall.date,
    id: stall.id,
    imageUrl: stall.imageUrl,
    location: stall.location,
    tags: stall.tags,
    time: stall.time,
    title: stall.title,
    type: stall.type,
  },
  details: {
    description: stall.description,
    products: stall.products || [],
  },
});

const splitSponsorData = (
  sponsor: Sponsor,
): { core: SponsorCore; details: SponsorDetails } => ({
  core: {
    date: sponsor.date,
    id: sponsor.id,
    imageUrl: sponsor.imageUrl,
    location: sponsor.location,
    tags: sponsor.tags,
    time: sponsor.time,
    title: sponsor.title,
    type: sponsor.type,
  },
  details: {
    contactEmail: sponsor.contactEmail,
    description: sponsor.description,
    website: sponsor.website,
  },
});

class DataManager {
  private store: DataStore;
  private detailsCache = new Map<string, CachedDetails>();
  private fullItemIndex = new Map<string, Item>();

  constructor() {
    // Initialize core data immediately
    const eventData = events.map((e) => splitEventData(e));
    const exhibitData = exhibits.map((e) => splitExhibitData(e));
    const stallData = stalls.map((s) => splitStallData(s));
    const sponsorData = sponsors.map((s) => splitSponsorData(s));

    // Store details for later use
    for (const [index, { details }] of eventData.entries()) {
      this.detailsCache.set(`event-${events[index].id}`, details);
    }
    for (const [index, { details }] of exhibitData.entries()) {
      this.detailsCache.set(`exhibit-${exhibits[index].id}`, details);
    }
    for (const [index, { details }] of stallData.entries()) {
      this.detailsCache.set(`stall-${stalls[index].id}`, details);
    }
    for (const [index, { details }] of sponsorData.entries()) {
      this.detailsCache.set(`sponsor-${sponsors[index].id}`, details);
    }
    for (const event of events) {
      this.fullItemIndex.set(event.id, event);
    }
    for (const exhibit of exhibits) {
      this.fullItemIndex.set(exhibit.id, exhibit);
    }
    for (const stall of stalls) {
      this.fullItemIndex.set(stall.id, stall);
    }
    for (const sponsor of sponsors) {
      this.fullItemIndex.set(sponsor.id, sponsor);
    }

    this.store = {
      // User data (loaded from localStorage)
      bookmarks: this.loadBookmarks(),
      // Detailed data (loaded on-demand)
      eventDetails: {},
      // Core data (loaded immediately)
      events: createDataState(eventData.map((d) => d.core)),
      exhibitDetails: {},

      exhibits: createDataState(exhibitData.map((d) => d.core)),
      // Map data
      mapData: createDataState<MapData | null>(null),
      preferences: this.loadPreferences(),
      searchHistory: this.loadSearchHistory(),

      sponsorDetails: {},

      sponsors: createDataState(sponsorData.map((d) => d.core)),
      stallDetails: {},
      stalls: createDataState(stallData.map((d) => d.core)),
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

    this.store.eventDetails[id] = createDataState<ItemDetails>(eventDetails);

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

    this.store.stallDetails[id] = createDataState<ItemDetails>(stallDetails);

    return stallDetails;
  }

  async getSponsorDetails(id: string): Promise<SponsorDetails> {
    const cacheKey = `sponsor-${id}`;
    const cachedState = this.store.sponsorDetails[id]?.data;
    if (cachedState) {
      const cachedDetails = cachedState as Partial<SponsorDetails>;
      return {
        contactEmail: cachedDetails.contactEmail,
        description: cachedState.description,
        website: cachedDetails.website,
      };
    }

    this.store.sponsorDetails[id] = createLoadingState<ItemDetails>();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const details = this.detailsCache.get(cacheKey) as
      | Partial<SponsorDetails>
      | undefined;
    const sponsorDetails: SponsorDetails = {
      contactEmail: details?.contactEmail,
      description: details?.description ?? "",
      website: details?.website,
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
          tag.toLowerCase().includes(normalizedQuery),
        ) ||
        item.location.toLowerCase().includes(normalizedQuery)
      );
    });

    const full = matchedCores
      .map((core) => this.fullItemIndex.get(core.id))
      .filter((item): item is Item => item !== undefined);
    return full;
  }

  filterByTags(tags: string[]): ItemCore[] {
    if (tags.length === 0) return this.getAllCoreItems();

    const allItems = this.getAllCoreItems();
    return allItems.filter((item) =>
      tags.every((tag) => item.tags.includes(tag)),
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
      (bookmarkId: string) => bookmarkId !== id,
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
        JSON.stringify(this.store.searchHistory),
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
    for (const item of allItems) {
      for (const tag of item.tags) tagSet.add(tag);
    }
    return [...tagSet];
  }

  getTagCounts(): Record<string, number> {
    const allItems = this.getAllCoreItems();
    const counts: Record<string, number> = {};
    for (const item of allItems) {
      for (const tag of item.tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return counts;
  }

  getPopularTags(limit: number): string[] {
    const counts = this.getTagCounts();
    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  getFullItemsByIds(ids: string[]): Item[] {
    const items = ids
      .map((id) => this.fullItemIndex.get(id))
      .filter((item): item is Item => item !== undefined);
    return items;
  }

  getItemsByIds(ids: string[]): ItemCore[] {
    const allItems = this.getAllCoreItems();
    return allItems.filter((item) => ids.includes(item.id));
  }
}

// Singleton instance
export const dataManager = new DataManager();
export default dataManager;
