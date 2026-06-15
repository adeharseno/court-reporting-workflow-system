import { useState } from "react";
import type { Job } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import { Modal } from "./Modal.js";
import { AssignReporter } from "./AssignReporter.js";
import { AssignEditor } from "./AssignEditor.js";
import { StatusUpdater } from "./StatusUpdater.js";
import { PaymentSummary } from "./PaymentSummary.js";
import styles from "./JobRow.module.css";

interface JobRowProps {
  job: Job;
  onRefresh: () => void;
  onSelect: (id: number) => void;
}

export function JobRow({ job, onRefresh, onSelect }: JobRowProps) {
  const [modal, setModal] = useState<string | null>(null);

  const closeModal = () => setModal(null);
  const handleAssigned = () => {
    closeModal();
    onRefresh();
  };

  const showAssignReporter = job.status === "NEW";
  const showAssignEditor = job.reporterId !== null && job.editorId === null;
  const showUpdateStatus = job.status !== "COMPLETED";
  const showPayment = job.reporterId !== null || job.editorId !== null;

  return (
    <>
      <tr className={styles.row}>
        <td className={styles.caseCol}>
          <button className={styles.caseLink} onClick={() => onSelect(job.id)}>
            {job.caseName}
          </button>
        </td>
        <td>{job.durationMinutes} min</td>
        <td>
          {job.location}
          <span className={styles.typeTag}>{job.locationType}</span>
        </td>
        <td>
          <StatusBadge status={job.status} />
        </td>
        <td>{job.reporter?.name || "—"}</td>
        <td>{job.editor?.name || "—"}</td>
        <td>
          <div className={styles.actions}>
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
            {showPayment && (
              <button className={styles.actionBtn} onClick={() => setModal("payment")}>
                Payment
              </button>
            )}
          </div>
        </td>
      </tr>

      <Modal open={modal === "reporter"} title="Assign Reporter" onClose={closeModal}>
        <AssignReporter job={job} onAssigned={handleAssigned} onClose={closeModal} />
      </Modal>
      <Modal open={modal === "editor"} title="Assign Editor" onClose={closeModal}>
        <AssignEditor job={job} onAssigned={handleAssigned} onClose={closeModal} />
      </Modal>
      <Modal open={modal === "status"} title="Update Status" onClose={closeModal}>
        <StatusUpdater job={job} onUpdated={handleAssigned} onClose={closeModal} />
      </Modal>
      <Modal open={modal === "payment"} title="Payment Summary" onClose={closeModal}>
        <PaymentSummary jobId={job.id} />
      </Modal>
    </>
  );
}
