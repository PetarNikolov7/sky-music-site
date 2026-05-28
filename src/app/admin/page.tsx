import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin панел",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: adminProfile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("display_name, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !adminProfile?.active) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Този акаунт няма активен административен достъп.",
      )}`,
    );
  }

  const [
    { count: productCount },
    { count: newOrderCount },
    { count: activeBannerCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
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
      description: "в базата данни",
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
    {
      label: "Admin достъп",
      value: "Активен",
      description: "Supabase защита",
    },
  ];

  const upcomingModules = [
    {
      title: "Продукти",
      description:
        "Добавяне, редактиране, снимки, цена, наличност и публикуване.",
      badge: "Следващ етап",
    },
    {
      title: "Поръчки",
      description:
        "Нови заявки, статуси, данни за доставка и клиентска комуникация.",
      badge: "Подготвено",
    },
    {
      title: "Банери",
      description:
        "Промо изображения и подреждане на слайдовете на началната страница.",
      badge: "Подготвено",
    },
    {
      title: "Еконт / Спиди",
      description:
        "Реален избор на офис, автомат или адрес при заявка за доставка.",
      badge: "Планирано",
    },
  ];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#060914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
              SKY MUSIC BG / ADMIN
            </p>

            <h1 className="mt-3 text-2xl font-black">
              Административен панел
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
              <p className="font-bold text-white">
                {adminProfile.display_name || "Admin"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{user.email}</p>
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
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Admin Foundation v0.1
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            Защитеният административен достъп е активен.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Това е първата работеща основа на управлението на магазина.
            Следващата стъпка е реалният модул за добавяне и редактиране на
            продукти.
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

              <p className="mt-2 text-sm text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
                Следващи модули
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Управление на магазина
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Модулите ще се активират последователно, след build и тест на
              всеки стабилен етап.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {upcomingModules.map((module) => (
              <article
                key={module.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
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
              </article>
            ))}
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
      </section>
    </main>
  );
}