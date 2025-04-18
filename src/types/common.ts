// Define the available themes
export type Theme = 'light' | 'dark';

// Define the available languages
export type Language = 'en' | 'ja';

// Define the search result type
export interface SearchResult {
  id: string;
  type: 'event' | 'exhibition' | 'foodStall';
  title: string;
  description: string;
  image: string;
  tags?: string[];
  date?: string;
  location?: string;
}

// Define search filters
export interface SearchFilters {
  types: Array<'event' | 'exhibition' | 'foodStall'>;
  tags: string[];
  dateRange: { start?: string; end?: string } | null;
}