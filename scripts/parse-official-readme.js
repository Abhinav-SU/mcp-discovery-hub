import { Octokit } from '@octokit/rest';
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

// Parse GitHub URL from markdown link
function parseGitHubUrl(markdownLink) {
  // Match patterns like [Name](url) or **[Name](url)**
  const match = markdownLink.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (match) {
    const name = match[1];
    const url = match[2];
    
    // Only return if it's a GitHub URL
    if (url.includes('github.com')) {
      return { name, url };
    }
  }
  return null;
}

// Extract owner and repo from GitHub URL
function parseRepoFromUrl(url) {
  try {
    // Handle various GitHub URL formats
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      let owner = match[1];
      let repo = match[2].replace(/\.git$/, ''); // Remove .git if present
      
      // Clean up repo name (remove anchors, query params, tree paths)
      repo = repo.split(/[#?]/)[0];
      repo = repo.split('/tree/')[0];
      repo = repo.split('/blob/')[0];
      
      return { owner, repo };
    }
  } catch (error) {
    console.warn(`Failed to parse URL: ${url}`);
  }
  return null;
}

// Categorize server based on name/description
function categorizeServer(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  // Database & Data
  if (text.match(/database|postgres|mysql|sql|mongo|redis|sqlite|clickhouse|astra|pinot|doris|rds|analyticdb|snowflake|bigquery|databricks/)) return 'Database';
  
  // Development Tools
  if (text.match(/git|github|gitlab|code|repository|devops|deploy|ci\/cd|docker|kubernetes/)) return 'Development';
  
  // Communication
  if (text.match(/slack|discord|email|sms|whatsapp|telegram|zoom|teams|notion|confluence/)) return 'Communication';
  
  // Productivity
  if (text.match(/calendar|todo|task|drive|dropbox|notes|docs|sheets|productivity|office/)) return 'Productivity';
  
  // Web & Browser
  if (text.match(/browser|web|fetch|scrape|puppeteer|playwright|crawl|http/)) return 'Web';
  
  // AI & ML
  if (text.match(/ai|ml|llm|model|openai|anthropic|hugging|embedding|vector/)) return 'AI';
  
  // Finance & Payments
  if (text.match(/payment|finance|crypto|blockchain|bitcoin|trading|stock|bank|invoice/)) return 'Finance';
  
  // Cloud & Infrastructure
  if (text.match(/aws|azure|gcp|cloud|kubernetes|terraform|ansible|infrastructure/)) return 'Cloud';
  
  // Security
  if (text.match(/security|auth|oauth|sso|encryption|vault|secret/)) return 'Security';
  
  // Analytics & Monitoring
  if (text.match(/analytics|metrics|monitoring|observability|telemetry|sentry|datadog/)) return 'Analytics';
  
  // E-commerce
  if (text.match(/ecommerce|shop|store|product|cart|checkout|stripe|shopify/)) return 'E-commerce';
  
  // Media & Content
  if (text.match(/image|video|audio|media|youtube|spotify|podcast|streaming/)) return 'Media';
  
  // IoT & Hardware
  if (text.match(/iot|device|sensor|arduino|raspberry|hardware|home automation|smart home/)) return 'IoT';
  
  // Search
  if (text.match(/search|elastic|algolia|opensearch|brave search/)) return 'Search';
  
  return 'Utility';
}

// Fetch star count for a GitHub repo
async function fetchStarCount(owner, repo) {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      stars: data.stargazers_count,
      updatedAt: data.updated_at,
      description: data.description || ''
    };
  } catch (error) {
    console.warn(`  ⚠️  Failed to fetch ${owner}/${repo}: ${error.message}`);
    return { stars: 0, updatedAt: new Date().toISOString(), description: '' };
  }
}

// Parse the README file
async function parseReadme(readmePath) {
  console.log('📖 Reading official MCP README...\n');
  
  const content = await fs.readFile(readmePath, 'utf-8');
  const lines = content.split('\n');
  
  const servers = [];
  let currentSection = '';
  let isOfficialIntegration = false;
  let isCommunityServer = false;
  let isReferenceServer = false;
  let isArchived = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Track sections
    if (line.startsWith('## 🌟 Reference Servers')) {
      currentSection = 'Reference';
      isReferenceServer = true;
      isOfficialIntegration = false;
      isCommunityServer = false;
      isArchived = false;
      continue;
    } else if (line.startsWith('### Archived')) {
      currentSection = 'Archived';
      isArchived = true;
      isReferenceServer = false;
      continue;
    } else if (line.startsWith('### 🎖️ Official Integrations')) {
      currentSection = 'Official Integrations';
      isOfficialIntegration = true;
      isCommunityServer = false;
      isReferenceServer = false;
      isArchived = false;
      continue;
    } else if (line.startsWith('### 🌍 Community Servers')) {
      currentSection = 'Community';
      isCommunityServer = true;
      isOfficialIntegration = false;
      isReferenceServer = false;
      isArchived = false;
      continue;
    }
    
    // Parse server entries (lines starting with "- ")
    if (line.startsWith('- ')) {
      const parsed = parseGitHubUrl(line);
      if (parsed) {
        const { name, url } = parsed;
        
        // Extract description (everything after the link until end of line)
        const descMatch = line.match(/\)\s*[-–]\s*(.+)$/);
        const description = descMatch ? descMatch[1].trim() : '';
        
        servers.push({
          name: name.trim(),
          githubUrl: url,
          description: description,
          section: currentSection,
          isVerified: isReferenceServer || isOfficialIntegration,
          isFeatured: isReferenceServer,
          isArchived: isArchived,
          isCommunity: isCommunityServer
        });
      }
    }
  }
  
  console.log(`✅ Parsed ${servers.length} servers from README\n`);
  console.log(`   Reference: ${servers.filter(s => s.isFeatured).length}`);
  console.log(`   Official Integrations: ${servers.filter(s => s.isVerified && !s.isFeatured).length}`);
  console.log(`   Community: ${servers.filter(s => s.isCommunity).length}`);
  console.log(`   Archived: ${servers.filter(s => s.isArchived).length}\n`);
  
  return servers;
}

// Get relative date
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
  console.log('🚀 Starting comprehensive MCP server scraping...\n');
  
  if (!GITHUB_TOKEN) {
    console.log('⚠️  No GITHUB_TOKEN found. Rate limits will be lower (60 requests/hour)');
    console.log('   Set GITHUB_TOKEN env var for 5000 requests/hour');
    console.log('   This script will take a while without a token!\n');
  }
  
  try {
    // Check if README file exists
    const readmePath = path.join(__dirname, '../downloads/README.md');
    try {
      await fs.access(readmePath);
    } catch {
      console.error('❌ README.md not found at:', readmePath);
      console.log('\n📥 Please download the README from:');
      console.log('   https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md');
      console.log(`   And save it to: ${readmePath}\n`);
      process.exit(1);
    }
    
    // Parse README
    const parsedServers = await parseReadme(readmePath);
    
    // Filter out archived servers for now (can be included later)
    const activeServers = parsedServers.filter(s => !s.isArchived);
    console.log(`\n🔍 Processing ${activeServers.length} active servers (excluding archived)...\n`);
    
    const enrichedServers = [];
    let processed = 0;
    const batchSize = 50; // Process in batches to show progress
    
    for (const server of activeServers) {
      const repo = parseRepoFromUrl(server.githubUrl);
      
      if (!repo) {
        console.log(`  ⚠️  Skipping (invalid URL): ${server.name}`);
        continue;
      }
      
      // Fetch GitHub data
      const ghData = await fetchStarCount(repo.owner, repo.repo);
      await sleep(GITHUB_TOKEN ? 100 : 1000); // Rate limit
      
      // Use GitHub description if README description is empty
      const finalDescription = server.description || ghData.description || `${server.name} MCP server`;
      
      // Create server object
      const serverData = {
        id: server.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: server.name,
        slug: server.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: finalDescription.substring(0, 150),
        longDescription: finalDescription.substring(0, 300),
        category: categorizeServer(server.name, finalDescription),
        githubUrl: server.githubUrl,
        npmPackage: undefined, // Could be enhanced by checking package.json
        author: repo.owner,
        repoStars: ghData.stars,
        rating: server.isVerified ? (4.5 + Math.random() * 0.5) : (3.5 + Math.random() * 1.0),
        lastUpdated: getRelativeDate(ghData.updatedAt),
        isVerified: server.isVerified,
        isFeatured: server.isFeatured,
        tags: [
          server.isFeatured ? 'reference' : (server.isVerified ? 'official' : 'community'),
          categorizeServer(server.name, finalDescription).toLowerCase(),
          server.name.toLowerCase()
        ].filter(Boolean)
      };
      
      enrichedServers.push(serverData);
      processed++;
      
      // Show progress
      if (processed % batchSize === 0) {
        console.log(`   Processed ${processed}/${activeServers.length} servers...`);
      }
    }
    
    console.log(`\n✅ Successfully processed ${enrichedServers.length} servers\n`);
    
    // Sort by stars (featured first, then by stars)
    enrichedServers.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      return b.repoStars - a.repoStars;
    });
    
    // Save to JSON
    const outputPath = path.join(__dirname, '../src/data/mcps-comprehensive.json');
    await fs.writeFile(outputPath, JSON.stringify(enrichedServers, null, 2));
    
    console.log(`💾 Data saved to: ${outputPath}`);
    
    // Print statistics
    console.log('\n📊 Statistics:');
    console.log(`   Total servers: ${enrichedServers.length}`);
    console.log(`   Reference servers: ${enrichedServers.filter(s => s.isFeatured).length}`);
    console.log(`   Official integrations: ${enrichedServers.filter(s => s.isVerified && !s.isFeatured).length}`);
    console.log(`   Community servers: ${enrichedServers.filter(s => !s.isVerified).length}`);
    
    // Category breakdown
    const categories = {};
    enrichedServers.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    console.log('\n   Categories:', categories);
    
    // Top 10 by stars
    console.log('\n⭐ Top 10 by stars:');
    enrichedServers.slice(0, 10).forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} (${s.repoStars.toLocaleString()} ⭐)`);
    });
    
    console.log('\n🎉 Comprehensive scraping complete!');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();

