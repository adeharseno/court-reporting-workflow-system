import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../api.js";
import type { Job } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import { Modal } from "./Modal.js";
import { AssignReporter } from "./AssignReporter.js";
import { AssignEditor } from "./AssignEditor.js";
import { StatusUpdater } from "./StatusUpdater.js";
import { PaymentSummary } from "./PaymentSummary.js";
import styles from "./JobDetail.module.css";

interface JobDetailProps {
  jobId: number;
  onBack: () => void;
}

export function JobDetail({ jobId, onBack }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.jobs.get(jobId);
      setJob(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("Job not found");
      } else {
        setError(
          err instanceof ApiError ? err.message : "Failed to load job",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const closeModal = () => setModal(null);
  const handleAssigned = () => {
    closeModal();
    fetchJob();
  };

  if (loading) return <p className={styles.status}>Loading job...</p>;
  if (error) {
    return (
      <div className={styles.status}>
        <p className={styles.error}>{error}</p>
        <button className={styles.backBtn} onClick={onBack}>
          Back to list
        </button>
      </div>
    );
  }
  if (!job) return null;

  const showAssignReporter = job.status === "NEW";
  const showAssignEditor = job.reporterId !== null && job.editorId === null;
  const showUpdateStatus = job.status !== "COMPLETED";

  return (
    <>
      <div className={styles.container}>
        <button className={styles.backLink} onClick={onBack}>
          ← Back to list
        </button>

        <div className={styles.header}>
          <h2>{job.caseName}</h2>
          <StatusBadge status={job.status} />
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Job Information</h3>
            <dl>
              <dt>Duration</dt>
              <dd>{job.durationMinutes} minutes</dd>
              <dt>Location</dt>
              <dd>
                {job.location}{" "}
                <span className={styles.typeTag}>{job.locationType}</span>
              </dd>
              <dt>Created</dt>
              <dd>{new Date(job.createdAt).toLocaleString()}</dd>
              <dt>Updated</dt>
              <dd>{new Date(job.updatedAt).toLocaleString()}</dd>
            </dl>
          </div>

          <div className={styles.card}>
            <h3>Assignments</h3>
            <dl>
              <dt>Reporter</dt>
              <dd>{job.reporter?.name || "—"}</dd>
              {job.reporter && (
                <>
                  <dt>Location</dt>
                  <dd>{job.reporter.location}</dd>
                  <dt>Rate</dt>
                  <dd>{job.reporter.ratePerMinute.toLocaleString()} IDR/min</dd>
                </>
              )}
              <dt>Editor</dt>
              <dd>{job.editor?.name || "—"}</dd>
              {job.editor && (
                <>
                  <dt>Fee</dt>
                  <dd>{job.editor.flatFee.toLocaleString()} IDR/job</dd>
                </>
              )}
            </dl>
          </div>

          <div className={styles.card}>
            <h3>Payment</h3>
            <PaymentSummary jobId={job.id} />
          </div>

          <div className={styles.card}>
            <h3>Actions</h3>
            <div className={styles.actionList}>
              {showAssignReporter && (
                <button className={styles.actionBtn} onClick={() => setModal("reporter")}>
                  Assign Reporter
                </button>
              )}
              {showAssignEditor && (
                <button className={styles.actionBtn} onClick={() => setModal("editor")}>
                  Assign Editor
                </button>
              )}
              {showUpdateStatus && (
                <button className={styles.actionBtn} onClick={() => setModal("status")}>
                  Update Status
                </button>
              )}
              {!showAssignReporter && !showAssignEditor && !showUpdateStatus && (
                <p className={styles.noActions}>All actions complete.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={modal === "reporter"} title="Assign Reporter" onClose={closeModal}>
        <AssignReporter job={job} onAssigned={handleAssigned} onClose={closeModal} />
      </Modal>
      <Modal open={modal === "editor"} title="Assign Editor" onClose={closeModal}>
        <AssignEditor job={job} onAssigned={handleAssigned} onClose={closeModal} />
      </Modal>
      <Modal open={modal === "status"} title="Update Status" onClose={closeModal}>
        <StatusUpdater job={job} onUpdated={handleAssigned} onClose={closeModal} />
      </Modal>
    </>
  );
}
