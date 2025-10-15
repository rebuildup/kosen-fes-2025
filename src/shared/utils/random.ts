export function getRandomInt(maxExclusive: number, seed?: number): number {
  const randomSource = typeof seed === "number" ? makeLcg(seed) : Math.random;
  const r = typeof randomSource === "function" ? randomSource() : randomSource;
  return Math.floor(r * Math.max(0, Math.floor(maxExclusive)));
}

function makeLcg(seed: number) {
  let state = seed >>> 0;
  return () => {
    // Linear congruential generator (Numerical Recipes parameters)
    state = (1_664_525 * state + 1_013_904_223) >>> 0;
    return (state & 268_435_455) / 268_435_456; // 2^28 - 1 and 2^28
  };
}

export function pickRandom<T>(items: T[], seed?: number): T | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  const index = getRandomInt(items.length, seed);
  return items[index];
}
