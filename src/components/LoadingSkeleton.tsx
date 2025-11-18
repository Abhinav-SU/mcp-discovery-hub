import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card className="bg-card border-border p-6 h-full">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
