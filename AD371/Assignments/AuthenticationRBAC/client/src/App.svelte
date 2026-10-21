<script lang="ts">
  import { onMount } from 'svelte';
  import { router } from './stores/router.svelte';
  import { auth } from './stores/auth.svelte';
  import NavBar from './components/NavBar.svelte';
  import Home from './pages/Home.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Admin from './pages/Admin.svelte';
  import NotFound from './pages/NotFound.svelte';

  const PUBLIC_ROUTES = new Set(['/', '/login', '/register']);

  // Re-validate the stored token after a page reload.
  onMount(() => {
    void auth.refresh();
  });

  // Client-side route guard (UX only — the SERVER is the real enforcement
  // point for authentication and role checks; see the API handlers).
  const Page = $derived.by(() => {
    const path = router.current;

    if (!PUBLIC_ROUTES.has(path) && !auth.isAuthenticated) {
      return Login;
    }
    if (path === '/admin' && !auth.isAdmin) {
      return Dashboard;
    }

    switch (path) {
      case '/':
        return Home;
      case '/login':
        return Login;
      case '/register':
        return Register;
      case '/dashboard':
        return Dashboard;
      case '/admin':
        return Admin;
      default:
        return NotFound;
    }
  });
</script>

<NavBar />

<main>
  <Page />
</main>
