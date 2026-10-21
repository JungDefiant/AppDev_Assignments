<script lang="ts">
  import { auth } from '../stores/auth.svelte';
  import { router } from '../stores/router.svelte';
  import { api } from '../lib/api';

  function handleLogout(): void {
    // Stateless JWT: the server has nothing to invalidate, so the client
    // discards the token. We still notify the server for API symmetry.
    void api('/auth/logout', { method: 'POST' }).catch(() => undefined);
    auth.logout();
    router.navigate('/');
  }
</script>

<header class="nav">
  <a class="brand" href="#/">Auth & RBAC Demo</a>

  <nav>
    <a href="#/">Home</a>
    {#if auth.isAuthenticated}
      <a href="#/dashboard">Dashboard</a>
      {#if auth.isAdmin}
        <a href="#/admin">Admin</a>
      {/if}
      <span class="badge {auth.isAdmin ? 'badge-admin' : 'badge-user'}">
        {auth.user?.username} · {auth.user?.role}
      </span>
      <button class="btn btn-outline" onclick={handleLogout}>Logout</button>
    {:else}
      <a href="#/login">Login</a>
      <a href="#/register">Register</a>
    {/if}
  </nav>
</header>
