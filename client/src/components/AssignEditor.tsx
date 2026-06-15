import { useState, useEffect } from "react";
import { api, ApiError } from "../api.js";
import type { Editor, Job } from "../types.js";
import styles from "./ActionForm.module.css";

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

  if (loading) return <p className={styles.info}>Loading editors...</p>;

  return (
    <div className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      {editors.length === 0 ? (
        <p className={styles.info}>No editors available.</p>
      ) : (
        <>
          <label className={styles.label}>
            Select editor:
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {editors.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.flatFee.toLocaleString()} IDR/job)
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
              {submitting ? "Assigning..." : "Assign Editor"}
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
