import type { JobStatus } from "../types.js";
import styles from "./StatusBadge.module.css";

const statusColors: Record<JobStatus, string> = {
  NEW: "#6b7280",
  ASSIGNED: "#2563eb",
  TRANSCRIBED: "#7c3aed",
  REVIEWED: "#d97706",
  COMPLETED: "#16a34a",
};

interface StatusBadgeProps {
  status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={styles.badge}
      style={{ background: statusColors[status] }}
    >
      {status}
    </span>
  );
}
