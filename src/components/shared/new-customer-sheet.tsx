"use client";

import { useState } from "react";
import {
  X,
  Building2,
  Globe,
  MapPin,
  Tag,
  ChevronDown,
  DollarSign,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CustomerStatus, Industry } from "@/types";

interface NewCustomerSheetProps {
  open: boolean;
  onClose: () => void;
}

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "media", label: "Media" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

const STATUSES: { value: CustomerStatus; label: string; color: string }[] = [
  { value: "lead", label: "Lead", color: "#3b82f6" },
  { value: "prospect", label: "Prospect", color: "#f59e0b" },
  { value: "customer", label: "Customer", color: "#22c55e" },
  { value: "churned", label: "Churned", color: "#ef4444" },
];

export function NewCustomerSheet({ open, onClose }: NewCustomerSheetProps) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "" as Industry | "",
    status: "lead" as CustomerStatus,
    revenue: "",
    employeeCount: "",
    city: "",
    country: "",
    tags: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success(`Customer "${form.name}" added successfully!`);
    onClose();
    setForm({
      name: "",
      website: "",
      industry: "",
      status: "lead",
      revenue: "",
      employeeCount: "",
      city: "",
      country: "",
      tags: "",
      notes: "",
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-[440px] z-50",
          "bg-[var(--background)] border-l border-[var(--border)]",
          "flex flex-col shadow-2xl animate-slide-in-right"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Building2 size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[var(--foreground)]">New Customer</h2>
              <p className="text-[11.5px] text-[var(--foreground-muted)]">Add a company or lead</p>
            </div>
          </div>
          <button onClick={onClose} className="sos-btn sos-btn-ghost p-1.5" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">

            {/* Company name */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                Company Name <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="sos-input"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                Website
              </label>
              <div className="relative">
                <Globe size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
                <input
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="company.com"
                  className="sos-input pl-8"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-2">
                Status
              </label>
              <div className="flex items-center gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set("status", s.value)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                      form.status === s.value
                        ? "border-transparent text-white"
                        : "border-[var(--border)] text-[var(--foreground-muted)] bg-[var(--background-muted)] hover:border-[var(--border-strong)]"
                    )}
                    style={form.status === s.value ? { background: s.color } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                Industry
              </label>
              <div className="relative">
                <select
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                  className="sos-input appearance-none pr-8"
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] pointer-events-none" />
              </div>
            </div>

            {/* Revenue + Employees */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                  <DollarSign size={11} className="inline" /> Annual Revenue
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--foreground-subtle)]">$</span>
                  <input
                    type="number"
                    value={form.revenue}
                    onChange={(e) => set("revenue", e.target.value)}
                    placeholder="0"
                    className="sos-input pl-6"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                  <Users size={11} className="inline" /> Employees
                </label>
                <input
                  type="number"
                  value={form.employeeCount}
                  onChange={(e) => set("employeeCount", e.target.value)}
                  placeholder="e.g. 500"
                  className="sos-input"
                  min="1"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                  <MapPin size={11} className="inline mr-0.5" /> City
                </label>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="San Francisco"
                  className="sos-input"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                  Country
                </label>
                <input
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="USA"
                  className="sos-input"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">
                <Tag size={11} className="inline mr-1" />Tags
                <span className="text-[11px] text-[var(--foreground-subtle)] ml-1">(comma-separated)</span>
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="enterprise, strategic, saas"
                className="sos-input"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any additional context about this company..."
                rows={3}
                className="sos-input resize-none"
              />
            </div>

            {/* Live preview */}
            {form.name && (
              <div className="p-3 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)] animate-fade-in">
                <p className="text-[11.5px] font-medium text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--background-muted)] border border-[var(--border)] flex items-center justify-center text-[12px] font-bold text-[var(--foreground-muted)]">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--foreground)]">{form.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {form.website && (
                        <p className="text-[11.5px] text-[var(--foreground-muted)]">{form.website}</p>
                      )}
                      <span
                        className={cn("text-[10.5px] font-medium px-1.5 py-0.5 rounded-full",
                          form.status === "lead" ? "badge-info" :
                          form.status === "prospect" ? "badge-warning" :
                          form.status === "customer" ? "badge-success" : "badge-danger"
                        )}
                      >
                        {STATUSES.find((s) => s.value === form.status)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-[var(--border)] bg-[var(--background-subtle)]">
          <button type="button" onClick={onClose} className="sos-btn sos-btn-outline flex-1 justify-center">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name.trim()}
            className="sos-btn sos-btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Building2 size={13} />
            {saving ? "Adding..." : "Add Customer"}
          </button>
        </div>
      </div>
    </>
  );
}
