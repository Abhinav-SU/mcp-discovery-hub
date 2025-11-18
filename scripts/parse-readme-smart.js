import { Octokit } from '@octokit/rest';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse GitHub URL from markdown
function parseGitHubUrl(markdownLink) {
  const match = markdownLink.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (match) {
    const name = match[1];
    const url = match[2];
    if (url.includes('github.com')) {
      return { name, url };
    }
  }
  return null;
}

// Extract owner and repo from GitHub URL
function parseRepoFromUrl(url) {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      let owner = match[1];
      let repo = match[2].replace(/\.git$/, '');
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

// Categorize server
function categorizeServer(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  if (text.match(/database|postgres|mysql|sql|mongo|redis|sqlite|clickhouse|astra|pinot|doris|rds|analyticdb|snowflake|bigquery|databricks/)) return 'Database';
  if (text.match(/git|github|gitlab|code|repository|devops|deploy|ci\/cd|docker|kubernetes/)) return 'Development';
  if (text.match(/slack|discord|email|sms|whatsapp|telegram|zoom|teams|notion|confluence/)) return 'Communication';
  if (text.match(/calendar|todo|task|drive|dropbox|notes|docs|sheets|productivity|office/)) return 'Productivity';
  if (text.match(/browser|web|fetch|scrape|puppeteer|playwright|crawl|http/)) return 'Web';
  if (text.match(/ai|ml|llm|model|openai|anthropic|hugging|embedding|vector/)) return 'AI';
  if (text.match(/payment|finance|crypto|blockchain|bitcoin|trading|stock|bank|invoice/)) return 'Finance';
  if (text.match(/aws|azure|gcp|cloud|kubernetes|terraform|ansible|infrastructure/)) return 'Cloud';
  if (text.match(/security|auth|oauth|sso|encryption|vault|secret/)) return 'Security';
  if (text.match(/analytics|metrics|monitoring|observability|telemetry|sentry|datadog/)) return 'Analytics';
  if (text.match(/ecommerce|shop|store|product|cart|checkout|stripe|shopify/)) return 'E-commerce';
  if (text.match(/image|video|audio|media|youtube|spotify|podcast|streaming/)) return 'Media';
  if (text.match(/iot|device|sensor|arduino|raspberry|hardware|home automation|smart home/)) return 'IoT';
  if (text.match(/search|elastic|algolia|opensearch|brave search/)) return 'Search';
  
  return 'Utility';
}

// Parse README file (WITHOUT fetching GitHub data)
async function parseReadme(readmePath) {
  console.log('📖 Parsing official MCP README...\n');
  
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
    
    // Parse server entries
    if (line.startsWith('- ')) {
      const parsed = parseGitHubUrl(line);
      if (parsed) {
        const { name, url } = parsed;
        const descMatch = line.match(/\)\s*[-–]\s*(.+)$/);
        const description = descMatch ? descMatch[1].trim() : '';
        
        const repo = parseRepoFromUrl(url);
        if (repo) {
          servers.push({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name.trim(),
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: description.substring(0, 150) || `${name} MCP server`,
            longDescription: description.substring(0, 300) || `${name} MCP server`,
            category: categorizeServer(name, description),
            githubUrl: url,
            author: repo.owner,
            repoStars: 0, // Will be filled in later
            rating: isReferenceServer || isOfficialIntegration ? 4.5 : 4.0,
            lastUpdated: '1 week ago',
            isVerified: isReferenceServer || isOfficialIntegration,
            isFeatured: isReferenceServer,
            isArchived: isArchived,
            isCommunity: isCommunityServer,
            section: currentSection,
            tags: [
              isReferenceServer ? 'reference' : (isOfficialIntegration ? 'official' : 'community'),
              categorizeServer(name, description).toLowerCase(),
              name.toLowerCase()
            ].filter(Boolean)
          });
        }
      }
    }
  }
  
  return servers;
}

// Fetch stars for a batch of servers
async function fetchStarsForServers(servers, maxServers = 100) {
  console.log(`\n⭐ Fetching GitHub stars for top ${maxServers} servers...\n`);
  
  let processed = 0;
  const limit = Math.min(maxServers, servers.length);
  
  for (let i = 0; i < limit; i++) {
    const server = servers[i];
    const repo = parseRepoFromUrl(server.githubUrl);
    
    if (!repo) continue;
    
    try {
      const { data } = await octokit.repos.get({
        owner: repo.owner,
        repo: repo.repo
      });
      
      server.repoStars = data.stargazers_count;
      server.lastUpdated = getRelativeDate(data.updated_at);
      
      // Update description if empty
      if (!server.description || server.description === `${server.name} MCP server`) {
        server.description = data.description?.substring(0, 150) || server.description;
        server.longDescription = data.description?.substring(0, 300) || server.longDescription;
      }
      
      processed++;
      if (processed % 10 === 0) {
        console.log(`   Fetched ${processed}/${limit}...`);
      }
      
      // Rate limiting
      await sleep(GITHUB_TOKEN ? 100 : 1200);
      
    } catch (error) {
      if (error.status === 403) {
        console.log(`\n⚠️  Hit rate limit after ${processed} requests`);
        console.log('   Continuing with remaining servers at 0 stars...\n');
        break;
      }
      console.warn(`  ⚠️  Failed to fetch ${repo.owner}/${repo.repo}`);
    }
  }
  
  console.log(`\n✅ Successfully fetched stars for ${processed} servers\n`);
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
  console.log('🚀 Smart MCP Server Parsing (Phased Approach)\n');
  
  if (!GITHUB_TOKEN) {
    console.log('⚠️  No GITHUB_TOKEN found - will fetch limited star counts');
    console.log('   Set GITHUB_TOKEN env var for more comprehensive data\n');
  }
  
  try {
    // Check README exists
    const readmePath = path.join(__dirname, '../downloads/README.md');
    try {
      await fs.access(readmePath);
    } catch {
      console.error('❌ README.md not found');
      process.exit(1);
    }
    
    // PHASE 1: Parse all servers from README (fast, no API calls)
    console.log('📋 PHASE 1: Parsing all servers from README...\n');
    const allServers = await parseReadme(readmePath);
    
    // Filter active servers
    const activeServers = allServers.filter(s => !s.isArchived);
    
    console.log(`✅ Parsed ${allServers.length} total servers`);
    console.log(`   Active: ${activeServers.length}`);
    console.log(`   Reference: ${activeServers.filter(s => s.isFeatured).length}`);
    console.log(`   Official: ${activeServers.filter(s => s.isVerified && !s.isFeatured).length}`);
    console.log(`   Community: ${activeServers.filter(s => s.isCommunity).length}`);
    
    // PHASE 2: Fetch stars for TOP servers (respecting rate limits)
    console.log('\n📋 PHASE 2: Fetching GitHub stars for top servers...\n');
    
    // Prioritize: Reference > Official > Community
    const prioritized = [
      ...activeServers.filter(s => s.isFeatured),
      ...activeServers.filter(s => s.isVerified && !s.isFeatured),
      ...activeServers.filter(s => !s.isVerified)
    ];
    
    // Fetch stars for top 200 (or less if rate limited)
    const maxToFetch = GITHUB_TOKEN ? 200 : 50;
    await fetchStarsForServers(prioritized, maxToFetch);
    
    // Sort by priority and stars
    prioritized.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      return (b.repoStars || 0) - (a.repoStars || 0);
    });
    
    // PHASE 3: Save comprehensive data
    console.log('💾 PHASE 3: Saving data...\n');
    
    // Save top 300 for the app (good mix of quality and quantity)
    const topServers = prioritized.slice(0, 300);
    const outputPath = path.join(__dirname, '../src/data/mcps-comprehensive.json');
    await fs.writeFile(outputPath, JSON.stringify(topServers, null, 2));
    
    console.log(`✅ Saved ${topServers.length} servers to: mcps-comprehensive.json`);
    
    // Save ALL servers (for reference) even without stars
    const allOutputPath = path.join(__dirname, '../src/data/mcps-all.json');
    await fs.writeFile(allOutputPath, JSON.stringify(prioritized, null, 2));
    
    console.log(`✅ Saved ${prioritized.length} servers to: mcps-all.json (includes servers without star data)`);
    
    // Print statistics
    console.log('\n📊 Final Statistics (top 300 for app):');
    console.log(`   Total servers: ${topServers.length}`);
    console.log(`   With GitHub stars: ${topServers.filter(s => s.repoStars > 0).length}`);
    console.log(`   Reference: ${topServers.filter(s => s.isFeatured).length}`);
    console.log(`   Official: ${topServers.filter(s => s.isVerified && !s.isFeatured).length}`);
    console.log(`   Community: ${topServers.filter(s => !s.isVerified).length}`);
    
    // Category breakdown
    const categories = {};
    topServers.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    console.log('\n   Categories:', categories);
    
    // Top 10 by stars
    const withStars = topServers.filter(s => s.repoStars > 0);
    console.log('\n⭐ Top 10 by stars:');
    withStars.slice(0, 10).forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name} (${s.repoStars.toLocaleString()} ⭐) - ${s.section}`);
    });
    
    console.log('\n🎉 Smart scraping complete!');
    console.log('\n💡 To fetch more star counts, run again with GITHUB_TOKEN set');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run
main();

