import { useState } from "react";
import { api, ApiError } from "../api.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface CreateJobDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateJobDrawer({ open, onOpenChange, onCreated }: CreateJobDrawerProps) {
  const [caseName, setCaseName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState<"physical" | "remote">("physical");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setCaseName("");
    setDurationMinutes("");
    setLocation("");
    setLocationType("physical");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(durationMinutes);
    if (!caseName.trim() || !location.trim() || !duration || duration < 1) {
      setError("All fields are required. Duration must be a positive number.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.jobs.create({
        caseName: caseName.trim(),
        durationMinutes: duration,
        location: location.trim(),
        locationType,
      });
      resetForm();
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[480px] w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Create New Job</SheetTitle>
          <SheetDescription>Add a new court reporting assignment.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Case Information
            </h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium mb-1 block">Case Name</label>
                <Input
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g. State v. Johnson"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium mb-1 block">Duration (minutes)</label>
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="90"
                  min={1}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Location
            </h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Jakarta Court"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium mb-1 block">Hearing Type</label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as "physical" | "remote")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="physical">Physical</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
