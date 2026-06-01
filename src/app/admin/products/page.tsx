import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: "Admin продукти",
  robots: {
    index: false,
    follow: false,
  },
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type AdminProductRow = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  short_description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
};

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "—";
  }

  return value?.name ?? "—";
}

function formatPrice(amount: number | string | null, currency: string | null) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency ?? ""}`.trim();
  }

  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount) + ` ${currency ?? "EUR"}`;
}

function getStockLabel(status: string | null) {
  if (status === "in_stock") {
    return "Наличен";
  }

  if (status === "on_request") {
    return "По заявка";
  }

  if (status === "out_of_stock") {
    return "Изчерпан";
  }

  return status ?? "—";
}

function getStockClassName(status: string | null) {
  if (status === "in_stock") {
    return "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20";
  }

  if (status === "on_request") {
    return "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20";
  }

  if (status === "out_of_stock") {
    return "bg-red-400/10 text-red-300 ring-1 ring-red-400/20";
  }

  return "bg-white/[0.06] text-slate-300 ring-1 ring-white/10";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminProductsPage() {
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

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        sku,
        name,
        short_description,
        price_amount,
        currency,
        stock_status,
        is_published,
        is_featured,
        created_at,
        updated_at,
        brands(name),
        categories(name),
        subcategories(name)
      `,
    )
    .order("updated_at", { ascending: false });

  const products = (data ?? []) as unknown as AdminProductRow[];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#060914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
              SKY MUSIC BG / ADMIN
            </p>

            <h1 className="mt-3 text-2xl font-black">Продукти</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              Табло
            </Link>

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
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Products v0.1
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Управление на продукти
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
              Това е първата административна страница за продуктите. В момента
              чете директно от Supabase таблицата <strong>products</strong>.
              Следващият batch ще добави реална форма за създаване на продукт.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-950/40 transition hover:brightness-110"
          >
            Добави продукт
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Общо продукти
            </p>

            <p className="mt-4 text-3xl font-black">{products.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Публикувани
            </p>

            <p className="mt-4 text-3xl font-black">
              {products.filter((product) => product.is_published).length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Избрани
            </p>

            <p className="mt-4 text-3xl font-black">
              {products.filter((product) => product.is_featured).length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
            Възникна грешка при зареждане на продуктите: {error.message}
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center md:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-3xl">
              ♫
            </div>

            <h3 className="mt-6 text-2xl font-black">
              Все още няма продукти в базата.
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Публичният сайт все още използва статичния продукт YAMAHA C40.
              Следващата стъпка е формата за добавяне на продукти в Supabase.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-slate-200"
            >
              Добави първия продукт
            </Link>
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <div className="hidden grid-cols-[1.3fr_0.8fr_0.8fr_0.65fr_0.65fr] gap-5 border-b border-white/10 bg-white/[0.04] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500 lg:grid">
              <p>Продукт</p>
              <p>Категория</p>
              <p>Марка</p>
              <p>Цена</p>
              <p>Статус</p>
            </div>

            <div className="divide-y divide-white/10">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.65fr_0.65fr] lg:items-center lg:gap-5 lg:px-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-white">
                        {product.name}
                      </h3>

                      {!product.is_published && (
                        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Скрит
                        </span>
                      )}

                      {product.is_featured && (
                        <span className="rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-sky-200 ring-1 ring-sky-400/20">
                          Избран
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      slug: {product.slug}
                    </p>

                    {product.short_description && (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {product.short_description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-slate-600">
                      Обновен: {formatDate(product.updated_at)}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="font-bold text-white">
                      {getRelationName(product.categories)}
                    </p>
                    <p className="mt-1 text-slate-500">
                      {getRelationName(product.subcategories)}
                    </p>
                  </div>

                  <div className="text-sm font-bold text-slate-300">
                    {getRelationName(product.brands)}
                  </div>

                  <div className="text-sm font-black text-white">
                    {formatPrice(product.price_amount, product.currency)}
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${getStockClassName(
                        product.stock_status,
                      )}`}
                    >
                      {getStockLabel(product.stock_status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}