import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminMatchPageEditor from "@/components/Admin/AdminMatchPageEditor";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Нова сторінка матчу | Адмін",
};

export const dynamic = "force-dynamic";

export default async function AdminNewMatchPage() {
  if (!getAdminSecret()) {
    redirect("/admin/match-pages?error=missing-secret");
  }
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/match-pages");
  }

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <AdminNavBar />
        <FirebaseAdminAuthGate hideFirebaseSignOut>
          <AdminMatchPageEditor mode="create" />
        </FirebaseAdminAuthGate>
      </div>
    </section>
  );
}
