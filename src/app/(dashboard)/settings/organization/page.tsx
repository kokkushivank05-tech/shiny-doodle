"use client";

import { useState } from "react";
import { Save, Globe, DollarSign, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function OrganizationSettingsPage() {
  const { organization } = useAuthStore();
  const [orgName, setOrgName] = useState(organization?.name ?? "");
  const [website, setWebsite] = useState(organization?.website ?? "");
  const [timezone, setTimezone] = useState(organization?.timezone ?? "America/New_York");
  const [currency, setCurrency] = useState(organization?.currency ?? "USD");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Organization settings saved");
  };

  return (
    <div className="space-y-4">
      <div className="sos-card p-5">
        <h2 className="text-[14px] font-semibold text-[var(--foreground)] mb-4">Organization Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">Organization Name</label>
            <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="sos-input" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">Website</label>
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
              <input value={website} onChange={(e) => setWebsite(e.target.value)} className="sos-input pl-8" placeholder="company.com" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">Timezone</label>
            <div className="relative">
              <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="sos-input pl-8">
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground-muted)] mb-1.5">Currency</label>
            <div className="relative">
              <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="sos-input pl-8">
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="INR">INR — Indian Rupee</option>
                <option value="CAD">CAD — Canadian Dollar</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="sos-btn sos-btn-primary">
            <Save size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Plan info */}
      <div className="sos-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-[var(--foreground)]">Current Plan</h2>
            <p className="text-[13px] text-[var(--foreground-muted)] mt-1">You are on the <span className="font-semibold text-[var(--primary)] capitalize">{organization?.plan}</span> plan.</p>
          </div>
          <span className="badge-success text-[12px] font-medium px-2 py-1 rounded-full capitalize">{organization?.status}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Users", used: 5, total: 20 },
            { label: "Projects", used: 4, total: 50 },
            { label: "Storage", used: "2.4 GB", total: "50 GB" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg">
              <p className="text-[11.5px] text-[var(--foreground-muted)] mb-1">{item.label}</p>
              <p className="text-[14px] font-bold text-[var(--foreground)]">{item.used} <span className="text-[12px] font-normal text-[var(--foreground-subtle)]">/ {item.total}</span></p>
            </div>
          ))}
        </div>
        <button className="mt-4 sos-btn sos-btn-primary">Upgrade Plan</button>
      </div>

      {/* Danger zone */}
      <div className="sos-card p-5 border-[var(--danger)] border-opacity-30" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
        <h2 className="text-[14px] font-semibold text-[var(--danger)] mb-2">Danger Zone</h2>
        <p className="text-[12.5px] text-[var(--foreground-muted)] mb-3">Permanently delete this organization and all its data.</p>
        <button className="sos-btn bg-[var(--danger)] text-white hover:opacity-90">Delete Organization</button>
      </div>
    </div>
  );
}
