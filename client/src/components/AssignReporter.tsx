import { useState, useEffect } from "react";
import { api, ApiError } from "../api.js";
import type { Reporter, Job } from "../types.js";
import styles from "./ActionForm.module.css";

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
        if (job.locationType === "physical" && r.location !== job.location)
          return false;
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

  if (loading) return <p className={styles.info}>Loading reporters...</p>;

  return (
    <div className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      {reporters.length === 0 ? (
        <p className={styles.info}>No available reporters for this job.</p>
      ) : (
        <>
          <label className={styles.label}>
            Select reporter:
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {reporters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location}, {r.ratePerMinute.toLocaleString()} IDR/min)
                </option>
              ))}
            </select>
          </label>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={submitting || !selectedId}
              onClick={handleSubmit}
            >
              {submitting ? "Assigning..." : "Assign Reporter"}
            </button>
            <button className={styles.secondary} onClick={onClose}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
