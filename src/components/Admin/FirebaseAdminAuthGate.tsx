"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseAuthClient";

const ADMIN_EMAIL = "admin@gmail.com";

type FirebaseAdminAuthGateProps = {
  children: ReactNode;
};

export default function FirebaseAdminAuthGate({ children }: FirebaseAdminAuthGateProps) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => password.trim().length > 0 && !pending, [password, pending]);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setAuthed(Boolean(user)));
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;

    setPending(true);
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    } catch {
      setError("Не вдалося увійти в Firebase. Перевірте пароль.");
      setAuthed(false);
    } finally {
      setPending(false);
    }
  }

  async function handleSignOut() {
    setError(null);
    try {
      await signOut(auth);
    } finally {
      setAuthed(false);
    }
  }

  if (authed) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="border-stroke text-dark hover:border-primary hover:text-primary rounded-xs border px-4 py-2 text-sm font-medium duration-300 dark:border-white/10 dark:text-white"
          >
            Вийти з Firebase
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="shadow-three dark:bg-dark mx-auto max-w-3xl rounded-xs bg-white p-6 sm:p-8">
      <h2 className="text-dark mb-3 text-2xl font-semibold dark:text-white">Firebase вхід</h2>
      <p className="text-body-color dark:text-body-color-dark mb-6">
        Введіть пароль, щоб дозволити запис у Firestore.
      </p>

      {error ? (
        <div className="mb-4 rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSignIn} className="space-y-4">
        <label className="text-dark mb-2 block text-sm font-medium dark:text-white">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Зачекайте..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}

