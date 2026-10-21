<script lang="ts">
  import { auth } from '../stores/auth.svelte';
  import { router } from '../stores/router.svelte';
  import { api, ApiError } from '../lib/api';
  import type { AuthResponse } from '../lib/types';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let role = $state<'user' | 'admin'>('user');
  let adminSignupCode = $state('');
  let error = $state<string | null>(null);
  let busy = $state(false);

  async function onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    busy = true;
    error = null;
    try {
      const res = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: {
          username,
          email,
          password,
          role,
          ...(role === 'admin' ? { adminSignupCode } : {}),
        },
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

<h1>Register</h1>
<p class="muted">
  Passwords are hashed with <strong>bcrypt (cost 12)</strong> on the server — the plaintext
  password is never stored or logged.
</p>

<form class="form" onsubmit={onSubmit}>
  <label>
    Username
    <input type="text" autocomplete="username" bind:value={username} required minlength="3" maxlength="30" />
  </label>
  <label>
    Email
    <input type="email" autocomplete="email" bind:value={email} required />
  </label>
  <label>
    Password (min. 10 characters)
    <input type="password" autocomplete="new-password" bind:value={password} required minlength="10" maxlength="128" />
  </label>
  <label>
    Role
    <select bind:value={role}>
      <option value="user">User</option>
      <option value="admin">Admin (requires signup code)</option>
    </select>
  </label>

  {#if role === 'admin'}
    <label>
      Admin signup code
      <input type="password" bind:value={adminSignupCode} placeholder="AD371-ADMIN-DEMO-CODE" />
    </label>
    <p class="muted" style="font-size: 0.85rem;">
      The server only accepts Admin self-registration with the
      <code>ADMIN_SIGNUP_CODE</code> secret. Note: the <em>first</em> account created is always an Admin regardless of this choice.
    </p>
  {/if}

  {#if error}
    <p class="alert-error">{error}</p>
  {/if}

  <button class="btn btn-primary" type="submit" disabled={busy}>
    {busy ? 'Creating account…' : 'Create account'}
  </button>
  <p class="muted">
    Already registered? <a href="#/login">Sign in</a> instead.
  </p>
</form>
