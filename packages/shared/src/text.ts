/** Lowercased, trimmed key so "Catering" and "catering" group together. */
export function toCategoryKey(category: string): string {
  return category.trim().replace(/\s+/g, ' ').toLowerCase();
}
