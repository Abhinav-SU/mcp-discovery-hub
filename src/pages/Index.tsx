import { useState, useMemo, useEffect } from "react";
import { SearchX } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TrendingSection from "@/components/TrendingSection";
import SearchBar from "@/components/SearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import AnimatedCard from "@/components/AnimatedCard";
import MCPServerModal from "@/components/MCPServerModal";
import SubmitMCPModal from "@/components/SubmitMCPModal";
import SortDropdown from "@/components/SortDropdown";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MCPServer } from "@/components/MCPServerCard";
import { useMCPServers } from "@/hooks/useMCPServers";

export type SortOption = "popular" | "recent" | "alphabetical" | "rating";

const Index = () => {
  // Fetch servers from Supabase (with fallback to local data)
  const { servers: mcpServers, loading: serversLoading, usingFallback } = useMCPServers();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats
  const totalServers = mcpServers.length;
  const repoStars = mcpServers[0]?.repoStars || 0; // All servers share the same repo stars
  const totalCategories = new Set(mcpServers.map(s => s.category)).size;
  const newThisWeek = mcpServers.filter(s => s.lastUpdated.includes("day")).length;

  // Get trending servers (featured first, then by rating)
  const trendingServers = useMemo(() => {
    return [...mcpServers].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, []);

  // Manage loading state
  useEffect(() => {
    if (!serversLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [serversLoading]);

  const filteredAndSortedServers = useMemo(() => {
    // Filter
    let filtered = mcpServers.filter((server) => {
      const matchesSearch =
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.tags && server.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesCategory =
        selectedCategory === "All" || server.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort with featured servers always first
    const sorted = [...filtered].sort((a, b) => {
      // Featured servers always come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // Then apply the selected sort
      switch (sortBy) {
        case "popular":
          // Since all servers have same repo stars, sort by rating
          return (b.rating || 0) - (a.rating || 0);
        case "recent":
          // Parse "X days/week ago" to sort by recency
          const parseTime = (time: string) => {
            const match = time.match(/(\d+)\s+(day|week)/);
            if (!match) return 0;
            const value = parseInt(match[1]);
            const unit = match[2];
            return unit === "week" ? value * 7 : value;
          };
          return parseTime(a.lastUpdated) - parseTime(b.lastUpdated);
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "rating":
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) return ratingB - ratingA;
          // If ratings are equal, sort by stars
          return b.stars - a.stars;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCardClick = (server: MCPServer) => {
    setSelectedServer(server);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => setSubmitModalOpen(true)} />
      <HeroSection />
      
      <StatsSection
        totalServers={totalServers}
        totalStars={repoStars}
        totalCategories={totalCategories}
        newThisWeek={newThisWeek}
      />

      <TrendingSection
        servers={trendingServers}
        onServerClick={handleCardClick}
      />
      
      <div className="max-w-7xl mx-auto py-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />
        
        {/* Sort and Result Count */}
        <div className="flex items-center justify-between px-4 py-4 flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAndSortedServers.length}</span> of{" "}
            <span className="font-semibold text-foreground">{mcpServers.length}</span> MCP servers
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
        
        {filteredAndSortedServers.length > 0 ? (
          isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
              {filteredAndSortedServers.map((server, index) => (
                <AnimatedCard
                  key={server.id}
                  server={server}
                  onClick={() => handleCardClick(server)}
                  index={index}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <SearchX className="h-24 w-24 text-muted-foreground/40 mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No MCP servers found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={handleClearFilters} variant="default">
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <Footer />

      <MCPServerModal 
        server={selectedServer}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <SubmitMCPModal
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
      />
    </div>
  );
};

export default Index;
