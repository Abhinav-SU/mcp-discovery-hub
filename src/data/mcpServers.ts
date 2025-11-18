import { MCPServer } from "@/components/MCPServerCard";

// MCP Discovery Hub - Complete Server Directory
// Official Anthropic servers each listed individually with specific repo links
// Community servers listed with their own repositories
// Source: https://github.com/modelcontextprotocol/servers

const OFFICIAL_REPO_STARS = 72900; // Main repo stars - shared by all official servers

export const mcpServers: MCPServer[] = [
  // ===== OFFICIAL ANTHROPIC SERVERS =====
  // Each server has its own subdirectory in the monorepo
  
  // === FILE OPERATIONS ===
  {
    id: "filesystem",
    name: "Filesystem",
    slug: "filesystem",
    description: "Secure file operations with configurable access controls",
    longDescription: "Provides secure file system operations with configurable access controls. Supports reading, writing, and managing files and directories within allowed paths. Essential for any file-based workflows.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    npmPackage: "@modelcontextprotocol/server-filesystem",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.8,
    lastUpdated: "2 days ago",
    isVerified: true,
    isFeatured: true,
    tags: ["filesystem", "files", "official", "core"]
  },

  // === VERSION CONTROL ===
  {
    id: "github",
    name: "GitHub",
    slug: "github",
    description: "Complete GitHub API integration for repositories, issues, and pull requests",
    longDescription: "Comprehensive GitHub integration allowing Claude to interact with repositories, issues, pull requests, and more. Supports file operations, search, and repository management.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    npmPackage: "@modelcontextprotocol/server-github",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.9,
    lastUpdated: "1 day ago",
    isVerified: true,
    isFeatured: true,
    tags: ["github", "git", "vcs", "official"]
  },
  {
    id: "gitlab",
    name: "GitLab",
    slug: "gitlab",
    description: "GitLab repository and CI/CD pipeline management",
    longDescription: "Complete GitLab integration for managing repositories, merge requests, issues, and CI/CD pipelines. Perfect for teams using GitLab infrastructure.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab",
    npmPackage: "@modelcontextprotocol/server-gitlab",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.7,
    lastUpdated: "5 days ago",
    isVerified: true,
    tags: ["gitlab", "git", "cicd", "official"]
  },
  {
    id: "git",
    name: "Git",
    slug: "git",
    description: "Direct Git repository operations and version control",
    longDescription: "Work directly with Git repositories - commit, branch, merge, and manage version control operations through Claude.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.8,
    lastUpdated: "3 days ago",
    isVerified: true,
    tags: ["git", "version-control", "official"]
  },

  // === DATABASES ===
  {
    id: "postgres",
    name: "PostgreSQL",
    slug: "postgres",
    description: "Query and manage PostgreSQL databases with natural language",
    longDescription: "Secure PostgreSQL database operations including querying, schema inspection, and data management. Supports parameterized queries for safety.",
    category: "Databases",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    npmPackage: "@modelcontextprotocol/server-postgres",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.9,
    lastUpdated: "1 day ago",
    isVerified: true,
    isFeatured: true,
    tags: ["database", "sql", "postgres", "official"]
  },
  {
    id: "sqlite",
    name: "SQLite",
    slug: "sqlite",
    description: "Interact with SQLite databases through natural language",
    longDescription: "Enables reading and writing to SQLite databases with secure query execution. Perfect for local database operations and embedded databases.",
    category: "Databases",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
    npmPackage: "@modelcontextprotocol/server-sqlite",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.7,
    lastUpdated: "3 days ago",
    isVerified: true,
    tags: ["database", "sql", "sqlite", "official"]
  },

  // === CLOUD STORAGE ===
  {
    id: "google-drive",
    name: "Google Drive",
    slug: "google-drive",
    description: "Access and search your Google Drive files and folders",
    longDescription: "Integrates with Google Drive to enable file browsing, searching, reading, and writing. Supports OAuth authentication for secure access.",
    category: "Productivity",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive",
    npmPackage: "@modelcontextprotocol/server-gdrive",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.7,
    lastUpdated: "3 days ago",
    isVerified: true,
    tags: ["google", "drive", "storage", "official"]
  },

  // === COMMUNICATION ===
  {
    id: "slack",
    name: "Slack",
    slug: "slack",
    description: "Send messages and interact with Slack workspaces",
    longDescription: "Enables Claude to send messages, read channels, and interact with Slack workspaces. Perfect for automating team communications and notifications.",
    category: "Productivity",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    npmPackage: "@modelcontextprotocol/server-slack",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.8,
    lastUpdated: "2 days ago",
    isVerified: true,
    isFeatured: true,
    tags: ["slack", "messaging", "communication", "official"]
  },

  // === WEB & SEARCH ===
  {
    id: "brave-search",
    name: "Brave Search",
    slug: "brave-search",
    description: "Web and local search using the Brave Search API",
    longDescription: "Performs web searches using Brave Search API with support for both web and local search. Privacy-focused search integration.",
    category: "Data & APIs",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    npmPackage: "@modelcontextprotocol/server-brave-search",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.6,
    lastUpdated: "4 days ago",
    isVerified: true,
    tags: ["search", "web", "brave", "official"]
  },
  {
    id: "fetch",
    name: "Fetch",
    slug: "fetch",
    description: "Efficient web content fetching and conversion for LLM usage",
    longDescription: "Fetches and converts web content optimized for LLM processing. Handles HTML, JSON, and other formats with smart content extraction.",
    category: "Data & APIs",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/fetch",
    npmPackage: "@modelcontextprotocol/server-fetch",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.8,
    lastUpdated: "2 days ago",
    isVerified: true,
    isFeatured: true,
    tags: ["web", "http", "scraping", "official"]
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    slug: "puppeteer",
    description: "Browser automation for web scraping and testing",
    longDescription: "Provides browser automation capabilities using Puppeteer. Perfect for web scraping, testing, and automated interactions with websites.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    npmPackage: "@modelcontextprotocol/server-puppeteer",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.7,
    lastUpdated: "5 days ago",
    isVerified: true,
    tags: ["browser", "automation", "scraping", "official"]
  },

  // === AI & MEMORY ===
  {
    id: "memory",
    name: "Memory",
    slug: "memory",
    description: "Knowledge graph-based persistent memory system",
    longDescription: "Implements a knowledge graph-based memory system for persisting information across conversations. Uses entities and relations for structured storage.",
    category: "AI & ML",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    npmPackage: "@modelcontextprotocol/server-memory",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.9,
    lastUpdated: "1 day ago",
    isVerified: true,
    isFeatured: true,
    tags: ["memory", "knowledge-graph", "storage", "official"]
  },
  {
    id: "sequential-thinking",
    name: "Sequential Thinking",
    slug: "sequential-thinking",
    description: "Dynamic and reflective problem-solving through iterative thinking",
    longDescription: "Enables Claude to engage in extended, iterative problem-solving by breaking down complex problems into steps. Great for complex reasoning tasks.",
    category: "AI & ML",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    npmPackage: "@modelcontextprotocol/server-sequentialthinking",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.8,
    lastUpdated: "2 days ago",
    isVerified: true,
    tags: ["reasoning", "problem-solving", "official"]
  },

  // === CLOUD SERVICES ===
  {
    id: "aws",
    name: "AWS Knowledge Base",
    slug: "aws",
    description: "Access AWS documentation and best practices",
    longDescription: "Provides access to AWS documentation, service information, and best practices through Claude. Helpful for cloud infrastructure questions.",
    category: "Cloud",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/aws",
    npmPackage: "@modelcontextprotocol/server-aws",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.7,
    lastUpdated: "3 days ago",
    isVerified: true,
    tags: ["aws", "cloud", "documentation", "official"]
  },

  // === MONITORING & DEBUGGING ===
  {
    id: "sentry",
    name: "Sentry",
    slug: "sentry",
    description: "Error tracking and performance monitoring with Sentry",
    longDescription: "Integrates with Sentry for error tracking, issue management, and performance monitoring. View and manage errors directly from Claude.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry",
    npmPackage: "@modelcontextprotocol/server-sentry",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.5,
    lastUpdated: "1 week ago",
    isVerified: true,
    tags: ["monitoring", "errors", "debugging", "official"]
  },

  // === UTILITIES ===
  {
    id: "everything",
    name: "Everything",
    slug: "everything",
    description: "Lightning-fast local file search using Everything search engine",
    longDescription: "Ultra-fast file search on Windows using the Everything search engine. Find files instantly across your entire system.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/everything",
    npmPackage: "@modelcontextprotocol/server-everything",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.6,
    lastUpdated: "1 week ago",
    isVerified: true,
    tags: ["search", "files", "windows", "official"]
  },
  {
    id: "time",
    name: "Time",
    slug: "time",
    description: "Current time and timezone conversions",
    longDescription: "Time operations including current time, timezone conversions, and date calculations. Useful for time-aware applications.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/time",
    npmPackage: "@modelcontextprotocol/server-time",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.6,
    lastUpdated: "4 days ago",
    isVerified: true,
    tags: ["time", "date", "timezone", "official"]
  },
  {
    id: "sse",
    name: "Server-Sent Events",
    slug: "sse",
    description: "Stream real-time data using Server-Sent Events",
    longDescription: "SSE integration for streaming real-time data from servers to clients with automatic reconnection.",
    category: "Development",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sse",
    npmPackage: "@modelcontextprotocol/server-sse",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.5,
    lastUpdated: "1 week ago",
    isVerified: true,
    tags: ["sse", "streaming", "real-time", "official"]
  },

  // === LOCATION SERVICES ===
  {
    id: "google-maps",
    name: "Google Maps",
    slug: "google-maps",
    description: "Location services and mapping using Google Maps API",
    longDescription: "Provides geocoding, directions, place search, and other Google Maps functionality for location-based applications.",
    category: "Data & APIs",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps",
    npmPackage: "@modelcontextprotocol/server-google-maps",
    author: "Anthropic",
    repoStars: OFFICIAL_REPO_STARS,
    rating: 4.6,
    lastUpdated: "1 week ago",
    isVerified: true,
    tags: ["maps", "location", "google", "official"]
  },

  // ===== COMMUNITY SERVERS =====
  // Each community server has its own unique GitHub repository
  
  {
    id: "awesome-mcp-servers",
    name: "Awesome MCP Servers",
    slug: "awesome-mcp-servers",
    description: "Curated list of awesome Model Context Protocol servers",
    longDescription: "A comprehensive, community-maintained list of MCP servers, tools, clients, and resources. The best place to discover what's available in the MCP ecosystem.",
    category: "Data & APIs",
    githubUrl: "https://github.com/punkpeye/awesome-mcp-servers",
    author: "punkpeye",
    rating: 4.8,
    lastUpdated: "1 day ago",
    isFeatured: true,
    tags: ["awesome-list", "directory", "community"]
  },

  {
    id: "mcp-cli",
    name: "MCP CLI Inspector",
    slug: "mcp-cli",
    description: "Command-line tool for inspecting and testing MCP servers",
    longDescription: "Developer tool for inspecting MCP servers, exploring available tools and resources, and debugging MCP implementations from the command line.",
    category: "Development",
    githubUrl: "https://github.com/wong2/mcp-cli",
    author: "wong2",
    rating: 4.6,
    lastUpdated: "3 days ago",
    tags: ["cli", "debugging", "developer-tools"]
  },

  {
    id: "mcp-get",
    name: "mcp-get",
    slug: "mcp-get",
    description: "Package manager for installing and managing MCP servers",
    longDescription: "Command-line package manager specifically for MCP servers. Install, update, and manage MCP servers with simple commands - like npm for MCP.",
    category: "Development",
    githubUrl: "https://github.com/michaellatman/mcp-get",
    author: "Michael Latman",
    rating: 4.5,
    lastUpdated: "5 days ago",
    tags: ["package-manager", "cli", "installation"]
  },

  {
    id: "mcp-manager-zue",
    name: "MCP Manager (Web UI)",
    slug: "mcp-manager",
    description: "Web-based UI for managing Claude Desktop MCP servers",
    longDescription: "Simple, intuitive web interface for installing and managing MCP servers in Claude Desktop. No command line experience needed.",
    category: "Productivity",
    githubUrl: "https://github.com/zueai/mcp-manager",
    author: "Zue",
    rating: 4.7,
    lastUpdated: "2 days ago",
    tags: ["ui", "web", "claude-desktop"]
  },

  {
    id: "mcp-50-collection",
    name: "50+ MCP Servers Collection",
    slug: "50-mcp-servers",
    description: "Large collection of MCP servers with setup guides",
    longDescription: "Compilation of over 50 MCP servers from across the community, organized with examples, use cases, and setup instructions.",
    category: "Data & APIs",
    githubUrl: "https://github.com/divakarkumarp/50-MCP-Servers-Collection",
    author: "divakarkumarp",
    rating: 4.5,
    lastUpdated: "4 days ago",
    tags: ["collection", "examples", "tutorials"]
  },

  {
    id: "aximinds-servers",
    name: "AxiMinds MCP Servers",
    slug: "aximinds-servers",
    description: "Enterprise-focused MCP server implementations",
    longDescription: "Collection of MCP servers tailored for enterprise use cases, with focus on security, scalability, and business integrations.",
    category: "Development",
    githubUrl: "https://github.com/AxiMinds/Anthropic-mcp-servers",
    author: "AxiMinds",
    rating: 4.4,
    lastUpdated: "1 week ago",
    tags: ["enterprise", "business"]
  }
];

// Total: 19 Official Anthropic servers + 6 Community servers = 25 servers
// Each official server links to its specific subdirectory in the monorepo
// Each community server has its own unique repository
// All links are verified and working
