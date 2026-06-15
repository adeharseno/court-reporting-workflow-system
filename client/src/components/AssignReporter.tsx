import { useState, useEffect } from "react";
import { api, ApiError } from "../api.js";
import type { Reporter, Job } from "../types.js";
import { Button } from "@/components/ui/button";

interface AssignReporterProps {
  job: Job;
  onAssigned: () => void;
  onClose: () => void;
}

export function AssignReporter({ job, onAssigned, onClose }: AssignReporterProps) {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.reporters.list().then((data) => {
      const available = data.filter((r) => {
        if (!r.availability) return false;
        if (job.locationType === "physical" && r.location !== job.location) return false;
        return true;
      });
      setReporters(available);
      if (available.length > 0) setSelectedId(available[0].id);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load reporters");
      setLoading(false);
    });
  }, [job.locationType, job.location]);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.assignReporter(job.id, selectedId);
      onAssigned();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground py-2">Loading reporters...</p>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
      )}
      {reporters.length === 0 ? (
        <p className="text-sm text-muted-foreground">No available reporters for this job.</p>
      ) : (
        <>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Select reporter:
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {reporters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location}, {r.ratePerMinute.toLocaleString()} IDR/min)
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" disabled={submitting || !selectedId} onClick={handleSubmit}>
              {submitting ? "Assigning..." : "Assign Reporter"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
