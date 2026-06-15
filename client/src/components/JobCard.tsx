import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Clock, MoreHorizontal } from "lucide-react";
import type { Job, JobStatus } from "../types.js";
import { VALID_TRANSITIONS } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";

interface JobCardProps {
  job: Job;
  onSelect: (id: number) => void;
  onAction: (job: Job, action: string) => void;
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function JobCard({ job, onSelect, onAction }: JobCardProps) {
  const showAssignReporter = job.status === "NEW";
  const showAssignEditor = job.reporterId !== null && job.editorId === null;
  const showUpdateStatus = job.status !== "COMPLETED";
  const nextStatus = VALID_TRANSITIONS[job.status];

  return (
    <Card
      className="group cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onSelect(job.id)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-base font-semibold truncate">{job.caseName}</h3>
              <StatusBadge status={job.status} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {job.durationMinutes} min
              </span>
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{job.locationType}</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Reporter </span>
                <span className="font-medium">{job.reporter?.name || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Editor </span>
                <span className="font-medium">{job.editor?.name || "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo(job.updatedAt)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(job.id); }}>
                  View Details
                </DropdownMenuItem>
                {showAssignReporter && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction(job, "reporter"); }}>
                    Assign Reporter
                  </DropdownMenuItem>
                )}
                {showAssignEditor && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction(job, "editor"); }}>
                    Assign Editor
                  </DropdownMenuItem>
                )}
                {showUpdateStatus && nextStatus && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction(job, "status"); }}>
                    Move to {nextStatus}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction(job, "payment"); }}>
                  Payment Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
