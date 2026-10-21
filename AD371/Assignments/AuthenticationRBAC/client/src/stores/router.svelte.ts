// Minimal hash-based router so the demo needs no extra routing dependency.

function currentPath(): string {
  const raw = window.location.hash;
  return raw === '' ? '/' : raw.slice(1) || '/';
}

class Router {
  current = $state(currentPath());

  constructor() {
    window.addEventListener('hashchange', () => {
      this.current = currentPath();
      window.scrollTo(0, 0);
    });
  }

  navigate(path: string): void {
    if (window.location.hash === `#${path}`) {
      this.current = path;
    } else {
      window.location.hash = path;
    }
  }
}

export const router = new Router();
