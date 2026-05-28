import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    signedOut?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Admin вход",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminProfile?.active) {
      redirect("/admin");
    }
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden border-r border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
                SKY MUSIC BG
              </p>

              <h1 className="mt-6 text-4xl font-black leading-tight">
                Административен панел
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
                Защитена зона за управление на продукти, поръчки, наличности,
                изображения и начална страница.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] p-5">
              <p className="text-sm leading-6 text-slate-300">
                Достъпът е разрешен само за активен администраторски профил.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
                  Admin
                </p>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Вход в системата
                </h2>
              </div>

              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Към сайта
              </Link>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Въведете Вашия административен имейл и парола.
            </p>

            {params.error && (
              <div className="mt-7 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-4 text-sm font-bold text-red-200">
                {params.error}
              </div>
            )}

            {params.signedOut && (
              <div className="mt-7 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-4 text-sm font-bold text-emerald-200">
                Излязохте успешно от административния панел.
              </div>
            )}

            <form action={login} className="mt-8 grid gap-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Имейл
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="Администраторски имейл"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Парола
                </label>

                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Вашата парола"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 cursor-pointer rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 text-center font-black text-white shadow-xl shadow-blue-950/40 transition hover:brightness-110"
              >
                Влезте в Admin панела
              </button>
            </form>

            <p className="mt-7 text-xs leading-6 text-slate-500">
              Няма публична регистрация. Административният достъп се управлява
              директно от SKY MUSIC BG.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}