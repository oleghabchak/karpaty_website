import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNewsEditor from "@/components/Admin/AdminNewsEditor";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Нова новина | Адмін",
};

export const dynamic = "force-dynamic";

export default async function AdminNewNewsPage() {
  if (!getAdminSecret()) {
    redirect("/admin/news?error=missing-secret");
  }
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/news");
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <AdminNavBar />
        <FirebaseAdminAuthGate hideFirebaseSignOut>
          <AdminNewsEditor mode="create" cloudName={cloudName} uploadPreset={uploadPreset} />
        </FirebaseAdminAuthGate>
      </div>
    </section>
  );
}
