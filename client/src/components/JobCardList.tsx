import type { Job } from "../types.js";
import { JobCard } from "./JobCard.js";

interface JobCardListProps {
  jobs: Job[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onSelectJob: (id: number) => void;
  onAction: (job: Job, action: string) => void;
}

export function JobCardList({
  jobs,
  loading,
  error,
  onRetry,
  onSelectJob,
  onAction,
}: JobCardListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-48 bg-muted rounded" />
                <div className="h-4 w-72 bg-muted rounded" />
                <div className="h-4 w-40 bg-muted rounded" />
              </div>
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          No transcription jobs yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onSelect={onSelectJob}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
