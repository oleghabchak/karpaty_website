"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/Admin/AdminLogoutButton";

const links = [
  { href: "/admin", label: "Головна" },
  { href: "/admin/news", label: "Новини" },
  { href: "/admin/table", label: "Таблиця" },
  { href: "/admin/u19-table", label: "U-19 таблиця" },
  { href: "/admin/matches", label: "Наступний матч" },
  { href: "/admin/match-pages", label: "Матч-центр" },
] as const;

export default function AdminNavBar() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xs border border-body-color/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Адмін навігація">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-xs px-3 py-2 text-sm font-medium duration-300 ${
                active
                  ? "bg-primary text-white"
                  : "text-body-color hover:bg-body-color/10 dark:text-body-color-dark dark:hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex shrink-0 justify-end">
        <AdminLogoutButton />
      </div>
    </div>
  );
}
