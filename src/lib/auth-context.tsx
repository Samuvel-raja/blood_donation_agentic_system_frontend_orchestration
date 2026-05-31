import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { UserProfile } from "@/lib/api/auth";

// ── Types 

type Store = {
  token: string | null;
  user: UserProfile | null;
};

type AuthContextValue = Store & {
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
};

// ── Store (module-level, shared across all consumers) ─────────────────────

const TOKEN_KEY = "pulsexira_token";
const USER_KEY = "pulsexira_user";

function readFromStorage(): Store {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return {
      token: token ? (JSON.parse(token) as string) : null,
      user: user ? (JSON.parse(user) as UserProfile) : null,
    };
  } catch {
    return { token: null, user: null };
  }
}

function writeToStorage(token: string | null, user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (token == null) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }
  if (user == null) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

let store: Store = { token: null, user: null };
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Store {
  return store;
}

/** Called by React's SSR renderer to get the initial store value. */
function getServerSnapshot(): Store {
  // On the server there's no localStorage, so always return the default.
  return { token: null, user: null };
}

// ── Context ──────────────────────────────────────────────────────────────

const DEFAULT_VALUE: AuthContextValue = {
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextValue>(DEFAULT_VALUE);

// ── Provider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Hydrate from localStorage after mount so the first client render
  // matches the server output, preventing hydration mismatches.
  useEffect(() => {
    const stored = readFromStorage();
    if (stored.token !== store.token || stored.user !== store.user) {
      store = stored;
      emitChange();
    }
  }, []);

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: token != null && user != null,
    login: (newToken: string, newUser: UserProfile) => {
      store = { token: newToken, user: newUser };
      writeToStorage(newToken, newUser);
      emitChange();
    },
    logout: () => {
      store = { token: null, user: null };
      writeToStorage(null, null);
      emitChange();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
