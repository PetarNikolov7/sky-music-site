import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Admin product readiness",
  robots: {
    index: false,
    follow: false,
  },
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductImageRow = {
  id: string;
  is_primary: boolean | null;
};

type ProductSpecRow = {
  id: string;
};

type ProductRow = {
  id: string;
  slug: string | null;
  sku: string | null;
  name: string | null;
  short_description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  updated_at: string | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
  product_images: ProductImageRow[] | null;
  product_specs: ProductSpecRow[] | null;
};

type ReadinessItem = {
  key: string;
  label: string;
  ok: boolean;
  actionHref?: string;
  actionLabel?: string;
};

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "";
  }

  return value?.name ?? "";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Sofia",
  }).format(new Date(value));
}

function formatPrice(value: number | string | null, currency: string | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;

  if (!Number.isFinite(numeric)) {
    return `${value} ${currency ?? ""}`.trim();
  }

  return (
    new Intl.NumberFormat("bg-BG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric) + ` ${currency ?? "EUR"}`
  );
}

function getReadinessItems(product: ProductRow): ReadinessItem[] {
  const brand = getRelationName(product.brands);
  const category = getRelationName(product.categories);
  const subcategory = getRelationName(product.subcategories);
  const images = product.product_images ?? [];
  const specs = product.product_specs ?? [];
  const hasPrimaryImage = images.some((image) => image.is_primary);

  return [
    {
      key: "name",
      label: "Име",
      ok: Boolean(product.name?.trim()),
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Редакция",
    },
    {
      key: "slug",
      label: "Slug",
      ok: Boolean(product.slug?.trim()),
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Редакция",
    },
    {
      key: "price",
      label: "Цена",
      ok: product.price_amount !== null && product.price_amount !== undefined,
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Редакция",
    },
    {
      key: "brand",
      label: "Марка",
      ok: Boolean(brand),
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Редакция",
    },
    {
      key: "category",
      label: "Категория",
      ok: Boolean(category && subcategory),
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Редакция",
    },
    {
      key: "images",
      label: `Снимки (${images.length})`,
      ok: images.length > 0,
      actionHref: `/admin/products/${product.id}/images`,
      actionLabel: "Снимки",
    },
    {
      key: "primary-image",
      label: "Основна снимка",
      ok: hasPrimaryImage,
      actionHref: `/admin/products/${product.id}/images`,
      actionLabel: "Снимки",
    },
    {
      key: "specs",
      label: `Характеристики (${specs.length})`,
      ok: specs.length > 0,
      actionHref: `/admin/products/${product.id}/specs`,
      actionLabel: "Характеристики",
    },
    {
      key: "published",
      label: "Публикуван",
      ok: Boolean(product.is_published),
      actionHref: `/admin/products/${product.id}/edit`,
      actionLabel: "Publish",
    },
  ];
}

function getProductScore(product: ProductRow) {
  const items = getReadinessItems(product);
  const okCount = items.filter((item) => item.ok).length;

  return {
    okCount,
    totalCount: items.length,
    percent: Math.round((okCount / items.length) * 100),
    isReady: okCount === items.length,
  };
}

function getScoreClass(percent: number) {
  if (percent === 100) {
    return "bg-emerald-400/10 text-emerald-100 ring-1 ring-emerald-400/20";
  }

  if (percent >= 70) {
    return "bg-amber-400/10 text-amber-100 ring-1 ring-amber-400/20";
  }

  return "bg-red-400/10 text-red-100 ring-1 ring-red-400/20";
}

export default async function AdminProductsReadinessPage() {
  const { supabase, user, adminProfile } = await requireAdmin();

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
        updated_at,
        brands(name),
        categories(name),
        subcategories(name),
        product_images(id, is_primary),
        product_specs(id)
      `,
    )
    .order("updated_at", { ascending: false });

  const products = (data ?? []) as unknown as ProductRow[];
  const readyProducts = products.filter((product) => getProductScore(product).isReady);
  const publishedProducts = products.filter((product) => product.is_published);
  const needsWorkProducts = products.filter(
    (product) => !getProductScore(product).isReady,
  );

  return (
    <AdminShell
      activePage="products"
      title="Product readiness"
      description="Проверка дали продуктите са готови за публикуване."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Product Workflow v1.0a
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Product readiness checklist
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Тази страница показва кои продукти са готови за публичния каталог
              и кои имат липсващи снимки, характеристики, цена, категория или
              publish статус.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              ← Продукти
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-full bg-sky-400 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-sky-300"
            >
              Нов продукт
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Всички",
            value: products.length,
            description: "продукти в базата",
          },
          {
            label: "Готови",
            value: readyProducts.length,
            description: "100% checklist",
          },
          {
            label: "Публикувани",
            value: publishedProducts.length,
            description: "видими публично",
          },
          {
            label: "За работа",
            value: needsWorkProducts.length,
            description: "има липсващи елементи",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-4 text-3xl font-black">{item.value}</p>

            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </section>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
          Възникна грешка при зареждане на продуктите: {error.message}
        </div>
      )}

      {!error && products.length === 0 && (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center md:p-14">
          <h3 className="text-2xl font-black">Все още няма продукти.</h3>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Създайте първия продукт и след това проверете readiness checklist-а.
          </p>

          <Link
            href="/admin/products/new"
            className="mt-7 inline-flex rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black transition hover:bg-sky-300"
          >
            Нов продукт
          </Link>
        </div>
      )}

      {!error && products.length > 0 && (
        <section className="mt-8 grid gap-6">
          {products.map((product) => {
            const brand = getRelationName(product.brands);
            const category = getRelationName(product.categories);
            const subcategory = getRelationName(product.subcategories);
            const readiness = getProductScore(product);
            const items = getReadinessItems(product);
            const missingItems = items.filter((item) => !item.ok);

            return (
              <article
                key={product.id}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-sky-400/30 hover:bg-white/[0.06] md:p-6"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black leading-tight">
                        {product.name || "Без име"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${getScoreClass(
                          readiness.percent,
                        )}`}
                      >
                        {readiness.percent}% готов
                      </span>

                      {product.is_published ? (
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-100 ring-1 ring-emerald-400/20">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-slate-300 ring-1 ring-white/10">
                          Hidden
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      Updated: {formatDate(product.updated_at)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      {product.sku && (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-300">
                          SKU: {product.sku}
                        </span>
                      )}

                      <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-sky-100">
                        {brand || "Марка липсва"}
                      </span>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-300">
                        {category || "Категория липсва"}
                        {subcategory ? ` · ${subcategory}` : ""}
                      </span>

                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-300">
                        {formatPrice(product.price_amount, product.currency)}
                      </span>
                    </div>

                    {missingItems.length > 0 ? (
                      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-4">
                        <p className="text-sm font-black text-amber-100">
                          Липсва или трябва да се провери:
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {missingItems.map((item) => (
                            <Link
                              key={item.key}
                              href={item.actionHref ?? `/admin/products/${product.id}/edit`}
                              className="rounded-full border border-amber-400/20 bg-black/20 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-400/10"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-sm font-bold text-emerald-100">
                        Този продукт изглежда готов за публичния каталог.
                      </div>
                    )}

                    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <div
                          key={item.key}
                          className={
                            item.ok
                              ? "rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-sm text-emerald-100"
                              : "rounded-xl border border-red-400/15 bg-red-400/[0.06] px-3 py-2 text-sm text-red-100"
                          }
                        >
                          <span className="font-black">
                            {item.ok ? "✓" : "!"}
                          </span>{" "}
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:w-56 xl:grid-cols-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full bg-sky-400 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-sky-300"
                    >
                      Редакция
                    </Link>

                    <Link
                      href={`/admin/products/${product.id}/images`}
                      className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
                    >
                      Снимки
                    </Link>

                    <Link
                      href={`/admin/products/${product.id}/specs`}
                      className="rounded-full border border-sky-400/25 bg-sky-400/10 px-5 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                    >
                      Характеристики
                    </Link>

                    {product.slug && product.is_published && (
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
                      >
                        Преглед в сайта
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AdminShell>
  );
}
