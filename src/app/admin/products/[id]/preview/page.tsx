import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Admin product preview",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProductPreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductImageRow = {
  id: string;
  storage_bucket: string | null;
  storage_path: string | null;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

type ProductImageView = ProductImageRow & {
  publicUrl: string;
};

type ProductSpecRow = {
  id: string;
  label: string | null;
  value: string | null;
  sort_order: number | null;
};

type ProductRow = {
  id: string;
  slug: string | null;
  sku: string | null;
  name: string | null;
  short_description: string | null;
  description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
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

function getStockLabel(value: string | null) {
  if (value === "available") {
    return "Наличен";
  }

  if (value === "on_request") {
    return "По заявка";
  }

  if (value === "out_of_stock") {
    return "Изчерпан";
  }

  return value || "—";
}

function sortByOrder<T extends { sort_order: number | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
}

export default async function AdminProductPreviewPage({
  params,
}: AdminProductPreviewPageProps) {
  const { id } = await params;
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
        description,
        price_amount,
        currency,
        stock_status,
        is_published,
        is_featured,
        brands(name),
        categories(name),
        subcategories(name),
        product_images(id, storage_bucket, storage_path, alt_text, is_primary, sort_order),
        product_specs(id, label, value, sort_order)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as unknown as ProductRow;
  const imageRows = sortByOrder(product.product_images ?? []);
  const images: ProductImageView[] = imageRows.map((image) => {
    const bucketName = image.storage_bucket || "product-images";
    const publicUrl = image.storage_path
      ? supabase.storage.from(bucketName).getPublicUrl(image.storage_path).data.publicUrl
      : "";

    return {
      ...image,
      publicUrl,
    };
  });

  const specs = sortByOrder(product.product_specs ?? []);
  const primaryImage = images.find((image) => image.is_primary) ?? images[0];
  const brand = getRelationName(product.brands);
  const category = getRelationName(product.categories);
  const subcategory = getRelationName(product.subcategories);
  const isPublished = Boolean(product.is_published);
  const publicHref = product.slug ? `/products/${product.slug}` : "";

  return (
    <AdminShell
      activePage="products"
      title="Admin preview"
      description="Вътрешен преглед на продукт преди публикуване."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Product Preview v1.0e-fix
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Преглед преди publish
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Това е admin-only preview. Може да преглеждаш продукта тук, дори
              когато е скрит от публичния каталог.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/admin/products/${product.id}/next`}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              ← Следващи стъпки
            </Link>

            <Link
              href={`/admin/products/${product.id}/edit`}
              className="rounded-full bg-sky-400 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-sky-300"
            >
              Редакция
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-black">{product.name || "Без име"}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {brand} · {category} · {subcategory} · SKU: {product.sku || "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isPublished ? (
              <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-100 ring-1 ring-emerald-400/20">
                Published
              </span>
            ) : (
              <span className="rounded-full bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-100 ring-1 ring-amber-400/20">
                Hidden / draft
              </span>
            )}

            {isPublished && publicHref && (
              <Link
                href={publicHref}
                target="_blank"
                className="rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-slate-200"
              >
                Отвори публично
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          {primaryImage?.publicUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.publicUrl}
              alt={primaryImage.alt_text || product.name || "Product image"}
              className="aspect-square w-full rounded-[1.5rem] bg-white object-contain"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 text-center text-sm font-bold text-slate-400">
              Няма основна снимка
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-5 grid grid-cols-4 gap-3">
              {images.slice(0, 8).map((image) => (
                <div
                  key={image.id}
                  className="rounded-xl border border-white/10 bg-white p-1"
                >
                  {image.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.publicUrl}
                      alt={image.alt_text || product.name || "Product image"}
                      className="aspect-square w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="aspect-square rounded-lg bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-black text-sky-100">
              {getStockLabel(product.stock_status)}
            </span>

            {product.is_featured && (
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-black text-amber-100">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight">
            {product.name || "Без име"}
          </h1>

          {product.short_description && (
            <p className="mt-5 text-base leading-8 text-slate-300">
              {product.short_description}
            </p>
          )}

          <p className="mt-6 text-4xl font-black text-sky-200">
            {formatPrice(product.price_amount, product.currency)}
          </p>

          {product.description && (
            <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              {product.description}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              Product specs
            </p>

            <h3 className="mt-3 text-2xl font-black">Характеристики</h3>
          </div>

          <span className="text-sm font-bold text-slate-400">
            {specs.length} позиции
          </span>
        </div>

        {specs.length > 0 ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {specs.map((spec) => (
              <div
                key={spec.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {spec.label || "—"}
                </p>

                <p className="mt-2 text-sm font-bold text-slate-100">
                  {spec.value || "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-5 text-sm font-bold text-amber-100">
            Все още няма характеристики. Добави ги преди publish.
          </div>
        )}
      </section>
    </AdminShell>
  );
}
