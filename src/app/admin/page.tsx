import type { Metadata } from "next";
import Link from "next/link";
import { loginAdminPanel } from "./actions";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Адмін | ФК «Уличне»",
  description: "Адмін панель: створення новин, редагування таблиці та матчів.",
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  "missing-secret": "Додайте `ADMIN_NEWS_SECRET` або `ADMIN_SECRET` у змінні середовища, щоб увімкнути доступ до адмінки.",
  "invalid-secret": "Невірний секретний код. Спробуйте ще раз.",
};

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const error = getFirstValue(params.error);

  const hasSecret = Boolean(getAdminSecret());
  const isAuthenticated = await isAdminAuthenticated();

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-dark mb-4 text-3xl font-bold dark:text-white sm:text-4xl">
            Адмін панель
          </h1>
          <p className="text-body-color dark:text-body-color-dark">
            Керування контентом клубу. Оберіть потрібний розділ.
          </p>
        </div>

        {error ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {errorMessages[error] ?? "Не вдалося виконати дію."}
          </div>
        ) : null}

        {!hasSecret ? (
          <div className="shadow-three dark:bg-dark mx-auto max-w-3xl rounded-xs bg-white p-8 text-center">
            <h2 className="text-dark mb-3 text-2xl font-semibold dark:text-white">
              Адмін секрет не налаштовано
            </h2>
            <p className="text-body-color dark:text-body-color-dark">
              Додайте `ADMIN_NEWS_SECRET` у `.env.local`, перезапустіть сервер і відкрийте цю сторінку знову.
            </p>
          </div>
        ) : isAuthenticated ? (
          <>
            <AdminNavBar />

            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
              <Link
                href="/admin/news"
                className="rounded-xs border border-body-color/10 bg-white p-5 text-left shadow-sm transition hover:border-body-color/20 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="text-dark text-lg font-semibold dark:text-white">Адмін новин</div>
                <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                  Створення та публікація новин у Firestore.
                </p>
              </Link>

              <Link
                href="/admin/table"
                className="rounded-xs border border-body-color/10 bg-white p-5 text-left shadow-sm transition hover:border-body-color/20 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="text-dark text-lg font-semibold dark:text-white">Адмін турнірної таблиці</div>
                <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                  CRUD для основної таблиці.
                </p>
              </Link>

              <Link
                href="/admin/u19-table"
                className="rounded-xs border border-body-color/10 bg-white p-5 text-left shadow-sm transition hover:border-body-color/20 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="text-dark text-lg font-semibold dark:text-white">Адмін таблиці U-19</div>
                <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                  CRUD для турнірної таблиці U-19 (Сезон 2025).
                </p>
              </Link>

              <Link
                href="/admin/matches"
                className="rounded-xs border border-body-color/10 bg-white p-5 text-left shadow-sm transition hover:border-body-color/20 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="text-dark text-lg font-semibold dark:text-white">Адмін  перед/наступних матчів</div>
                <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                   Перед/наступні матчі та календар матчів.
                </p>
              </Link>

              <Link
                href="/admin/match-pages"
                className="rounded-xs border border-body-color/10 bg-white p-5 text-left shadow-sm transition hover:border-body-color/20 hover:shadow-md dark:border-white/10 dark:bg-gray-dark"
              >
                <div className="text-dark text-lg font-semibold dark:text-white">Матч-центр</div>
                <p className="text-body-color mt-1 text-sm dark:text-body-color-dark">
                  Сторінки матчів з відео та описом.
                </p>
              </Link>
            </div>
          </>
        ) : (
          <div className="shadow-three dark:bg-dark mx-auto max-w-xl rounded-xs bg-white p-8">
            <h2 className="text-dark mb-3 text-2xl font-semibold dark:text-white">
              Вхід до адмінки
            </h2>
            <p className="text-body-color dark:text-body-color-dark mb-6">
              Введіть секретний код, щоб відкрити адміністративні розділи.
            </p>

            <form action={loginAdminPanel} className="space-y-4">
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
                className="bg-primary hover:bg-primary/90 rounded-xs px-6 py-3 text-sm font-medium text-white duration-300"
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

