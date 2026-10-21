<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth.svelte';
  import { api, ApiError } from '../lib/api';
  import type { AdminMetrics, ProfileResponse } from '../lib/types';

  let profile = $state<ProfileResponse | null>(null);
  let loadError = $state<string | null>(null);

  // Demonstrates that the SERVER enforces RBAC: this admin-only endpoint
  // returns 200 for admins but 403 for regular users, no matter what the UI shows.
  let probeResult = $state<string | null>(null);
  let probeIsSuccess = $state(false);
  let probeBusy = $state(false);

  let tokenIssuedAt = $state<string | null>(null);
  let tokenExpiresAt = $state<string | null>(null);

  function decodeToken(token: string): { iat: number; exp: number } | null {
    try {
      const part = token.split('.')[1] ?? '';
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = window.atob(normalized);
      return JSON.parse(json) as { iat: number; exp: number };
    } catch {
      return null;
    }
  }

  onMount(async () => {
    const token = auth.token;
    if (token !== null) {
      const claims = decodeToken(token);
      if (claims !== null) {
        tokenIssuedAt = new Date(claims.iat * 1000).toLocaleTimeString();
        tokenExpiresAt = new Date(claims.exp * 1000).toLocaleTimeString();
      }
    }

    try {
      profile = await api<ProfileResponse>('/user/profile');
    } catch (err) {
      loadError = err instanceof ApiError ? err.message : 'Could not load profile.';
    }
  });

  async function probeAdminEndpoint(): Promise<void> {
    probeBusy = true;
    probeResult = null;
    try {
      const metrics = await api<AdminMetrics>('/admin/metrics');
      probeIsSuccess = true;
      probeResult =
        `200 OK — you are an admin. Users: ${metrics.totalUsers}, uptime: ${metrics.uptimeSeconds}s`;
    } catch (err) {
      probeIsSuccess = false;
      if (err instanceof ApiError) {
        probeResult = `${err.status} ${err.status === 403 ? 'Forbidden' : 'Error'} — ${err.message}`;
      } else {
        probeResult = 'Unexpected error.';
      }
    } finally {
      probeBusy = false;
    }
  }
</script>

<h1>Dashboard <span class="badge {auth.isAdmin ? 'badge-admin' : 'badge-user'}">{auth.user?.role}</span></h1>
<p class="muted">Protected view — any authenticated user can reach this page.</p>

{#if loadError}
  <p class="alert-error">{loadError}</p>
{:else if profile}
  <section class="card">
    <h2>Profile — <code class="success">GET /api/user/profile</code></h2>
    <p>{profile.message}</p>
    <table class="table">
      <tbody>
        <tr><th>Username</th><td>{profile.user.username}</td></tr>
        <tr><th>Email</th><td>{profile.user.email}</td></tr>
        <tr><th>Role</th><td>{profile.user.role}</td></tr>
        <tr><th>Member since</th><td>{new Date(profile.user.createdAt).toLocaleString()}</td></tr>
        <tr><th>Account age</th><td>{profile.accountAgeDays} day(s)</td></tr>
      </tbody>
    </table>
  </section>
{:else}
  <p class="muted">Loading profile…</p>
{/if}

{#if tokenIssuedAt !== null && tokenExpiresAt !== null}
  <section class="card">
    <h2>Your JWT session</h2>
    <p>
      Issued at <code>{tokenIssuedAt}</code> · expires at <code>{tokenExpiresAt}</code> (1h lifetime).
      After expiry the server returns <code class="danger">401</code> and you must log in again.
    </p>
  </section>
{/if}

<section class="card">
  <h2>RBAC probe — try the <em>admin-only</em> endpoint</h2>
  <p>
    This calls <code>GET /api/admin/metrics</code> with your current token. The <strong>server</strong>,
    not the UI, decides the outcome: Admins get <code class="success">200</code>, regular users get
    <code class="danger">403</code>.
  </p>
  <button class="btn" onclick={probeAdminEndpoint} disabled={probeBusy}>
    {probeBusy ? 'Probing…' : 'Call /api/admin/metrics'}
  </button>
  {#if probeResult !== null}
    <p class={probeIsSuccess ? 'alert-success' : 'alert-error'} style="margin-top: 0.75rem;">
      {probeResult}
    </p>
  {/if}
</section>
