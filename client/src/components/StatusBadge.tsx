import type { JobStatus } from "../types.js";

const statusStyles: Record<JobStatus, string> = {
  NEW: "status-new",
  ASSIGNED: "status-assigned",
  TRANSCRIBED: "status-transcribed",
  REVIEWED: "status-reviewed",
  COMPLETED: "status-completed",
};

interface StatusBadgeProps {
  status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
