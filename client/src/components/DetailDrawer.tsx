import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../api.js";
import type { Job } from "../types.js";
import { VALID_TRANSITIONS } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import { PaymentSummary } from "./PaymentSummary.js";
import { AssignReporter } from "./AssignReporter.js";
import { AssignEditor } from "./AssignEditor.js";
import { StatusUpdater } from "./StatusUpdater.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Calendar } from "lucide-react";

interface DetailDrawerProps {
  jobId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

type ActionView = "info" | "reporter" | "editor" | "status";

export function DetailDrawer({ jobId, open, onOpenChange, onRefresh }: DetailDrawerProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionView, setActionView] = useState<ActionView>("info");

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.jobs.get(jobId);
      setJob(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("Job not found");
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to load job");
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (open) {
      fetchJob();
      setActionView("info");
    }
  }, [open, fetchJob]);

  const handleActionDone = () => {
    setActionView("info");
    fetchJob();
    onRefresh();
  };

  const showAssignReporter = job && job.status === "NEW";
  const showAssignEditor = job && job.reporterId !== null && job.editorId === null;
  const showUpdateStatus = job && job.status !== "COMPLETED";
  const nextStatus = job ? VALID_TRANSITIONS[job.status] : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] w-full overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading job...</p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}

        {job && !loading && !error && actionView === "info" && (
          <>
            <SheetHeader className="mb-6">
              <SheetTitle className="text-xl">{job.caseName}</SheetTitle>
              <div className="mt-2">
                <StatusBadge status={job.status} />
              </div>
            </SheetHeader>

            <div className="space-y-6 p-4 overflow-x-hidden">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Case Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.durationMinutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{job.locationType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Assignments
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reporter</p>
                    <p className="text-sm font-medium">{job.reporter?.name || "—"}</p>
                    {job.reporter && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.reporter.location} · {job.reporter.ratePerMinute.toLocaleString()} IDR/min
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Editor</p>
                    <p className="text-sm font-medium">{job.editor?.name || "—"}</p>
                    {job.editor && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.editor.flatFee.toLocaleString()} IDR/job
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Payment
                </h4>
                <PaymentSummary jobId={job.id} />
              </div>

              <Separator />

              <div className="">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Status
                </h4>
                <div className="py-2 whitespace-nowrap overflow-x-auto">
                  <div className="flex items-center gap-2">
                    {(["NEW", "ASSIGNED", "TRANSCRIBED", "REVIEWED", "COMPLETED"] as const).map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            s === job.status
                              ? "bg-primary ring-4 ring-primary/20"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                        <span className={`text-xs ${s === job.status ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                          {s}
                        </span>
                        {i < 4 && <div className="h-px w-4 bg-border" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Actions
                </h4>
                <div className="flex flex-col gap-2">
                  {showAssignReporter && (
                    <Button variant="outline" size="sm" className="justify-start" onClick={() => setActionView("reporter")}>
                      Assign Reporter
                    </Button>
                  )}
                  {showAssignEditor && (
                    <Button variant="outline" size="sm" className="justify-start" onClick={() => setActionView("editor")}>
                      Assign Editor
                    </Button>
                  )}
                  {showUpdateStatus && nextStatus && (
                    <Button variant="outline" size="sm" className="justify-start" onClick={() => setActionView("status")}>
                      Move to {nextStatus}
                    </Button>
                  )}
                  {!showAssignReporter && !showAssignEditor && !showUpdateStatus && (
                    <p className="text-sm text-muted-foreground">All actions complete.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {job && actionView === "reporter" && (
          <div className="pt-6 px-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground mb-6"
              onClick={() => setActionView("info")}
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold mb-4">Assign Reporter</h3>
            <AssignReporter job={job} onAssigned={handleActionDone} onClose={() => setActionView("info")} />
          </div>
        )}

        {job && actionView === "editor" && (
          <div className="pt-6 px-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground mb-6"
              onClick={() => setActionView("info")}
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold mb-4">Assign Editor</h3>
            <AssignEditor job={job} onAssigned={handleActionDone} onClose={() => setActionView("info")} />
          </div>
        )}

        {job && actionView === "status" && (
          <div className="pt-6 px-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground mb-6"
              onClick={() => setActionView("info")}
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <StatusUpdater job={job} onUpdated={handleActionDone} onClose={() => setActionView("info")} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
