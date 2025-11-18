import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import comprehensiveServers from '@/data/mcps-comprehensive.json';
import { MCPServer } from '@/components/MCPServerCard';

// Use comprehensive scraped servers as fallback (300 top servers from official README)
const fallbackServers = comprehensiveServers as MCPServer[];

export function useMCPServers() {
  const [servers, setServers] = useState<MCPServer[]>(fallbackServers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  async function fetchServers() {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using local data');
        setUsingFallback(true);
        setServers(fallbackServers);
        setLoading(false);
        return;
      }

      // Fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('mcp_servers')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('repo_stars', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match our MCPServer interface
        const transformedServers: MCPServer[] = data.map((server: any) => ({
          id: server.id,
          name: server.name,
          slug: server.slug,
          description: server.description,
          longDescription: server.long_description,
          category: server.category,
          githubUrl: server.github_url,
          npmPackage: server.npm_package,
          author: server.author,
          repoStars: server.repo_stars,
          rating: server.rating,
          lastUpdated: server.last_updated,
          isVerified: server.is_verified,
          isFeatured: server.is_featured,
          tags: server.tags,
        }));

        setServers(transformedServers);
        setUsingFallback(false);
        console.log(`✅ Loaded ${transformedServers.length} servers from Supabase`);
      } else {
        // No data in Supabase, use fallback
        console.log('No data in Supabase, using local data');
        setUsingFallback(true);
        setServers(fallbackServers);
      }
    } catch (err) {
      console.error('Error fetching servers from Supabase:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch servers');
      setUsingFallback(true);
      setServers(fallbackServers);
    } finally {
      setLoading(false);
    }
  }

  return {
    servers,
    loading,
    error,
    usingFallback,
    refetch: fetchServers,
  };
}

