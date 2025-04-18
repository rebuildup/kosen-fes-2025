export interface Location {
  id: string;
  name: string;
  description?: string;
  x: number; // X coordinate on the map (0-1000)
  y: number; // Y coordinate on the map (0-750)
}
