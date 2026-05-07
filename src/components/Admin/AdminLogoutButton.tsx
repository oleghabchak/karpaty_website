"use client";

import { useTransition } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseAuthClient";
import { logoutAdminEverywhere } from "@/app/admin/actions";

export default function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    void (async () => {
      try {
        await signOut(auth);
      } catch {
        /* not signed in to Firebase */
      }
      startTransition(() => {
        void logoutAdminEverywhere();
      });
    })();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="border-stroke text-dark hover:border-primary hover:text-primary rounded-xs border px-4 py-2 text-sm font-medium duration-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:text-white"
    >
      {pending ? "Вихід…" : "Вийти"}
    </button>
  );
}
