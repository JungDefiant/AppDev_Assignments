<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth.svelte';
  import { api, ApiError } from '../lib/api';
  import type { AdminMetrics, AdminUsersResponse, SessionUser } from '../lib/types';

  let users = $state<SessionUser[]>([]);
  let metrics = $state<AdminMetrics | null>(null);
  let loadError = $state<string | null>(null);
  let actionMessage = $state<string | null>(null);

  async function loadAll(): Promise<void> {
    loadError = null;
    try {
      const [usersRes, metricsRes] = await Promise.all([
        api<AdminUsersResponse>('/admin/users'),
        api<AdminMetrics>('/admin/metrics'),
      ]);
      users = usersRes.users;
      metrics = metricsRes;
    } catch (err) {
      loadError = err instanceof ApiError ? err.message : 'Could not load admin data.';
    }
  }

  onMount(() => {
    void loadAll();
  });

  async function deleteUser(user: SessionUser): Promise<void> {
    actionMessage = null;
    const confirmed = window.confirm(`Delete user "${user.username}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    try {
      await api(`/admin/users/${user.id}`, { method: 'DELETE' });
      actionMessage = `Deleted ${user.username}.`;
      await loadAll();
    } catch (err) {
      actionMessage = err instanceof ApiError ? err.message : 'Delete failed.';
    }
  }
</script>

<h1>Admin <span class="badge badge-admin">restricted</span></h1>
<p class="muted">
  This view is backed by admin-only endpoints guarded by
  <code>authenticate + requireRole('admin')</code>. A regular user calling these APIs gets
  <code class="danger">403 Forbidden</code>.
</p>

{#if loadError}
  <p class="alert-error">{loadError}</p>
{/if}

{#if metrics}
  <section class="card">
    <h2>System metrics — <code>GET /api/admin/metrics</code></h2>
    <table class="table">
      <tbody>
        <tr><th>Total users</th><td>{metrics.totalUsers}</td></tr>
        <tr><th>Admins</th><td>{metrics.adminUsers}</td></tr>
        <tr><th>Regular users</th><td>{metrics.userUsers}</td></tr>
        <tr><th>Server uptime</th><td>{metrics.uptimeSeconds}s</td></tr>
        <tr><th>Memory (RSS)</th><td>{metrics.memoryRssMb} MB</td></tr>
      </tbody>
    </table>
  </section>
{/if}

<section class="card">
  <h2>User management — <code>GET /api/admin/users</code></h2>
  {#if users.length === 0}
    <p class="muted">No users registered yet.</p>
  {:else}
    <table class="table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Registered</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each users as user (user.id)}
          <tr>
            <td>{user.username}{#if user.id === auth.user?.id} <span class="muted">(you)</span>{/if}</td>
            <td>{user.email}</td>
            <td>
              <span class="badge {user.role === 'admin' ? 'badge-admin' : 'badge-user'}">{user.role}</span>
            </td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              {#if user.id !== auth.user?.id}
                <button class="btn btn-danger" onclick={() => deleteUser(user)}>Delete</button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  {#if actionMessage}
    <p class="alert-success" style="margin-top: 0.75rem;">{actionMessage}</p>
  {/if}
</section>
