import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  locationFilter: string;
  onLocationFilterChange: (l: string) => void;
  onCreateClick: () => void;
  totalJobs: number;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "TRANSCRIBED", label: "Transcribed" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "COMPLETED", label: "Completed" },
];

export function Layout({
  children,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  onCreateClick,
  totalJobs,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight">Reporting Workflow</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {totalJobs} job{totalJobs !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search cases..."
                  className="pl-9 w-full sm:w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v ?? "all")}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={locationFilter}
                onChange={(e) => onLocationFilterChange(e.target.value)}
                placeholder="Location..."
                className="w-full sm:w-36"
              />
              <Button onClick={onCreateClick} className="gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                New Job
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
