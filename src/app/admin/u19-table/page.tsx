import type { Metadata } from "next";
import AdminU19StandingsEditor from "@/components/Admin/AdminU19StandingsEditor";
import AdminNavBar from "@/components/Admin/AdminNavBar";
import FirebaseAdminAuthGate from "@/components/Admin/FirebaseAdminAuthGate";
import { getAdminSecret, isAdminAuthenticated } from "@/lib/admin-session";
import { getU19StandingsRows } from "@/lib/u19Standings";
import { loginAdminU19Table } from "./actions";

export const metadata: Metadata = {
  title: "Адмін турнірної таблиці U-19 | ФК «Уличне»",
  description: "Редагування турнірної таблиці U-19 (Firestore).",
};

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  "missing-secret": "Додайте `ADMIN_NEWS_SECRET` у змінні середовища, щоб увімкнути доступ до адмінки.",
  "invalid-secret": "Невірний секретний код. Спробуйте ще раз.",
  unauthorized: "Сесія завершилась. Увійдіть ще раз.",
  "invalid-payload": "Некоректні дані таблиці.",
};

type AdminU19TablePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminU19TablePage({ searchParams }: AdminU19TablePageProps) {
  const params = await searchParams;
  const error = getFirstValue(params.error);
  const saved = getFirstValue(params.saved);
  const reset = getFirstValue(params.reset);
  const hasSecret = Boolean(getAdminSecret());
  const isAuthenticated = await isAdminAuthenticated();

  const rows = await getU19StandingsRows({ forAdmin: true });

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-32 md:pb-20 lg:pb-28 lg:pt-[160px]">
      <div className="container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-dark mb-4 text-3xl font-bold dark:text-white sm:text-4xl">
            Адмін таблиці U-19
          </h1>
          <p className="text-body-color dark:text-body-color-dark">
            Редагуйте турнірну таблицю U-19. Зміни збережуться у Firestore (документ u19Standings/main).
          </p>
        </div>

        {error ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {errorMessages[error] ?? "Не вдалося виконати дію."}
          </div>
        ) : null}

        {saved ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
            Таблицю U-19 успішно збережено.
          </div>
        ) : null}

        {reset ? (
          <div className="mx-auto mb-6 max-w-3xl rounded-xs border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-200">
            Документ таблиці U-19 видалено; на сайті знову показується резерв з коду до наступного збереження.
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

            <FirebaseAdminAuthGate hideFirebaseSignOut>
              <AdminU19StandingsEditor initialRows={rows} />
            </FirebaseAdminAuthGate>
          </>
        ) : (
          <div className="shadow-three dark:bg-dark mx-auto max-w-xl rounded-xs bg-white p-8">
            <h2 className="text-dark mb-3 text-2xl font-semibold dark:text-white">Вхід до адмінки</h2>
            <p className="text-body-color dark:text-body-color-dark mb-6">
              Введіть секретний код, щоб відкрити сторінку редагування таблиці U-19.
            </p>
            <form action={loginAdminU19Table} className="space-y-4">
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
