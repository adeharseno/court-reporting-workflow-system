import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../api.js";
import type { Job } from "../types.js";
import { JobRow } from "./JobRow.js";
import styles from "./JobList.module.css";

interface JobListProps {
  refreshTrigger: number;
  onSelectJob: (id: number) => void;
}

export function JobList({ refreshTrigger, onSelectJob }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.jobs.list();
      setJobs(result.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshTrigger]);

  if (loading) {
    return <p className={styles.status}>Loading jobs...</p>;
  }

  if (error) {
    return (
      <div className={styles.status}>
        <p className={styles.error}>{error}</p>
        <button className={styles.retryBtn} onClick={fetchJobs}>
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className={styles.status}>
        No transcription jobs yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Case Name</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Status</th>
            <th>Reporter</th>
            <th>Editor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              onRefresh={fetchJobs}
              onSelect={onSelectJob}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
