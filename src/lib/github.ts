import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

interface StarCountCache {
  [url: string]: {
    count: number;
    timestamp: number;
  };
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_KEY = 'github_star_cache';

/**
 * Get cached star counts from localStorage
 */
function getCache(): StarCountCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/**
 * Save star counts to localStorage cache
 */
function setCache(cache: StarCountCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to cache GitHub stars:', error);
  }
}

/**
 * Extract owner and repo from GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch {
    // Invalid URL
  }
  return null;
}

/**
 * Fetch live star count from GitHub API
 * @param repoUrl - Full GitHub repository URL
 * @param fallbackCount - Fallback value if API call fails
 * @returns Promise resolving to star count
 */
export async function fetchGitHubStars(
  repoUrl: string,
  fallbackCount: number = 0
): Promise<number> {
  // Check cache first
  const cache = getCache();
  const cached = cache[repoUrl];
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.count;
  }

  // Parse GitHub URL
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return fallbackCount;
  }

  try {
    const { data } = await octokit.repos.get({
      owner: parsed.owner,
      repo: parsed.repo
    });

    const starCount = data.stargazers_count;

    // Update cache
    cache[repoUrl] = {
      count: starCount,
      timestamp: now
    };
    setCache(cache);

    return starCount;
  } catch (error) {
    console.warn(`Failed to fetch stars for ${repoUrl}:`, error);
    
    // Return cached value if available, otherwise fallback
    return cached ? cached.count : fallbackCount;
  }
}

/**
 * Batch fetch star counts for multiple repositories
 * Includes rate limiting to avoid hitting GitHub API limits
 * @param repos - Array of { url: string, fallback: number }
 * @param delayMs - Delay between requests in milliseconds
 * @returns Promise resolving to Map of URL -> star count
 */
export async function fetchMultipleGitHubStars(
  repos: Array<{ url: string; fallback: number }>,
  delayMs: number = 1000
): Promise<Map<string, number>> {
  const results = new Map<string, number>();

  for (let i = 0; i < repos.length; i++) {
    const { url, fallback } = repos[i];
    const stars = await fetchGitHubStars(url, fallback);
    results.set(url, stars);

    // Add delay between requests (except for last one)
    if (i < repos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Clear the GitHub star cache
 */
export function clearStarCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear GitHub star cache:', error);
  }
}
