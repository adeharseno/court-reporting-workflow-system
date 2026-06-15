import { useState, useEffect } from "react";
import { api } from "../api.js";
import type { Payment } from "../types.js";

interface PaymentSummaryProps {
  jobId: number;
}

export function PaymentSummary({ jobId }: PaymentSummaryProps) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.jobs
      .payment(jobId)
      .then(setPayment)
      .catch(() => setError("Failed to load payment"))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <p className="text-sm text-muted-foreground py-3">Loading payment...</p>;
  if (error) return <p className="text-sm text-destructive py-3">{error}</p>;
  if (!payment) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Reporter</span>
        <span>{payment.reporterPayment.toLocaleString()} IDR</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Editor</span>
        <span>{payment.editorPayment.toLocaleString()} IDR</span>
      </div>
      <div className="flex justify-between text-sm font-semibold text-green-600 pt-2 border-t">
        <span>Total</span>
        <span>{payment.totalPayout.toLocaleString()} IDR</span>
      </div>
    </div>
  );
}
