import { Skeleton } from "@/components/ui/skeleton";

export const ExamCardSkeleton = ({ showButton = true }) => {
  return (
    <div className="p-4 rounded-lg border border-border animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        {showButton && <Skeleton className="h-8 w-20 rounded" />}
      </div>
    </div>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-accent animate-pulse">
      <div className="flex-1">
        <Skeleton className="h-5 w-36 mb-1" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="text-right">
        <Skeleton className="h-8 w-12 mb-1" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
};
