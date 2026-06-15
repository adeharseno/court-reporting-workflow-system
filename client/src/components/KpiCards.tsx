import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, UserCheck, FileText, CheckCircle2, DollarSign } from "lucide-react";

interface Stats {
  total: number;
  assigned: number;
  transcribed: number;
  completed: number;
  revenue: number;
}

interface KpiCardsProps {
  stats: Stats | null;
  loading: boolean;
}

const metrics = [
  { key: "total" as const, label: "Total Jobs", icon: LayoutDashboard },
  { key: "assigned" as const, label: "Assigned", icon: UserCheck },
  { key: "transcribed" as const, label: "Transcribed", icon: FileText },
  { key: "completed" as const, label: "Completed", icon: CheckCircle2 },
  { key: "revenue" as const, label: "Revenue", icon: DollarSign, format: true },
];

export function KpiCards({ stats, loading }: KpiCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <Card key={m.key} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 w-16 bg-muted rounded mb-3" />
              <div className="h-7 w-12 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        const value = m.format
          ? `${stats[m.key].toLocaleString()} IDR`
          : stats[m.key];

        return (
          <Card key={m.key} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{m.label}</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
