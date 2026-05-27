import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminNewsEditor from "@/components/Admin/AdminNewsEditor";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";
import { getPostBySlugServer } from "@/lib/posts-server";

export const metadata: Metadata = {
  title: "Редагування новини | Адмін",
};

export const dynamic = "force-dynamic";

type EditNewsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditNewsPage({ params }: EditNewsPageProps) {
  if (!getAdminSecret()) {
    redirect("/admin/news?error=missing-secret");
  }
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/news");
  }

  const { slug } = await params;
  const post = await getPostBySlugServer(slug);
  if (!post) {
    notFound();
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
          <AdminNewsEditor
            mode="edit"
            slug={slug}
            initial={post}
            cloudName={cloudName}
            uploadPreset={uploadPreset}
          />
        </FirebaseAdminAuthGate>
      </div>
    </section>
  );
}
