import { useState, useEffect } from "react";
import { Star, BadgeCheck, Crown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchGitHubStars } from "@/lib/github";

export interface MCPServer {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  githubUrl: string;
  npmPackage?: string;
  author: string;
  repoStars?: number; // Stars for the whole monorepo (shared across all servers)
  rating?: number;
  lastUpdated: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  popularity?: number; // Optional: relative popularity score (not GitHub stars)
}

interface MCPServerCardProps {
  server: MCPServer;
  onClick: () => void;
  useLiveStars?: boolean; // Optionally fetch live star counts from GitHub
}

const MCPServerCard = ({ server, onClick, useLiveStars = false }: MCPServerCardProps) => {
  const [liveStars, setLiveStars] = useState<number | null>(null);
  const [loadingStars, setLoadingStars] = useState(false);

  // Fetch live star count if enabled
  useEffect(() => {
    if (useLiveStars && server.githubUrl) {
      setLoadingStars(true);
      fetchGitHubStars(server.githubUrl, server.repoStars || 0)
        .then(stars => {
          setLiveStars(stars);
        })
        .catch(error => {
          console.warn(`Failed to fetch stars for ${server.name}:`, error);
        })
        .finally(() => {
          setLoadingStars(false);
        });
    }
  }, [useLiveStars, server.githubUrl, server.repoStars, server.name]);

  // Use live stars if available, otherwise fallback to cached value
  const displayStars = liveStars !== null ? liveStars : server.repoStars;

  return (
    <Card 
      onClick={onClick}
      className="bg-card border-border shadow-card hover:shadow-card-hover hover:bg-card-hover hover:-translate-y-1 transition-smooth cursor-pointer p-6 h-full flex flex-col relative overflow-hidden"
    >
      {/* Featured badge in corner */}
      {server.isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-yellow-500 text-yellow-950 px-3 py-1 text-xs font-semibold transform rotate-45 translate-x-8 translate-y-2 shadow-md">
            Featured
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground truncate">{server.name}</h3>
          {server.isVerified && (
            <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" title="Verified" />
          )}
        </div>
        <Badge variant="secondary" className="text-xs flex-shrink-0">
          {server.category}
        </Badge>
      </div>
      
      <p className="text-muted-foreground mb-4 flex-grow line-clamp-2">
        {server.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          {displayStars && (
            <>
              {loadingStars ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Star className="h-4 w-4 fill-primary text-primary" />
              )}
              <span 
                className="font-semibold text-foreground text-xs" 
                title={`GitHub repository stars${liveStars !== null ? ' (live)' : ''}`}
              >
                {displayStars >= 1000 ? `${(displayStars / 1000).toFixed(1)}k` : displayStars}
              </span>
            </>
          )}
          {server.rating && (
            <span className="text-xs ml-2" title="Community rating">⭐ {server.rating.toFixed(1)}</span>
          )}
        </div>
        <span className="text-xs">Updated {server.lastUpdated}</span>
      </div>
    </Card>
  );
};

export default MCPServerCard;
