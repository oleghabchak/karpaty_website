import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminMatchPageEditor from "@/components/Admin/AdminMatchPageEditor";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";
import { getMatchPageByIdForAdmin } from "@/lib/match-pages";

export const metadata: Metadata = {
  title: "Редагування матчу | Адмін",
};

export const dynamic = "force-dynamic";

type EditMatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditMatchPage({ params }: EditMatchPageProps) {
  if (!getAdminSecret()) {
    redirect("/admin/match-pages?error=missing-secret");
  }
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/match-pages");
  }

  const { id } = await params;
  const page = await getMatchPageByIdForAdmin(id);
  if (!page) {
    notFound();
  }

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <AdminNavBar />
        <FirebaseAdminAuthGate hideFirebaseSignOut>
          <AdminMatchPageEditor mode="edit" initial={page} />
        </FirebaseAdminAuthGate>
      </div>
    </section>
  );
}
