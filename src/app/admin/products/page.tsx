import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Admin продукти",
  robots: {
    index: false,
    follow: false,
  },
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductStockStatus = "available" | "on_request" | "out_of_stock";

type ProductImageRow = {
  storage_path: string | null;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

type AdminProductRow = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  short_description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: ProductStockStatus | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
  product_images: ProductImageRow[] | null;
};

type AdminProductsPageProps = {
  searchParams: Promise<{
    created?: string;
    imageUploaded?: string;
    imageDeleted?: string;
  }>;
};

const stockStatusLabels: Record<ProductStockStatus, string> = {
  available: "Наличен",
  on_request: "По заявка",
  out_of_stock: "Изчерпан",
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

  return (
    new Intl.NumberFormat("bg-BG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount) + ` ${currency ?? "EUR"}`
  );
}

function getStockLabel(status: ProductStockStatus | null) {
  return status ? stockStatusLabels[status] : "—";
}

function getStockClassName(status: ProductStockStatus | null) {
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

function getPrimaryImage(images: ProductImageRow[] | null) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    images.find((image) => image.is_primary) ??
    [...images].sort((first, second) => {
      const firstOrder = first.sort_order ?? 0;
      const secondOrder = second.sort_order ?? 0;
      return firstOrder - secondOrder;
    })[0]
  );
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
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
        created_at,
        updated_at,
        brands(name),
        categories(name),
        subcategories(name),
        product_images(storage_path, alt_text, is_primary, sort_order)
      `,
    )
    .order("updated_at", { ascending: false });

  const products = (data ?? []) as unknown as AdminProductRow[];

  return (
    <AdminShell
      activePage="products"
      title="Продукти"
      description="Управление на продуктите в базата данни."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-7 md:flex-row md:items-end md:p-9">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Admin Products v0.3b
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight">
            Продуктов каталог
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Продуктите вече могат да имат снимки от Supabase Storage. Отворете
            „Снимки“ към продукт, за да качите основно изображение и галерия.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-950/30 transition hover:brightness-110"
        >
          Добави продукт
        </Link>
      </div>

      {params.created && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Продуктът „{params.created}“ беше създаден успешно.
        </div>
      )}

      {params.imageUploaded && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Снимката беше качена успешно.
        </div>
      )}

      {params.imageDeleted && (
        <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] p-5 text-sm font-bold leading-7 text-sky-100">
          Снимката беше премахната успешно.
        </div>
      )}

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
            Със снимки
          </p>

          <p className="mt-4 text-3xl font-black">
            {products.filter((product) => product.product_images?.length).length}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm leading-7 text-red-200">
          <p className="font-black">Грешка при зареждане на продуктите.</p>
          <p className="mt-2">{error.message}</p>
        </div>
      )}

      {!error && products.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/10 text-3xl ring-1 ring-sky-400/20">
            🎸
          </div>

          <h3 className="mt-6 text-3xl font-black">
            Все още няма продукти в базата.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Формата за добавяне е активна. След създаване на продукт ще можете
            да качвате снимки към него.
          </p>

          <Link
            href="/admin/products/new"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-slate-200"
          >
            Добави първия продукт
          </Link>
        </section>
      )}

      {!error && products.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="hidden grid-cols-[0.5fr_1.1fr_0.72fr_0.65fr_0.56fr_0.56fr] gap-5 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 lg:grid">
            <p>Снимка</p>
            <p>Продукт</p>
            <p>Категория</p>
            <p>Марка</p>
            <p>Цена</p>
            <p>Статус</p>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => {
              const primaryImage = getPrimaryImage(product.product_images);
              const imageUrl = primaryImage?.storage_path
                ? supabase.storage
                    .from("product-images")
                    .getPublicUrl(primaryImage.storage_path).data.publicUrl
                : null;

              return (
                <article
                  key={product.id}
                  className="grid gap-5 px-5 py-5 lg:grid-cols-[0.5fr_1.1fr_0.72fr_0.65fr_0.56fr_0.56fr] lg:items-center lg:px-6"
                >
                  <div>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={primaryImage?.alt_text || product.name}
                        className="h-20 w-20 rounded-2xl border border-white/10 bg-white object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl text-slate-500">
                        ♫
                      </div>
                    )}
                  </div>

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

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${product.id}/images`}
                        className="rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-slate-200"
                      >
                        Снимки
                      </Link>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-400">
                        Редакция скоро
                      </span>
                    </div>

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
              );
            })}
          </div>
        </section>
      )}
    </AdminShell>
  );
}
