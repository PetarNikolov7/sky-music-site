import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt?: string;
  children: ReactNode;
};

const informationLinks = [
  {
    label: "Общи условия",
    href: "/terms",
  },
  {
    label: "Политика за поверителност",
    href: "/privacy",
  },
  {
    label: "Политика за бисквитки",
    href: "/cookies",
  },
  {
    label: "Доставка и плащане",
    href: "/delivery-payment",
  },
  {
    label: "Отказ, връщане и рекламации",
    href: "/returns-claims",
  },
];

export default function LegalPageLayout({
  eyebrow,
  title,
  intro,
  updatedAt = "27 май 2026 г.",
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <SiteHeader />

        <section className="py-10 md:py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-12">
            <nav
              aria-label="Навигация"
              className="flex flex-wrap items-center gap-2 text-sm text-slate-400"
            >
              <Link href="/" className="transition hover:text-white">
                Начало
              </Link>

              <span className="text-slate-600">→</span>

              <span className="font-bold text-sky-300">{eyebrow}</span>
            </nav>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-sky-300">
              {eyebrow}
            </p>

            <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
              {intro}
            </p>

            <p className="mt-7 text-sm text-slate-500">
              Последна актуализация: {updatedAt}
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="px-3 pt-2 text-xs font-black uppercase tracking-[0.26em] text-slate-500">
                  Информация
                </p>

                <nav
                  aria-label="Информационни страници"
                  className="mt-4 grid gap-1"
                >
                  {informationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                        link.label === title
                          ? "rounded-xl bg-sky-400 px-3 py-3 text-sm font-black text-black"
                          : "rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-10">
              {children}
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}