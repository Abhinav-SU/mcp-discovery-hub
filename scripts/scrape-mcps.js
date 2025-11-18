import { Octokit } from '@octokit/rest';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub token from environment (optional, but recommended for higher rate limits)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Sleep utility for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch official Anthropic servers from the monorepo
async function fetchOfficialServers() {
  console.log('🔍 Fetching official Anthropic MCP servers...');
  
  try {
    // Get the monorepo
    const { data: repo } = await octokit.repos.get({
      owner: 'modelcontextprotocol',
      repo: 'servers'
    });
    
    const repoStars = repo.stargazers_count;
    console.log(`   Repository has ${repoStars} stars`);
    
    // Get the contents of the src directory
    const { data: contents } = await octokit.repos.getContent({
      owner: 'modelcontextprotocol',
      repo: 'servers',
      path: 'src'
    });
    
    const servers = [];
    
    // Filter for directories (each is a server)
    const serverDirs = contents.filter(item => item.type === 'dir');
    
    for (const dir of serverDirs) {
      console.log(`   Found server: ${dir.name}`);
      
      // Try to get README for description
      let description = '';
      let longDescription = '';
      
      try {
        const { data: readmeData } = await octokit.repos.getContent({
          owner: 'modelcontextprotocol',
          repo: 'servers',
          path: `${dir.path}/README.md`
        });
        
        const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        
        // Extract first paragraph as description
        const lines = readmeContent.split('\n').filter(line => line.trim());
        const descLines = lines.filter(line => 
          !line.startsWith('#') && 
          !line.startsWith('```') && 
          line.length > 20
        );
        
        description = descLines[0] || `${dir.name} MCP server`;
        longDescription = descLines.slice(0, 3).join(' ').substring(0, 300);
        
      } catch (error) {
        description = `${dir.name} MCP server from Anthropic`;
        longDescription = description;
      }
      
      // Categorize based on server name
      const category = categorizeServer(dir.name);
      
      servers.push({
        id: dir.name.toLowerCase(),
        name: dir.name.charAt(0).toUpperCase() + dir.name.slice(1),
        slug: dir.name.toLowerCase(),
        description: description.substring(0, 150),
        longDescription: longDescription,
        category: category,
        githubUrl: `https://github.com/modelcontextprotocol/servers/tree/main/${dir.path}`,
        npmPackage: `@modelcontextprotocol/server-${dir.name}`,
        author: 'Anthropic',
        repoStars: repoStars,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0 for official servers
        lastUpdated: getRelativeDate(repo.updated_at),
        isVerified: true,
        isFeatured: ['filesystem', 'github', 'slack', 'google-drive', 'postgres'].includes(dir.name),
        tags: ['official', category.toLowerCase(), dir.name]
      });
      
      // Rate limiting
      await sleep(500);
    }
    
    console.log(`✅ Found ${servers.length} official servers\n`);
    return servers;
    
  } catch (error) {
    console.error('❌ Error fetching official servers:', error.message);
    return [];
  }
}

// Search for community MCP servers
async function fetchCommunityServers() {
  console.log('🔍 Searching for community MCP servers...');
  
  const communityServers = [];
  const queries = [
    'mcp server',
    'model context protocol',
    'mcp-server'
  ];
  
  for (const query of queries) {
    try {
      console.log(`   Searching for: "${query}"`);
      
      const { data } = await octokit.search.repos({
        q: `${query} in:name,description stars:>10`,
        sort: 'stars',
        order: 'desc',
        per_page: 30
      });
      
      for (const repo of data.items) {
        // Skip the official monorepo
        if (repo.full_name === 'modelcontextprotocol/servers') {
          continue;
        }
        
        // Skip if already added
        if (communityServers.find(s => s.githubUrl === repo.html_url)) {
          continue;
        }
        
        // Only include repos that are clearly MCP servers
        const isMCPServer = 
          repo.name.toLowerCase().includes('mcp') ||
          repo.description?.toLowerCase().includes('mcp') ||
          repo.description?.toLowerCase().includes('model context protocol');
        
        if (!isMCPServer) {
          continue;
        }
        
        console.log(`   Found: ${repo.full_name} (${repo.stargazers_count} stars)`);
        
        const serverName = repo.name
          .replace(/[-_]/g, ' ')
          .replace(/mcp/gi, '')
          .replace(/server/gi, '')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || repo.name;
        
        communityServers.push({
          id: repo.name.toLowerCase(),
          name: serverName,
          slug: repo.name.toLowerCase(),
          description: repo.description || `${serverName} MCP server`,
          longDescription: repo.description || `${serverName} - A community-built Model Context Protocol server`,
          category: categorizeServer(repo.name),
          githubUrl: repo.html_url,
          npmPackage: repo.homepage?.includes('npmjs.com') ? repo.homepage : undefined,
          author: repo.owner.login,
          repoStars: repo.stargazers_count,
          rating: Math.min(5, 3.5 + (Math.log10(repo.stargazers_count) / 2)),
          lastUpdated: getRelativeDate(repo.updated_at),
          isVerified: false,
          isFeatured: false,
          tags: ['community', categorizeServer(repo.name).toLowerCase(), repo.language?.toLowerCase()].filter(Boolean)
        });
        
        // Rate limiting
        await sleep(1000);
      }
      
      // Rate limiting between queries
      await sleep(2000);
      
    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error.message);
    }
  }
  
  // Sort by stars and take top 30
  communityServers.sort((a, b) => b.repoStars - a.repoStars);
  const topCommunity = communityServers.slice(0, 30);
  
  console.log(`✅ Found ${topCommunity.length} community servers\n`);
  return topCommunity;
}

// Categorize server based on name/description
function categorizeServer(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('file') || nameLower.includes('storage')) return 'Development';
  if (nameLower.includes('github') || nameLower.includes('git')) return 'Development';
  if (nameLower.includes('slack') || nameLower.includes('discord')) return 'Communication';
  if (nameLower.includes('drive') || nameLower.includes('google')) return 'Productivity';
  if (nameLower.includes('postgres') || nameLower.includes('database') || nameLower.includes('db')) return 'Database';
  if (nameLower.includes('notion') || nameLower.includes('obsidian')) return 'Productivity';
  if (nameLower.includes('fetch') || nameLower.includes('web') || nameLower.includes('browser')) return 'Web';
  if (nameLower.includes('ai') || nameLower.includes('llm')) return 'AI';
  if (nameLower.includes('test') || nameLower.includes('mock')) return 'Development';
  if (nameLower.includes('time') || nameLower.includes('calendar')) return 'Productivity';
  
  return 'Utility';
}

// Convert ISO date to relative time
function getRelativeDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Main function
async function main() {
  console.log('🚀 Starting MCP server scraping...\n');
  
  if (!GITHUB_TOKEN) {
    console.log('⚠️  No GITHUB_TOKEN found. Rate limits will be lower (60 requests/hour)');
    console.log('   Set GITHUB_TOKEN env var for 5000 requests/hour\n');
  }
  
  try {
    // Fetch both official and community servers
    const [officialServers, communityServers] = await Promise.all([
      fetchOfficialServers(),
      fetchCommunityServers()
    ]);
    
    // Combine all servers
    const allServers = [...officialServers, ...communityServers];
    
    console.log(`\n📊 Total servers found: ${allServers.length}`);
    console.log(`   Official: ${officialServers.length}`);
    console.log(`   Community: ${communityServers.length}\n`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/data/mcps.json');
    await fs.writeFile(outputPath, JSON.stringify(allServers, null, 2));
    
    console.log(`✅ Data saved to: ${outputPath}`);
    
    // Print summary statistics
    console.log('\n📈 Summary:');
    console.log(`   Total GitHub stars (unique repos): ${[...new Set(allServers.map(s => s.githubUrl))].reduce((acc, url) => {
      const server = allServers.find(s => s.githubUrl === url);
      return acc + (server?.repoStars || 0);
    }, 0).toLocaleString()}`);
    
    const categories = {};
    allServers.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    console.log('   Categories:', categories);
    
    console.log('\n🎉 Scraping complete!');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();

