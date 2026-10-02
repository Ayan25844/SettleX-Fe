'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/settlex'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-provider'
import {
  User,
  UserRole,
  getAdminUsers,
  activateUser,
  deactivateUser,
  changeUserRole,
  ApiError,
} from '@/lib/api'

function AdminDashboardContent() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminUsers()
      setUsers(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load user registry from backend.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const stats = useMemo(() => {
    const total = users.length
    const borrowers = users.filter((u) => u.role === 'borrower').length
    const lenders = users.filter((u) => u.role === 'lender').length
    const admins = users.filter((u) => u.role === 'admin').length
    const active = users.filter((u) => u.is_active).length
    const inactive = users.filter((u) => !u.is_active).length

    return { total, borrowers, lenders, admins, active, inactive }
  }, [users])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  async function handleToggleStatus(targetUser: User) {
    setActionSuccess(null)
    setActionError(null)
    setActionLoadingId(targetUser.id)

    try {
      let updated: User
      if (targetUser.is_active) {
        updated = await deactivateUser(targetUser.id)
        setActionSuccess(`User "${targetUser.full_name}" was deactivated successfully.`)
      } else {
        updated = await activateUser(targetUser.id)
        setActionSuccess(`User "${targetUser.full_name}" was activated successfully.`)
      }

      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message)
      } else {
        setActionError('Failed to update user status.')
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleRoleChange(targetUser: User, newRole: UserRole) {
    if (targetUser.role === newRole) return

    setActionSuccess(null)
    setActionError(null)
    setActionLoadingId(targetUser.id)

    try {
      const updated = await changeUserRole(targetUser.id, newRole)
      setActionSuccess(`User "${targetUser.full_name}" role changed to ${newRole}.`)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message)
      } else {
        setActionError('Failed to update user role.')
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-xs text-primary">
              <Shield size={13} /> SettleX Administration Console
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              User Management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review platform participants, control account activation, and manage administrative privileges.
            </p>
          </div>

          <button
            onClick={() => void fetchUsers()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.02] px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-white/[0.05] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Global Feedback Notifications */}
        {actionSuccess && (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-xs text-emerald-400/80 hover:text-emerald-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {actionError && (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-xs text-destructive/80 hover:text-destructive"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={16} />
              <span className="text-xs">Total Users</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={16} />
              <span className="text-xs">Borrowers</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{stats.borrowers}</p>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sky-400">
              <Building2 size={16} />
              <span className="text-xs">Lenders</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-sky-400">{stats.lenders}</p>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={16} />
              <span className="text-xs">Admins</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-primary">{stats.admins}</p>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <UserCheck size={16} />
              <span className="text-xs">Active</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{stats.active}</p>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserX size={16} />
              <span className="text-xs">Inactive</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-muted-foreground">{stats.inactive}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full max-w-sm rounded-xl border border-border bg-white/[.03] px-3.5 text-xs text-foreground outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Role filter:</span>
            {(['all', 'borrower', 'lender', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                  roleFilter === r
                    ? 'border border-primary/30 bg-primary/15 font-medium text-primary'
                    : 'border border-border text-muted-foreground hover:border-white/20'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="glass mt-4 overflow-hidden rounded-2xl border border-border">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Loading users...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle size={32} className="text-destructive" />
              <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
              <button
                onClick={() => void fetchUsers()}
                className="mt-4 rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-semibold hover:border-primary/50"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {searchQuery || roleFilter !== 'all'
                ? 'No users match your search and filter criteria.'
                : 'No users registered on the platform yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Created</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser?.id === u.id
                    const isRowBusy = actionLoadingId === u.id

                    return (
                      <tr key={u.id} className="transition hover:bg-white/[0.015]">
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">{u.full_name}</div>
                          {isSelf && (
                            <span className="text-[10px] text-primary font-medium">
                              (Current session)
                            </span>
                          )}
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {u.email}
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'border border-primary/30 bg-primary/15 text-primary'
                                : u.role === 'borrower'
                                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                  : 'border border-sky-400/30 bg-sky-400/10 text-sky-400'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/10 px-2.5 py-0.5 text-[10px] font-semibold text-destructive">
                              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role selector dropdown */}
                            <select
                              value={u.role}
                              onChange={(e) =>
                                void handleRoleChange(u, e.target.value as UserRole)
                              }
                              disabled={isRowBusy || (isSelf && stats.admins <= 1)}
                              aria-label={`Change role for ${u.full_name}`}
                              className="h-8 rounded-lg border border-border bg-card px-2 text-xs text-foreground outline-none transition focus:border-primary/50 disabled:opacity-50"
                            >
                              <option value="borrower">Borrower</option>
                              <option value="lender">Lender</option>
                              <option value="admin">Admin</option>
                            </select>

                            {/* Activate / Deactivate button */}
                            {u.is_active ? (
                              <button
                                onClick={() => void handleToggleStatus(u)}
                                disabled={isRowBusy || isSelf}
                                title={
                                  isSelf
                                    ? 'Cannot deactivate your own administrator account'
                                    : 'Deactivate user account'
                                }
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 text-xs font-medium text-destructive transition hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {isRowBusy ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <UserX size={12} />
                                )}
                                <span>Deactivate</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => void handleToggleStatus(u)}
                                disabled={isRowBusy}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {isRowBusy ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Check size={12} />
                                )}
                                <span>Activate</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
