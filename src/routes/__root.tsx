import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { CartProvider } from "@/context/CartContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const state = useRouterState();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize theme
  useEffect(() => {
    const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Initial page load preloader (2s fade)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger route-change preloader
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [state.location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* ── Initial page load preloader ── */}
        {isInitialLoad && (
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-700"
            style={{ opacity: isInitialLoad ? 1 : 0 }}
          >
            {/* pulsing ring behind logo */}
            <div className="relative flex items-center justify-center">
              <span className="absolute h-32 w-32 animate-ping rounded-full bg-primary/10" />
              <span className="absolute h-24 w-24 animate-ping rounded-full bg-primary/15 [animation-delay:300ms]" />
              <img
                src="/logo.png"
                alt="Princess Eat Right Kitchen"
                className="relative z-10 h-24 w-24 animate-preloader-logo object-contain drop-shadow-2xl"
              />
            </div>
            {/* brand name */}
            <p className="mt-6 animate-preloader-text font-display text-lg font-bold uppercase tracking-[0.3em] text-foreground">
              Princess Eat Right
            </p>
            <p className="animate-preloader-text font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-primary [animation-delay:200ms]">
              Ijebu Ode · Ogun State
            </p>
            {/* loading bar */}
            <div className="mt-8 h-0.5 w-40 overflow-hidden rounded-full bg-border">
              <div className="h-full animate-loading-bar rounded-full bg-primary" />
            </div>
          </div>
        )}

        {/* ── Route-change preloader ── */}
        {isNavigating && !isInitialLoad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary [animation-duration:600ms]" />
                <img
                  src="/logo.png"
                  alt=""
                  className="absolute inset-1 h-8 w-8 object-contain opacity-80"
                  aria-hidden="true"
                />
              </div>
              <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                Loading…
              </span>
            </div>
          </div>
        )}

        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "rounded-xl border border-border bg-card text-foreground shadow-lg text-sm",
              success: "border-primary/30",
              error: "border-destructive/30",
            },
          }}
          richColors
        />
      </CartProvider>
    </QueryClientProvider>
  );
}
