import { useState, useEffect } from "react";
import { api, ApiError } from "../api.js";
import type { Editor, Job } from "../types.js";
import { Button } from "@/components/ui/button";

interface AssignEditorProps {
  job: Job;
  onAssigned: () => void;
  onClose: () => void;
}

export function AssignEditor({ job, onAssigned, onClose }: AssignEditorProps) {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.editors.list().then((data) => {
      setEditors(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load editors");
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.assignEditor(job.id, selectedId);
      onAssigned();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground py-2">Loading editors...</p>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
      )}
      {editors.length === 0 ? (
        <p className="text-sm text-muted-foreground">No editors available.</p>
      ) : (
        <>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Select editor:
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {editors.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.flatFee.toLocaleString()} IDR/job)
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" disabled={submitting || !selectedId} onClick={handleSubmit}>
              {submitting ? "Assigning..." : "Assign Editor"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
