import { useState, useEffect } from "react";
import { api } from "../api.js";
import type { Payment } from "../types.js";
import styles from "./PaymentSummary.module.css";

interface PaymentSummaryProps {
  jobId: number;
}

export function PaymentSummary({ jobId }: PaymentSummaryProps) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.jobs.payment(jobId).then(setPayment).catch(() => {
      setError("Failed to load payment");
    }).finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <p className={styles.loading}>Loading payment...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!payment) return null;

  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span>Reporter</span>
        <span>{payment.reporterPayment.toLocaleString()} IDR</span>
      </div>
      <div className={styles.row}>
        <span>Editor</span>
        <span>{payment.editorPayment.toLocaleString()} IDR</span>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{payment.totalPayout.toLocaleString()} IDR</span>
      </div>
    </div>
  );
}
