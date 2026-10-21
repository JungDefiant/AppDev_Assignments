<script lang="ts">
  import { auth } from '../stores/auth.svelte';
  import { router } from '../stores/router.svelte';
  import { api, ApiError } from '../lib/api';
  import type { AuthResponse } from '../lib/types';

  let username = $state('');
  let password = $state('');
  let error = $state<string | null>(null);
  let busy = $state(false);

  async function onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    busy = true;
    error = null;
    try {
      const res = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      auth.setSession(res.token, res.user);
      router.navigate('/dashboard');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Unexpected error — is the server running?';
    } finally {
      busy = false;
    }
  }
</script>

<h1>Login</h1>
<p class="muted">Sign in to receive a JWT (valid for 1 hour) and access protected endpoints.</p>

<form class="form" onsubmit={onSubmit}>
  <label>
    Username
    <input type="text" autocomplete="username" bind:value={username} required />
  </label>
  <label>
    Password
    <input type="password" autocomplete="current-password" bind:value={password} required />
  </label>

  {#if error}
    <p class="alert-error">{error}</p>
  {/if}

  <button class="btn btn-primary" type="submit" disabled={busy}>
    {busy ? 'Signing in…' : 'Sign in'}
  </button>
  <p class="muted">
    No account yet? <a href="#/register">Register here</a>.
  </p>
</form>
