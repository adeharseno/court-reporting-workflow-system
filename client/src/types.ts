export type LocationType = "physical" | "remote";

export type JobStatus =
  | "NEW"
  | "ASSIGNED"
  | "TRANSCRIBED"
  | "REVIEWED"
  | "COMPLETED";

export interface Reporter {
  id: number;
  name: string;
  location: string;
  availability: boolean;
  ratePerMinute: number;
}

export interface Editor {
  id: number;
  name: string;
  flatFee: number;
}

export interface Job {
  id: number;
  caseName: string;
  durationMinutes: number;
  location: string;
  locationType: LocationType;
  status: JobStatus;
  reporterId: number | null;
  editorId: number | null;
  createdAt: string;
  updatedAt: string;
  reporter: Reporter | null;
  editor: Editor | null;
}

export interface Payment {
  reporterPayment: number;
  editorPayment: number;
  totalPayout: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]> | null;
}

export const VALID_TRANSITIONS: Record<JobStatus, JobStatus | null> = {
  NEW: "ASSIGNED",
  ASSIGNED: "TRANSCRIBED",
  TRANSCRIBED: "REVIEWED",
  REVIEWED: "COMPLETED",
  COMPLETED: null,
};
