import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "./api.js";
import type { Job } from "./types.js";
import { Layout } from "./components/Layout.js";
import { KpiCards } from "./components/KpiCards.js";
import { JobCardList } from "./components/JobCardList.js";
import { DetailDrawer } from "./components/DetailDrawer.js";
import { CreateJobDrawer } from "./components/CreateJobDrawer.js";
import { Modal } from "./components/Modal.js";
import { AssignReporter } from "./components/AssignReporter.js";
import { AssignEditor } from "./components/AssignEditor.js";
import { StatusUpdater } from "./components/StatusUpdater.js";
import { PaymentSummary } from "./components/PaymentSummary.js";

interface Stats {
  total: number;
  assigned: number;
  transcribed: number;
  completed: number;
  revenue: number;
}

export function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  const [detailJobId, setDetailJobId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [modalAction, setModalAction] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.jobs.list();
      setJobs(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.jobs.stats();
      setStats({
        total: data.total,
        assigned: data.byStatus.ASSIGNED,
        transcribed: data.byStatus.TRANSCRIBED + data.byStatus.REVIEWED,
        completed: data.byStatus.COMPLETED,
        revenue: data.revenue,
      });
    } catch {
      // Derive from jobs if stats fails
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((t) => t + 1);

  const handleSelectJob = (id: number) => {
    setDetailJobId(id);
    setDetailOpen(true);
  };

  const handleDetailClose = (open: boolean) => {
    setDetailOpen(open);
    if (!open) handleRefresh();
  };

  const handleCreateClose = (open: boolean) => {
    setCreateOpen(open);
  };

  const handleCreated = () => {
    setCreateOpen(false);
    handleRefresh();
  };

  const handleAction = (job: Job, action: string) => {
    setModalJob(job);
    setModalAction(action);
  };

  const closeModal = () => {
    setModalJob(null);
    setModalAction(null);
  };

  const handleActionDone = () => {
    closeModal();
    handleRefresh();
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSearch = job.caseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || job.status === statusFilter;
    const matchLocation =
      !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchStatus && matchLocation;
  });

  return (
    <>
      <Layout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        onCreateClick={() => setCreateOpen(true)}
        totalJobs={stats?.total ?? jobs.length}
      >
        <div className="space-y-8">
          <KpiCards stats={stats} loading={statsLoading} />
          <JobCardList
            jobs={filteredJobs}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
            onSelectJob={handleSelectJob}
            onAction={handleAction}
          />
        </div>
      </Layout>

      <DetailDrawer
        jobId={detailJobId}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onRefresh={handleRefresh}
      />

      <CreateJobDrawer
        open={createOpen}
        onOpenChange={handleCreateClose}
        onCreated={handleCreated}
      />

      <Modal
        open={!!modalAction}
        title={
          modalAction === "reporter"
            ? "Assign Reporter"
            : modalAction === "editor"
              ? "Assign Editor"
              : modalAction === "status"
                ? "Update Status"
                : modalAction === "payment"
                  ? "Payment Details"
                  : ""
        }
        onClose={closeModal}
      >
        {modalJob && modalAction === "reporter" && (
          <AssignReporter job={modalJob} onAssigned={handleActionDone} onClose={closeModal} />
        )}
        {modalJob && modalAction === "editor" && (
          <AssignEditor job={modalJob} onAssigned={handleActionDone} onClose={closeModal} />
        )}
        {modalJob && modalAction === "status" && (
          <StatusUpdater job={modalJob} onUpdated={handleActionDone} onClose={closeModal} />
        )}
        {modalJob && modalAction === "payment" && <PaymentSummary jobId={modalJob.id} />}
      </Modal>
    </>
  );
}
