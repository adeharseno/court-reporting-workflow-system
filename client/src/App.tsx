import { useState, useCallback } from "react";
import { Layout } from "./components/Layout.js";
import { JobList } from "./components/JobList.js";
import { JobDetail } from "./components/JobDetail.js";
import { CreateJobForm } from "./components/CreateJobForm.js";
import styles from "./App.module.css";

type View = "list" | "detail";

export function App() {
  const [view, setView] = useState<View>("list");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSelectJob = useCallback((id: number) => {
    setSelectedJobId(id);
    setView("detail");
  }, []);

  const handleBack = useCallback(() => {
    setView("list");
    setSelectedJobId(null);
    setRefreshTrigger((t) => t + 1);
  }, []);

  const handleJobCreated = useCallback(() => {
    setShowCreateForm(false);
    setRefreshTrigger((t) => t + 1);
  }, []);

  return (
    <Layout>
      {view === "list" && (
        <>
          <div className={styles.toolbar}>
            <button
              className={styles.createBtn}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "+ New Job"}
            </button>
          </div>
          {showCreateForm && (
            <div className={styles.createPanel}>
              <CreateJobForm
                onCreated={handleJobCreated}
                onClose={() => setShowCreateForm(false)}
              />
            </div>
          )}
          <JobList
            refreshTrigger={refreshTrigger}
            onSelectJob={handleSelectJob}
          />
        </>
      )}
      {view === "detail" && selectedJobId !== null && (
        <JobDetail jobId={selectedJobId} onBack={handleBack} />
      )}
    </Layout>
  );
}
