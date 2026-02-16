export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function normalizeForSimilarity(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\b(the|a|an|and|or|to|of|for|in|on|at|with|من|في|على|و|أو)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(normalizeForSimilarity(a).split(' ').filter(Boolean));
  const setB = new Set(normalizeForSimilarity(b).split(' ').filter(Boolean));
  if (!setA.size || !setB.size) return 0;
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}
