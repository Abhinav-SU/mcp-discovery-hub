import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these values from your Supabase project settings:
// https://app.supabase.com/project/YOUR_PROJECT/settings/api

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using local data.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      mcp_servers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          category: string;
          github_url: string;
          npm_package: string | null;
          author: string;
          repo_stars: number | null;
          rating: number | null;
          last_updated: string;
          is_verified: boolean;
          is_featured: boolean;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          long_description?: string | null;
          category: string;
          github_url: string;
          npm_package?: string | null;
          author: string;
          repo_stars?: number | null;
          rating?: number | null;
          last_updated: string;
          is_verified?: boolean;
          is_featured?: boolean;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          category?: string;
          github_url?: string;
          npm_package?: string | null;
          author?: string;
          repo_stars?: number | null;
          rating?: number | null;
          last_updated?: string;
          is_verified?: boolean;
          is_featured?: boolean;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mcp_submissions: {
        Row: {
          id: string;
          name: string;
          github_url: string;
          category: string;
          description: string | null;
          email: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          github_url: string;
          category: string;
          description?: string | null;
          email?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          github_url?: string;
          category?: string;
          description?: string | null;
          email?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

