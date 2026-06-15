import { useState } from "react";
import { api, ApiError } from "../api.js";
import styles from "./CreateJobForm.module.css";

interface CreateJobFormProps {
  onCreated: () => void;
  onClose: () => void;
}

export function CreateJobForm({ onCreated, onClose }: CreateJobFormProps) {
  const [caseName, setCaseName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState<"physical" | "remote">(
    "physical",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setCaseName("");
      setDurationMinutes("");
      setLocation("");
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.fields}>
        <label className={styles.label}>
          Case Name
          <input
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            placeholder="e.g. State v. Johnson"
          />
        </label>
        <label className={styles.label}>
          Duration (minutes)
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="90"
            min={1}
          />
        </label>
        <label className={styles.label}>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Jakarta Court"
          />
        </label>
        <label className={styles.label}>
          Location Type
          <select
            value={locationType}
            onChange={(e) =>
              setLocationType(e.target.value as "physical" | "remote")
            }
          >
            <option value="physical">Physical</option>
            <option value="remote">Remote</option>
          </select>
        </label>
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primary}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Job"}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
