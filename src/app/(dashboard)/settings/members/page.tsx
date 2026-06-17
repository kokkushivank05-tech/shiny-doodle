"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Shield,
  Crown,
  Briefcase,
  FolderKanban,
  User,
  Eye,
  Copy,
  UserX,
  UserCheck,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { mockUsers } from "@/lib/mock-data";
import { toast } from "sonner";
import type { UserRole, User } from "@/types";
import { useAuthStore } from "@/stores/auth.store";

// ── Role config ───────────────────────────────────────────────
const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
  super_owner: { label: "Super Owner", icon: Crown,          color: "#f59e0b" },
  owner:        { label: "Owner",       icon: Crown,          color: "#6366f1" },
  admin:        { label: "Admin",       icon: Shield,         color: "#8b5cf6" },
  sales_manager:   { label: "Sales Manager",   icon: Briefcase,   color: "#3b82f6" },
  project_manager: { label: "Project Manager", icon: FolderKanban, color: "#22c55e" },
  team_member:  { label: "Team Member", icon: User,           color: "#64748b" },
  intern:       { label: "Intern",      icon: User,           color: "#0ea5e9" },
  client:       { label: "Client",      icon: Eye,            color: "#94a3b8" },
};

const ASSIGNABLE_ROLES: UserRole[] = [
  "admin", "sales_manager", "project_manager", "team_member", "intern", "client",
];

// ── Member row dropdown ───────────────────────────────────────
interface MemberMenuProps {
  userId: string;
  isActive: boolean;
  onEdit: () => void;
  onToggleActive: () => void;
  onRemove: () => void;
  onCopyEmail: () => void;
}

function MemberMenu({ userId, isActive, onEdit, onToggleActive, onRemove, onCopyEmail }: MemberMenuProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const action = (fn: () => void) => { fn(); setOpen(false); };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "sos-btn sos-btn-ghost p-1.5 rounded-lg transition-colors",
          open && "bg-[var(--background-muted)]"
        )}
        aria-label="Member options"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className={cn(
            "absolute right-0 top-[calc(100%+4px)] w-[192px] z-50",
            "bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl",
            "animate-scale-in origin-top-right py-1"
          )}
        >
          <button
            onClick={() => action(onEdit)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] transition-colors"
          >
            <Pencil size={13} className="flex-shrink-0" />
            Edit Role
          </button>

          <button
            onClick={() => action(onCopyEmail)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] transition-colors"
          >
            <Copy size={13} className="flex-shrink-0" />
            Copy Email
          </button>

          <div className="my-1 border-t border-[var(--border)]" />

          <button
            onClick={() => action(onToggleActive)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)] transition-colors"
          >
            {isActive ? (
              <><UserX size={13} className="flex-shrink-0" />Deactivate</>
            ) : (
              <><UserCheck size={13} className="flex-shrink-0" />Reactivate</>
            )}
          </button>

          <div className="my-1 border-t border-[var(--border)]" />

          <button
            onClick={() => action(onRemove)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition-colors"
          >
            <Trash2 size={13} className="flex-shrink-0" />
            Remove Member
          </button>
        </div>
      )}
    </div>
  );
}

// ── Edit Role modal ───────────────────────────────────────────
interface EditRoleModalProps {
  user: (typeof mockUsers)[0] | null;
  currentRole: UserRole;
  onClose: () => void;
  onSave: (role: UserRole) => void;
}

function EditRoleModal({ user, currentRole, onClose, onSave }: EditRoleModalProps) {
  const [selected, setSelected] = useState<UserRole>(currentRole);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onSave(selected);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      <div className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
        "w-full max-w-[420px] mx-4",
        "bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl",
        "animate-scale-in"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Change Role</h3>
            <p className="text-[12px] text-[var(--foreground-muted)] mt-0.5">{user.displayName} · {user.email}</p>
          </div>
          <button onClick={onClose} className="sos-btn sos-btn-ghost p-1.5"><X size={15} /></button>
        </div>

        {/* Role options */}
        <div className="p-4 space-y-2">
          {ASSIGNABLE_ROLES.map((role) => {
            const cfg = roleConfig[role];
            const Icon = cfg.icon;
            const isSelected = selected === role;
            return (
              <button
                key={role}
                onClick={() => setSelected(role)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--primary-subtle)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--background-subtle)]"
                )}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${cfg.color}22` }}
                >
                  <Icon size={15} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--foreground)]">{cfg.label}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-[var(--border)] bg-[var(--background-subtle)] rounded-b-xl">
          <button onClick={onClose} className="sos-btn sos-btn-outline flex-1 justify-center">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || selected === currentRole}
            className="sos-btn sos-btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Role"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function MembersSettingsPage() {
  const { user } = useAuthStore();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("team_member");
  const [inviting, setInviting] = useState(false);
  const [members, setMembers] = useState(mockUsers);
  const [editingUser, setEditingUser] = useState<(typeof mockUsers)[0] | null>(null);

  const handleInvite = async () => {
    if (!inviteEmail || !inviteName) {
      toast.error("Please enter both name and email");
      return;
    }
    setInviting(true);
    await new Promise((r) => setTimeout(r, 800));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      organizationId: "org_1",
      createdBy: "system",
      updatedBy: "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      firebaseUid: `mock_${Date.now()}`,
      email: inviteEmail,
      displayName: inviteName,
      role: inviteRole,
      isActive: true,
      notificationPreferences: {
        inApp: true, email: true, push: false, taskAssigned: true, dealUpdates: true, mentions: true, dueDates: true, comments: true
      }
    };

    setMembers((prev) => [...prev, newUser]);
    setInviting(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("team_member");
    toast.success(`Employee ${inviteName} added successfully`);
  };

  const handleToggleActive = (userId: string) => {
    setMembers((prev) =>
      prev.map((m) => m.id === userId ? { ...m, isActive: !m.isActive } : m)
    );
    const member = members.find((m) => m.id === userId);
    if (member) {
      toast.success(
        member.isActive
          ? `${member.displayName} has been deactivated`
          : `${member.displayName} has been reactivated`
      );
    }
  };

  const handleRemove = (userId: string) => {
    const member = members.find((m) => m.id === userId);
    setMembers((prev) => prev.filter((m) => m.id !== userId));
    if (member) toast.success(`${member.displayName} removed from organization`);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      toast.success(`Copied ${email}`);
    }).catch(() => {
      toast.error("Clipboard not available");
    });
  };

  const handleSaveRole = (newRole: UserRole) => {
    if (!editingUser) return;
    setMembers((prev) =>
      prev.map((m) => m.id === editingUser.id ? { ...m, role: newRole } : m)
    );
    toast.success(`${editingUser.displayName}'s role updated to ${roleConfig[newRole].label}`);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4">
      {/* Add New Employee (Owner Only) */}
      {user?.role === "owner" && (
        <div className="sos-card p-5">
          <h2 className="text-[14px] font-semibold text-[var(--foreground)] mb-1">Add New Employee</h2>
          <p className="text-[12.5px] text-[var(--foreground-muted)] mb-4">
            Add a new employee to your organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="sos-input flex-1 w-full"
            />
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
              placeholder="employee@company.com"
              className="sos-input flex-1 w-full"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <div className="relative w-full sm:w-auto">
              <select 
                className="sos-input w-full sm:w-40 appearance-none pr-7"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
              >
                {ASSIGNABLE_ROLES.map(role => (
                  <option key={role} value={role}>{roleConfig[role].label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] pointer-events-none" />
            </div>
            <button onClick={handleInvite} disabled={inviting} className="sos-btn sos-btn-primary flex-shrink-0 w-full sm:w-auto cursor-pointer">
              <Plus size={13} />
              {inviting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="sos-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <h2 className="text-[14px] font-semibold text-[var(--foreground)]">
            Team Members <span className="text-[var(--foreground-subtle)] font-normal">({members.length})</span>
          </h2>
        </div>

        {members.length === 0 && (
          <div className="py-10 text-center text-[13px] text-[var(--foreground-muted)]">
            No members yet. Invite your team above.
          </div>
        )}

        {members.map((user) => {
          const roleCfg = roleConfig[user.role];
          const RoleIcon = roleCfg.icon;
          return (
            <div
              key={user.id}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-subtle)] transition-colors"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                {getInitials(user.displayName)}
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-[var(--foreground)]">{user.displayName}</p>
                <p className="text-[12px] text-[var(--foreground-muted)]">{user.email}</p>
              </div>

              {/* Role */}
              <div className="hidden sm:flex items-center gap-1.5">
                <RoleIcon size={13} style={{ color: roleCfg.color }} />
                <span className="text-[12.5px] text-[var(--foreground-muted)]">{roleCfg.label}</span>
              </div>

              {/* Active badge */}
              <span className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full hidden md:block",
                user.isActive ? "badge-success" : "badge-danger"
              )}>
                {user.isActive ? "Active" : "Inactive"}
              </span>

              {/* Three-dot menu */}
              <MemberMenu
                userId={user.id}
                isActive={user.isActive}
                onEdit={() => setEditingUser(user)}
                onToggleActive={() => handleToggleActive(user.id)}
                onRemove={() => handleRemove(user.id)}
                onCopyEmail={() => handleCopyEmail(user.email)}
              />
            </div>
          );
        })}
      </div>

      {/* Role permissions */}
      <div className="sos-card p-5">
        <h2 className="text-[14px] font-semibold text-[var(--foreground)] mb-3">Role Permissions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][])
            .filter(([r]) => r !== "super_owner")
            .map(([role, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={role} className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--background-subtle)] border border-[var(--border)]">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}20` }}>
                    <Icon size={13} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-[12.5px] font-medium text-[var(--foreground)]">{cfg.label}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Edit role modal */}
      <EditRoleModal
        user={editingUser}
        currentRole={editingUser?.role ?? "team_member"}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveRole}
      />
    </div>
  );
}
