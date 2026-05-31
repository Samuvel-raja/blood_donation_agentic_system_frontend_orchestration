import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">Signal lost</p>
        <h1 className="mt-4 text-7xl font-semibold tracking-tight text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This node isn't part of the orchestration graph.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Return to dashboard
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
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson">Runtime fault</p>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Orchestration node crashed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The execution engine raised an exception. Retry to re-run the workflow.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-crimson px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PulseXira — AI Blood Donation Orchestration" },
      { name: "description", content: "Enterprise AI command center for emergency blood logistics, donor orchestration, and real-time workflow telemetry." },
      { name: "author", content: "PulseXira" },
      { property: "og:title", content: "PulseXira — AI Blood Donation Orchestration" },
      { property: "og:description", content: "Enterprise AI command center for emergency blood logistics and autonomous donor orchestration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    // Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && pathname !== "/login") {
      router.navigate({ to: "/login", replace: true }).catch(() => {});
    }

    // Redirect authenticated users away from the login page
    if (isAuthenticated && pathname === "/login") {
      router.navigate({ to: "/", replace: true }).catch(() => {});
    }
  }, [isAuthenticated, pathname, router]);

  // Show AppShell for authenticated users on protected routes
  if (isAuthenticated) {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  }

  // Unauthenticated — render outlet only for /login
  return pathname === "/login" ? <Outlet /> : null;
}
