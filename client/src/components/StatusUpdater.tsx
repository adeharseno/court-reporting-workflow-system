import { useState } from "react";
import { api, ApiError } from "../api.js";
import { VALID_TRANSITIONS } from "../types.js";
import type { Job, JobStatus } from "../types.js";
import { Button } from "@/components/ui/button";

interface StatusUpdaterProps {
  job: Job;
  onUpdated: () => void;
  onClose: () => void;
}

export function StatusUpdater({ job, onUpdated, onClose }: StatusUpdaterProps) {
  const nextStatus = VALID_TRANSITIONS[job.status];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!nextStatus) {
    return <p className="text-sm text-muted-foreground">Job is complete. No further transitions.</p>;
  }

  const handleUpdate = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.updateStatus(job.id, nextStatus as JobStatus);
      onUpdated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Status update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
      )}
      <p className="text-sm text-muted-foreground">
        Current: <strong className="text-foreground">{job.status}</strong> → Next:{" "}
        <strong className="text-foreground">{nextStatus}</strong>
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" disabled={submitting} onClick={handleUpdate}>
          {submitting ? "Updating..." : `Move to ${nextStatus}`}
        </Button>
      </div>
    </div>
  );
}
