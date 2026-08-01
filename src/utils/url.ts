/**
 * Dynamic URL & Pattern Matching Helper Functions
 */

export function extractHostname(url: string): string {
  try {
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return 'Browser Internal';
    }
    const parsed = new URL(url);
    return parsed.hostname || 'Unknown Host';
  } catch {
    return 'Invalid URL';
  }
}

export function truncateUrl(url: string, maxLength = 45): string {
  if (!url) return 'N/A';
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

/**
 * Converts a wildcard match pattern (e.g. "http://localhost:5173/*" or "https://*.bgn.go.id/*")
 * to a regular expression and tests if the target URL matches.
 */
export function matchWildcardPattern(pattern: string, url: string): boolean {
  if (!pattern || !url) return false;
  if (pattern === '<all_urls>' || pattern === '*://*/*') return true;

  try {
    // Escape regex characters except '*'
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${escaped}$`, 'i');
    return regex.test(url);
  } catch {
    return false;
  }
}
