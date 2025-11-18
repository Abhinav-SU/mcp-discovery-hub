import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { MCPServer } from "./MCPServerCard";

interface TrendingItemProps {
  server: MCPServer;
  onClick: () => void;
}

const generateSparklineData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    value: Math.floor(Math.random() * 30) + 70 + i * 5,
  }));
};

const TrendingItem = ({ server, onClick }: TrendingItemProps) => {
  const sparklineData = generateSparklineData();

  return (
    <Card
      onClick={onClick}
      className="flex-shrink-0 w-72 bg-card border-border p-4 shadow-card hover:shadow-card-hover hover:bg-card-hover hover:scale-105 transition-smooth cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{server.name}</h4>
          {server.repoStars && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-medium text-foreground">
                {server.repoStars >= 1000 ? `${(server.repoStars / 1000).toFixed(1)}k` : server.repoStars}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

interface TrendingSectionProps {
  servers: MCPServer[];
  onServerClick: (server: MCPServer) => void;
}

const TrendingSection = ({ servers, onServerClick }: TrendingSectionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">Trending This Week</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {servers.slice(0, 5).map((server) => (
          <TrendingItem
            key={server.id}
            server={server}
            onClick={() => onServerClick(server)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
