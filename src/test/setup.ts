import "@testing-library/jest-dom";

import { vi } from "vitest";

// Mock matchMedia
Object.defineProperty(globalThis, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(), // deprecated
  })),
  writable: true,
});

// Mock globalThis.matchMedia
Object.defineProperty(globalThis, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(), // deprecated
  })),
  writable: true,
});
