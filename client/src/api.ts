const BASE = "/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]> | null,
  ) {
    super(message);
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new ApiError(
      body.message || "Request failed",
      res.status,
      body.errors,
    );
  }
  return body.data as T;
}

export const api = {
  reporters: {
    list: () => apiFetch<import("./types.js").Reporter[]>("/reporters"),
    create: (data: { name: string; location: string; ratePerMinute: number }) =>
      apiFetch<import("./types.js").Reporter>("/reporters", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  editors: {
    list: () => apiFetch<import("./types.js").Editor[]>("/editors"),
    create: (data: { name: string; flatFee: number }) =>
      apiFetch<import("./types.js").Editor>("/editors", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  jobs: {
    list: (page = 1, limit = 20) =>
      apiFetch<import("./types.js").Job[]>(
        `/jobs?page=${page}&limit=${limit}`,
      ),
    get: (id: number) =>
      apiFetch<import("./types.js").Job>(`/jobs/${id}`),
    create: (data: {
      caseName: string;
      durationMinutes: number;
      location: string;
      locationType: string;
    }) =>
      apiFetch<import("./types.js").Job>("/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    assignReporter: (jobId: number, reporterId: number) =>
      apiFetch<import("./types.js").Job>(
        `/jobs/${jobId}/assign-reporter`,
        { method: "POST", body: JSON.stringify({ reporterId }) },
      ),
    assignEditor: (jobId: number, editorId: number) =>
      apiFetch<import("./types.js").Job>(
        `/jobs/${jobId}/assign-editor`,
        { method: "POST", body: JSON.stringify({ editorId }) },
      ),
    updateStatus: (jobId: number, status: string) =>
      apiFetch<import("./types.js").Job>(`/jobs/${jobId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    payment: (jobId: number) =>
      apiFetch<import("./types.js").Payment>(`/jobs/${jobId}/payment`),
  },
};
