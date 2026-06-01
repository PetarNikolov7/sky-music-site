import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Admin панел",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const { supabase, user, adminProfile } = await requireAdmin();

  const [
    { count: productCount },
    { count: publishedProductCount },
    { count: newOrderCount },
    { count: activeBannerCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("banners")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const dashboardStats = [
    {
      label: "Продукти",
      value: productCount ?? 0,
      description: "общо в базата данни",
    },
    {
      label: "Публикувани",
      value: publishedProductCount ?? 0,
      description: "видими за клиентите",
    },
    {
      label: "Нови поръчки",
      value: newOrderCount ?? 0,
      description: "изчакват обработка",
    },
    {
      label: "Активни банери",
      value: activeBannerCount ?? 0,
      description: "на началната страница",
    },
  ];

  const modules = [
    {
      title: "Продукти",
      description:
        "Добавяне, редактиране, цена, наличност, публикуване и снимки.",
      badge: "Активен модул",
      href: "/admin/products",
      enabled: true,
    },
    {
      title: "Поръчки",
      description:
        "Нови заявки, статуси, данни за доставка и клиентска комуникация.",
      badge: "Следва",
      href: "/admin/orders",
      enabled: false,
    },
    {
      title: "Банери",
      description:
        "Промо изображения и подреждане на слайдовете на началната страница.",
      badge: "Подготвено",
      href: "/admin/banners",
      enabled: false,
    },
    {
      title: "Еконт / Спиди",
      description:
        "Реален избор на офис, автомат или адрес при заявка за доставка.",
      badge: "Планирано",
      href: "/admin/shipping",
      enabled: false,
    },
  ];

  return (
    <AdminShell
      activePage="dashboard"
      title="Административен панел"
      description="Първата стабилна основа за управление на магазина."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Admin Foundation v0.1
        </p>

        <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
          Управлението на магазина е активно.
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          Supabase връзката, защитеният вход и RLS правилата работят. Следва
          изграждане на реалното управление на продуктите.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-4 text-3xl font-black text-white">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Модули
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Управление на магазина
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Активираме модулите последователно, след build и тест на всеки
            стабилен етап.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {modules.map((module) => {
            const content = (
              <article
                className={
                  module.enabled
                    ? "h-full rounded-[1.5rem] border border-sky-400/20 bg-sky-400/[0.07] p-6 transition hover:-translate-y-0.5 hover:bg-sky-400/[0.1]"
                    : "h-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black">{module.title}</h3>

                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-200">
                    {module.badge}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {module.description}
                </p>

                {module.enabled && (
                  <p className="mt-5 text-sm font-black text-sky-200">
                    Отворете модула →
                  </p>
                )}
              </article>
            );

            if (!module.enabled) {
              return <div key={module.title}>{content}</div>;
            }

            return (
              <Link key={module.title} href={module.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
          Сигурност
        </p>

        <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-300 md:grid-cols-3">
          <p>Публичната регистрация е изключена.</p>
          <p>Само активен admin профил има достъп.</p>
          <p>Поръчките и редакциите са защитени чрез Supabase RLS.</p>
        </div>
      </section>
    </AdminShell>
  );
}
