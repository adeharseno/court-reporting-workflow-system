import { useState } from "react";
import { api, ApiError } from "../api.js";
import { VALID_TRANSITIONS } from "../types.js";
import type { Job, JobStatus } from "../types.js";
import styles from "./ActionForm.module.css";

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
    return <p className={styles.info}>Job is complete. No further transitions.</p>;
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
    <div className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.info}>
        Current: <strong>{job.status}</strong> → Next: <strong>{nextStatus}</strong>
      </p>
      <div className={styles.actions}>
        <button
          className={styles.primary}
          disabled={submitting}
          onClick={handleUpdate}
        >
          {submitting ? "Updating..." : `Move to ${nextStatus}`}
        </button>
        <button className={styles.secondary} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
