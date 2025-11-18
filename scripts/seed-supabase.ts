import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Import your local data
import { mcpServers } from '../src/data/mcpServers';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // Transform data to match database schema
    const serversToInsert = mcpServers.map(server => ({
      id: server.id,
      name: server.name,
      slug: server.slug,
      description: server.description,
      long_description: server.longDescription || server.description,
      category: server.category,
      github_url: server.githubUrl,
      npm_package: server.npmPackage || null,
      author: server.author,
      repo_stars: server.repoStars || null,
      rating: server.rating || null,
      last_updated: server.lastUpdated,
      is_verified: server.isVerified || false,
      is_featured: server.isFeatured || false,
      tags: server.tags || null,
    }));

    console.log(`📊 Preparing to insert ${serversToInsert.length} servers...\n`);

    // Insert servers (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('mcp_servers')
      .upsert(serversToInsert, {
        onConflict: 'slug',
        ignoreDuplicates: false
      });

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully seeded ${serversToInsert.length} servers!`);
    console.log('\n📋 Summary:');
    console.log(`   - Total servers: ${serversToInsert.length}`);
    console.log(`   - Official servers: ${serversToInsert.filter(s => s.is_verified).length}`);
    console.log(`   - Featured servers: ${serversToInsert.filter(s => s.is_featured).length}`);
    console.log(`   - Categories: ${new Set(serversToInsert.map(s => s.category)).size}`);
    
    // Verify the data
    const { count, error: countError } = await supabase
      .from('mcp_servers')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n✅ Verified: ${count} servers in database`);
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

