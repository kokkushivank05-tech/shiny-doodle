"use client";

import { useState } from "react";
import {
  Activity,
  Filter,
  Search,
  Building2,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Star,
  MessageSquare,
  ArrowUp,
  User,
} from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { mockActivities, getUserById } from "@/lib/mock-data";
import type { ActivityType } from "@/types";

const activityConfig: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  created: { label: "Created", icon: Star, color: "#6366f1" },
  updated: { label: "Updated", icon: ArrowUp, color: "#3b82f6" },
  commented: { label: "Commented", icon: MessageSquare, color: "#8b5cf6" },
  mentioned: { label: "Mentioned", icon: User, color: "#f59e0b" },
  status_changed: { label: "Status Changed", icon: Activity, color: "#ec4899" },
  assigned: { label: "Assigned", icon: User, color: "#14b8a6" },
  file_uploaded: { label: "File Uploaded", icon: Star, color: "#64748b" },
  deal_won: { label: "Deal Won 🎉", icon: Star, color: "#22c55e" },
  project_created: { label: "Project Created", icon: FolderKanban, color: "#6366f1" },
  task_completed: { label: "Task Completed", icon: CheckSquare, color: "#22c55e" },
};

const entityConfig: Record<string, { icon: React.ElementType }> = {
  customer: { icon: Building2 },
  deal: { icon: TrendingUp },
  project: { icon: FolderKanban },
  task: { icon: CheckSquare },
  contact: { icon: User },
};

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");

  const filtered = mockActivities.filter((a) => {
    const matchSearch = !search || a.entityName.toLowerCase().includes(search.toLowerCase()) || a.comment?.toLowerCase().includes(search.toLowerCase());
    const matchEntity = entityFilter === "all" || a.entityType === entityFilter;
    const matchActivityType = activityTypeFilter === "all" || a.type === activityTypeFilter;
    return matchSearch && matchEntity && matchActivityType;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header mb-4">
        <div>
          <h1 className="page-title">Activity Feed</h1>
          <p className="text-[13px] text-[var(--foreground-muted)] mt-0.5">
            Unified timeline across all entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "sos-btn sos-btn-outline py-1.5 px-3 text-[12.5px] cursor-pointer",
              filterOpen && "bg-[var(--background-muted)] border-[var(--border-strong)]"
            )}
          >
            <Filter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* Filter tab controls */}
      {filterOpen && (
        <div className="flex items-center gap-4 p-3 mb-4 sos-card bg-[var(--background-subtle)] border border-[var(--border)] rounded-xl animate-fade-in flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Entity Type:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="sos-input py-1 px-2.5 text-[12.5px] rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer"
            >
              <option value="all">All Entities</option>
              <option value="customer">Customer</option>
              <option value="deal">Deal</option>
              <option value="project">Project</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[var(--foreground-muted)]">Activity Type:</span>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value)}
              className="sos-input py-1 px-2.5 text-[12.5px] rounded-lg bg-[var(--background)] border border-[var(--border)] cursor-pointer"
            >
              <option value="all">All Activities</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="commented">Commented</option>
              <option value="status_changed">Status Changed</option>
              <option value="deal_won">Deal Won</option>
              <option value="task_completed">Task Completed</option>
            </select>
          </div>

          {(entityFilter !== "all" || activityTypeFilter !== "all") && (
            <button
              onClick={() => { setEntityFilter("all"); setActivityTypeFilter("all"); }}
              className="text-[12px] text-[var(--primary)] hover:underline ml-auto cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Feed */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity..."
                className="sos-input pl-8 py-1.5 text-[13px]"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--border)]" />

            <div className="space-y-4">
              {filtered.map((activity, i) => {
                const user = getUserById(activity.userId);
                const actCfg = activityConfig[activity.type] ?? activityConfig.created;
                const entCfg = entityConfig[activity.entityType] ?? entityConfig.customer;
                const EntIcon = entCfg.icon;
                const ActIcon = actCfg.icon;

                return (
                  <div key={activity.id} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    {/* Avatar (over timeline) */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                      style={{ background: actCfg.color }}
                    >
                      <ActIcon size={16} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="sos-card flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-[13.5px] text-[var(--foreground)]">
                              {user?.displayName ?? "Someone"}
                            </span>
                            <span className="text-[12.5px] text-[var(--foreground-muted)]">
                              {actCfg.label.toLowerCase()}
                            </span>
                            <span className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--primary)]">
                              <EntIcon size={12} />
                              {activity.entityName}
                            </span>
                          </div>
                          {activity.comment && (
                            <p className="text-[13px] text-[var(--foreground)] bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg px-3 py-2 mt-2">
                              &ldquo;{activity.comment}&rdquo;
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--foreground-subtle)] flex-shrink-0">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="empty-state">
                  <Activity size={36} className="mb-3 opacity-30" />
                  <p className="font-medium text-[var(--foreground)]">No activity found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: stats */}
        <div className="space-y-4">
          <div className="sos-card p-5">
            <h3 className="text-[13.5px] font-semibold text-[var(--foreground)] mb-3">Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Deal Won", count: mockActivities.filter((a) => a.type === "deal_won").length, color: "#22c55e" },
                { label: "Projects Created", count: mockActivities.filter((a) => a.type === "project_created").length, color: "#6366f1" },
                { label: "Comments", count: mockActivities.filter((a) => a.type === "commented").length, color: "#8b5cf6" },
                { label: "Status Changes", count: mockActivities.filter((a) => a.type === "status_changed").length, color: "#ec4899" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[12.5px] text-[var(--foreground-muted)]">{s.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sos-card p-5">
            <h3 className="text-[13.5px] font-semibold text-[var(--foreground)] mb-3">Top Contributors</h3>
            <div className="space-y-2">
              {["user_2", "user_1", "user_4", "user_3"].map((uid) => {
                const user = getUserById(uid);
                const count = mockActivities.filter((a) => a.userId === uid).length;
                if (!user) return null;
                return (
                  <div key={uid} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-white">
                      {getInitials(user.displayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-[var(--foreground)] truncate">{user.displayName}</p>
                    </div>
                    <span className="text-[12px] font-semibold text-[var(--primary)]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
