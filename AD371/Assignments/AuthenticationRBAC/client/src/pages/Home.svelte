<script lang="ts">
  import { onMount } from 'svelte';
  import { api, ApiError } from '../lib/api';
  import type { PublicStats } from '../lib/types';

  let stats = $state<PublicStats | null>(null);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      stats = await api<PublicStats>('/public/stats');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Could not reach the public API.';
    }
  });
</script>

<h1>Authentication & Role-Based Access Control</h1>
<p class="muted">
  A lightweight full-stack demo: <strong>Node.js + Express</strong> backend with bcrypt password
  hashing and JWT tokens, plus a <strong>Svelte + TypeScript</strong> frontend. Registrate, sign
  in, and watch how three access tiers behave.
</p>

<section class="card">
  <h2>Public endpoint — <code>GET /api/public/stats</code></h2>
  {#if error}
    <p class="alert-error">{error}</p>
  {:else if stats}
    <p>{stats.message}</p>
    <ul>
      <li>Registered users: <code>{stats.registeredUsers}</code></li>
      <li>Server time: <code>{stats.serverTime}</code></li>
    </ul>
  {:else}
    <p class="muted">Loading public stats…</p>
  {/if}
</section>

<section class="card">
  <h2>The three access tiers</h2>
  <div class="tier">
    <span class="label">Public</span>
    <span>
      Anyone can access it — no account or token needed. <span class="muted">(this page)</span>
    </span>
  </div>
  <div class="tier">
    <span class="label">Protected</span>
    <span>
      Any <em>authenticated</em> user (User or Admin). Example:
      <code>GET /api/user/profile</code>
    </span>
  </div>
  <div class="tier">
    <span class="label">Restricted</span>
    <span>
      Admin role only. Examples: <code>GET /api/admin/users</code>,
      <code>GET /api/admin/metrics</code>
    </span>
  </div>
</section>

<section class="card">
  <h2>How to test it</h2>
  <ol>
    <li><a href="#/register">Register</a> — the <strong>first account</strong> ever created is auto-promoted to <strong>Admin</strong> (bootstrap).</li>
    <li>Register a second account as a plain <strong>User</strong> (or pick "Admin" and supply the admin signup code: <code>AD371-ADMIN-DEMO-CODE</code>).</li>
    <li>As the User, open the <a href="#/dashboard">Dashboard</a> and try the admin endpoint probe — the server answers <code>403 Forbidden</code>.</li>
    <li>Log out, log back in as the Admin, and visit <a href="#/admin">Admin</a> to manage users.</li>
  </ol>
</section>
