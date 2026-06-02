import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: "Catalog preview",
  robots: {
    index: false,
    follow: false,
  },
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductImageRow = {
  id: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
};

type ProductSpecRow = {
  label: string | null;
  value: string | null;
  sort_order: number | null;
};

type SupabasePreviewProduct = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  short_description: string | null;
  description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  badges: string[] | null;
  updated_at: string | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
  product_images: ProductImageRow[] | null;
  product_specs: ProductSpecRow[] | null;
};

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "—";
  }

  return value?.name ?? "—";
}

function getStockLabel(status: string | null) {
  if (status === "available") {
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
  if (status === "available") {
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

function formatPrice(amount: number | string | null, currency: string | null) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency ?? ""}`.trim();
  }

  const euroPrice = new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  if ((currency ?? "EUR") !== "EUR") {
    return `${euroPrice} ${currency ?? ""}`.trim();
  }

  const bgnPrice = new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount * 1.95583);

  return `${euroPrice} € / ${bgnPrice} лв.`;
}

function sortImages(images: ProductImageRow[] | null) {
  return [...(images ?? [])].sort((first, second) => {
    if (first.is_primary && !second.is_primary) return -1;
    if (!first.is_primary && second.is_primary) return 1;

    return (first.sort_order ?? 0) - (second.sort_order ?? 0);
  });
}

function sortSpecs(specs: ProductSpecRow[] | null) {
  return [...(specs ?? [])].sort(
    (first, second) => (first.sort_order ?? 0) - (second.sort_order ?? 0),
  );
}

export default async function AdminCatalogPreviewPage() {
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
        description,
        price_amount,
        currency,
        stock_status,
        is_published,
        is_featured,
        badges,
        updated_at,
        brands(name),
        categories(name),
        subcategories(name),
        product_images(
          id,
          storage_path,
          alt_text,
          sort_order,
          is_primary
        ),
        product_specs(
          label,
          value,
          sort_order
        )
      `,
    )
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  const products = (data ?? []) as unknown as SupabasePreviewProduct[];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#060914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
              SKY MUSIC BG / ADMIN
            </p>

            <h1 className="mt-3 text-2xl font-black">Catalog preview</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin/products"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              Продукти
            </Link>

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
        <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Read-only Supabase preview
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            Проверка на публичните продукти от Supabase.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Тази страница не променя публичния каталог. Тя показва само
            публикуваните продукти от Supabase, за да проверим данни, снимки и
            спецификации преди публичното превключване.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Публикувани продукти
            </p>
            <p className="mt-4 text-3xl font-black">{products.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Featured
            </p>
            <p className="mt-4 text-3xl font-black">
              {products.filter((product) => product.is_featured).length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Грешка
            </p>
            <p className="mt-4 text-3xl font-black">{error ? "Да" : "Не"}</p>
          </div>
        </section>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
            Възникна грешка при зареждане от Supabase: {error.message}
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
            Няма публикувани продукти за preview.
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="mt-8 grid gap-6">
            {products.map((product) => {
              const images = sortImages(product.product_images);
              const mainImage = images[0];
              const mainImageUrl = mainImage?.storage_path
                ? supabase.storage
                    .from("product-images")
                    .getPublicUrl(mainImage.storage_path).data.publicUrl
                : null;
              const specs = sortSpecs(product.product_specs);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20"
                >
                  <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <div className="relative min-h-80 bg-white">
                      {mainImageUrl ? (
                        <Image
                          src={mainImageUrl}
                          alt={mainImage.alt_text || product.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 360px"
                          className="object-contain p-6"
                        />
                      ) : (
                        <div className="flex h-full min-h-80 items-center justify-center bg-slate-900 text-5xl">
                          ♫
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                            {getRelationName(product.brands)}
                          </p>

                          <h3 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                            {product.name}
                          </h3>

                          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                            {getRelationName(product.categories)} ·{" "}
                            {getRelationName(product.subcategories)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${getStockClassName(
                            product.stock_status,
                          )}`}
                        >
                          {getStockLabel(product.stock_status)}
                        </span>
                      </div>

                      <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                        {product.short_description || product.description || "—"}
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            Цена
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {formatPrice(product.price_amount, product.currency)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            Снимки
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {images.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            Specs
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">
                            {specs.length}
                          </p>
                        </div>
                      </div>

                      {product.badges && product.badges.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {product.badges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-sky-100"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}

                      {specs.length > 0 && (
                        <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                          <p className="text-lg font-black text-white">
                            Основни характеристики
                          </p>

                          <div className="mt-4 divide-y divide-white/10">
                            {specs.map((spec) => (
                              <div
                                key={`${spec.label}-${spec.value}`}
                                className="grid gap-2 py-3 sm:grid-cols-[220px_minmax(0,1fr)]"
                              >
                                <p className="font-bold text-slate-400">
                                  {spec.label}
                                </p>
                                <p className="text-white">{spec.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-slate-200"
                        >
                          Стар публичен детайл
                        </Link>

                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.1]"
                        >
                          Редакция
                        </Link>

                        <Link
                          href={`/admin/products/${product.id}/images`}
                          className="rounded-full border border-sky-400/25 bg-sky-400/10 px-5 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                        >
                          Снимки
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
