import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Server, Star, Layers, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  duration?: number;
}

const StatCard = ({ icon, label, value, duration = 2000 }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card-hover border-border p-6 shadow-card hover:shadow-card-hover transition-smooth">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-primary">{icon}</div>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-3xl font-bold text-foreground">
          {count.toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

interface StatsSectionProps {
  totalServers: number;
  totalStars: number;
  totalCategories: number;
  newThisWeek: number;
}

const StatsSection = ({ totalServers, totalStars, totalCategories, newThisWeek }: StatsSectionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Server className="h-5 w-5" />}
          label="Total MCP Servers"
          value={totalServers}
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Total GitHub Stars"
          value={totalStars}
        />
        <StatCard
          icon={<Layers className="h-5 w-5" />}
          label="Categories"
          value={totalCategories}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="New This Week"
          value={newThisWeek}
        />
      </div>
    </div>
  );
};

export default StatsSection;
