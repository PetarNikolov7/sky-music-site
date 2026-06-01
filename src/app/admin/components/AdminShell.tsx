import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";

type AdminShellProps = {
  activePage: "dashboard" | "products" | "orders" | "banners";
  eyebrow?: string;
  title: string;
  description?: string;
  userEmail?: string | null;
  displayName: string;
  children: ReactNode;
};

const navItems = [
  {
    label: "Табло",
    href: "/admin",
    key: "dashboard",
    enabled: true,
  },
  {
    label: "Продукти",
    href: "/admin/products",
    key: "products",
    enabled: true,
  },
  {
    label: "Поръчки",
    href: "/admin/orders",
    key: "orders",
    enabled: false,
  },
  {
    label: "Банери",
    href: "/admin/banners",
    key: "banners",
    enabled: false,
  },
] as const;

export default function AdminShell({
  activePage,
  eyebrow = "SKY MUSIC BG / ADMIN",
  title,
  description,
  userEmail,
  displayName,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#060914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
              {eyebrow}
            </p>

            <h1 className="mt-3 text-2xl font-black">{title}</h1>

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
              <p className="font-bold text-white">{displayName}</p>

              {userEmail && (
                <p className="mt-1 text-xs text-slate-400">{userEmail}</p>
              )}
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
              >
                Изход
              </button>
            </form>
          </div>
        </div>

        <nav className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 md:px-8">
            {navItems.map((item) => {
              const active = item.key === activePage;

              if (!item.enabled) {
                return (
                  <span
                    key={item.key}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-bold text-slate-600"
                  >
                    {item.label}
                    <span className="ml-2 text-[10px] uppercase tracking-[0.18em]">
                      скоро
                    </span>
                  </span>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={
                    active
                      ? "whitespace-nowrap rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-black"
                      : "whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        {children}
      </section>
    </main>
  );
}
