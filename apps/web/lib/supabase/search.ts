/**
 * PostgREST `.or()` filter matching a search term against the product name
 * or the admin-entered search_keywords (e.g. "шилэн наалт" → Screen Protector).
 */
export function productSearchFilter(term: string): string | null {
  // Characters that break PostgREST's or=(...) syntax or act as ilike wildcards
  const safe = term.replace(/[,()%_*\\"]/g, " ").replace(/\s+/g, " ").trim();
  if (!safe) return null;
  return `name.ilike.%${safe}%,search_keywords.ilike.%${safe}%`;
}
