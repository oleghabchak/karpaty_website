import type { Metadata } from "next";
import Link from "next/link";
import AdminMatchPagesList from "@/components/Admin/AdminMatchPagesList";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";
import { getAllMatchPagesForAdmin } from "@/lib/match-pages";
import { loginAdminMatchPages } from "./actions";

export const metadata: Metadata = {
  title: "Адмін матч-центру | ФК «Уличне»",
  description: "Створення та редагування сторінок матч-центру.",
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  "missing-secret": "Додайте `ADMIN_NEWS_SECRET` у змінні середовища.",
  "invalid-secret": "Невірний секретний код.",
  unauthorized: "Сесія завершилась. Увійдіть ще раз.",
};

type AdminMatchPagesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminMatchPagesPage({ searchParams }: AdminMatchPagesPageProps) {
  const params = await searchParams;
  const error = getFirstValue(params.error);
  const saved = getFirstValue(params.saved);

  const hasSecret = Boolean(getAdminSecret());
  const isAuthenticated = await isAdminAuthenticated();
  const pages = isAuthenticated ? await getAllMatchPagesForAdmin() : [];

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-dark mb-4 text-3xl font-bold dark:text-white sm:text-4xl">Матч-центр</h1>
          <p className="text-body-color dark:text-body-color-dark">
            Записи матч-центру: тур, назва матчу та прив&apos;язка до новини.
          </p>
        </div>

        {error ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {errorMessages[error] ?? "Не вдалося виконати дію."}
          </div>
        ) : null}

        {saved ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
            Запис матч-центру збережено.
          </div>
        ) : null}

        {!hasSecret ? (
          <div className="shadow-three dark:bg-dark mx-auto max-w-3xl rounded-xs bg-white p-8 text-center">
            <p className="text-body-color dark:text-body-color-dark">
              Додайте `ADMIN_NEWS_SECRET` у `.env.local` і перезапустіть сервер.
            </p>
          </div>
        ) : isAuthenticated ? (
          <>
            <AdminNavBar />
            <FirebaseAdminAuthGate hideFirebaseSignOut>
              <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex justify-end">
                  <Link
                    href="/admin/match-pages/new"
                    className="bg-primary hover:bg-primary/90 rounded-xs px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Додати запис
                  </Link>
                </div>
                <AdminMatchPagesList entries={pages} />
              </div>
            </FirebaseAdminAuthGate>
          </>
        ) : (
          <div className="shadow-three dark:bg-dark mx-auto max-w-xl rounded-xs bg-white p-8">
            <h2 className="text-dark mb-3 text-2xl font-semibold dark:text-white">Вхід</h2>
            <form action={loginAdminMatchPages} className="space-y-4">
              <div>
                <label className="text-dark mb-2 block text-sm font-medium dark:text-white">
                  Секретний код
                </label>
                <input
                  type="password"
                  name="secret"
                  required
                  className="border-stroke dark:bg-dark dark:border-white/10 dark:text-white w-full rounded-xs border px-4 py-3 outline-hidden focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white"
              >
                Увійти
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
