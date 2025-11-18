# MCP Discovery Hub

A modern, full-stack web application for discovering and exploring Model Context Protocol (MCP) servers. Built as a learning project to demonstrate React, TypeScript, Supabase integration, and modern web development practices.

![MCP Discovery Hub](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase)

## 🎯 Project Overview

This project was created as a **portfolio/learning exercise** to explore:
- Modern React development with TypeScript
- Component-based architecture with shadcn/ui
- GitHub API integration and rate limiting
- Web scraping and data parsing
- Supabase backend integration
- Responsive design with Tailwind CSS

> **Note**: This is a learning project. For production MCP server discovery, visit [mcpservers.org](https://mcpservers.org/)

## ✨ Features

### 🔍 Search & Discovery
- Real-time search across 300+ MCP servers
- Advanced filtering by 13+ categories
- Sort by popularity, rating, or alphabetically
- Detailed server information in modals

### 📊 Data Integration
- Comprehensive data parsed from official MCP README
- Live GitHub star counts (cached with 1-hour expiry)
- Smart rate limiting for GitHub API
- Fallback to local data when offline

### 🎨 Modern UI
- Beautiful, responsive design with Tailwind CSS
- Component library powered by shadcn/ui
- Smooth animations and transitions
- Dark mode ready

### 🔧 Technical Features
- TypeScript for type safety
- React hooks for state management
- Supabase ready (optional backend)
- GitHub API integration with caching
- Automated data scraping scripts

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (optional)
- **APIs**: GitHub REST API, Octokit
- **Data**: JSON files with automated scraping
- **Build**: Vite with hot module replacement

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Abhinav-SU/mcp-discovery-hub.git
cd mcp-discovery-hub

# Install dependencies
npm install

# Create .env.local file (optional)
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: For higher GitHub API rate limits
VITE_GITHUB_TOKEN=your_github_personal_access_token

# Optional: For Supabase integration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Data Sources

The project includes scripts to scrape and parse MCP server data:

### Automated Scraping
```bash
# Parse official MCP README (requires downloads/README.md)
node scripts/parse-readme-smart.js

# Or use the original GitHub search scraper
node scripts/scrape-mcps.js
```

### Data Files
- `src/data/mcps-comprehensive.json` - 300 curated servers (used by app)
- `src/data/mcps-all.json` - 1,299+ total servers (reference)
- `src/data/mcpServers.ts` - Original sample data

## 🏗️ Project Structure

```
mcp-discovery-hub/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── MCPServerCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   └── Index.tsx
│   ├── lib/              # Utilities
│   │   ├── github.ts     # GitHub API integration
│   │   └── supabase.ts   # Supabase client
│   ├── hooks/            # Custom React hooks
│   │   └── useMCPServers.ts
│   ├── data/             # Data files
│   │   └── mcps-comprehensive.json
│   └── main.tsx          # Entry point
├── scripts/              # Data scraping scripts
│   ├── parse-readme-smart.js
│   └── scrape-mcps.js
├── public/               # Static assets
└── README.md
```

## 🎨 Key Components

### MCPServerCard
Displays individual MCP server information with:
- Server name, description, category
- GitHub stars (with live fetching option)
- Verification badges
- Featured ribbon for highlighted servers

### SearchBar
Real-time search across server names and descriptions with debouncing.

### CategoryFilters
Filter servers by 13+ categories including Database, Development, AI, Cloud, etc.

### useMCPServers Hook
Custom hook that:
- Fetches from Supabase (when configured)
- Falls back to local JSON data
- Handles loading and error states

## 📈 What I Learned

Building this project taught me:

1. **React Best Practices**
   - Component composition and reusability
   - Custom hooks for business logic
   - Performance optimization with useMemo

2. **TypeScript Integration**
   - Type-safe component props
   - Interface definitions for data models
   - Generic type usage in hooks

3. **API Integration**
   - GitHub API rate limiting strategies
   - Caching with localStorage
   - Error handling and fallbacks

4. **Data Management**
   - Web scraping with Node.js
   - Parsing markdown documents
   - Data normalization and categorization

5. **Modern Tooling**
   - Vite for fast development
   - ES modules in Node.js
   - TypeScript configuration

## 🔍 Challenges & Solutions

### Challenge 1: GitHub API Rate Limits
**Solution**: Implemented smart caching with localStorage and prioritized important servers first.

### Challenge 2: Parsing 1,300+ Servers
**Solution**: Created a phased approach - parse all servers first (fast), then fetch GitHub data for top servers only.

### Challenge 3: Data Integrity
**Solution**: Validated all GitHub URLs, extracted real descriptions, and categorized servers automatically.

## 🚀 Deployment

The project is ready for deployment on:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Build with `npm run build`, deploy `dist/` folder

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Data Scraping
node scripts/parse-readme-smart.js   # Parse official README
node scripts/scrape-mcps.js          # GitHub search scraper
```

## 🤝 Contributing

This is a personal learning project, but feel free to:
- Fork it for your own experiments
- Open issues for bugs or suggestions
- Use it as a reference for your projects

## 📄 License

MIT License - Feel free to use this project for learning or reference.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - For the awesome protocol
- [mcpservers.org](https://mcpservers.org/) - The established MCP server directory
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component library
- [Supabase](https://supabase.com/) - For the backend infrastructure

## 📧 Contact

**Abhinav S U**
- GitHub: [@Abhinav-SU](https://github.com/Abhinav-SU)
- Project: [MCP Discovery Hub](https://github.com/Abhinav-SU/mcp-discovery-hub)

---

**Built with ❤️ as a learning project to explore modern web development.**
