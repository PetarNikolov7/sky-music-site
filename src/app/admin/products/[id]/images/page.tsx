import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";
import ImageUploadForm from "./ImageUploadForm";
import { deleteProductImage, setPrimaryProductImage } from "./actions";

export const metadata: Metadata = {
  title: "Admin продуктови снимки",
  robots: {
    index: false,
    follow: false,
  },
};

type ProductImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    uploaded?: string;
    primaryUpdated?: string;
    deleted?: string;
    error?: string;
  }>;
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductImage = {
  id: string;
  storage_bucket: string | null;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
  created_at: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  is_published: boolean | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
  product_images: ProductImage[] | null;
};

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "—";
  }

  return value?.name ?? "—";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ProductImagesPage({
  params,
  searchParams,
}: ProductImagesPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        is_published,
        brands(name),
        categories(name),
        subcategories(name),
        product_images(id, storage_bucket, storage_path, alt_text, sort_order, is_primary, created_at)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as unknown as ProductRow;
  const images = [...(product.product_images ?? [])].sort((first, second) => {
    const firstOrder = first.sort_order ?? 0;
    const secondOrder = second.sort_order ?? 0;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return (first.created_at ?? "").localeCompare(second.created_at ?? "");
  });

  const nextSortOrder =
    images.length > 0
      ? Math.max(...images.map((image) => image.sort_order ?? 0)) + 1
      : 0;

  return (
    <AdminShell
      activePage="products"
      title="Снимки на продукт"
      description="Качване и управление на продуктови изображения."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-7 md:flex-row md:items-end md:p-9">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Product Images v0.3b
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight">
            {product.name}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em]">
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-slate-300">
              {getRelationName(product.categories)}
            </span>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-slate-300">
              {getRelationName(product.subcategories)}
            </span>
            <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-slate-300">
              {getRelationName(product.brands)}
            </span>
            {!product.is_published && (
              <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-amber-200 ring-1 ring-amber-400/20">
                Скрит
              </span>
            )}
          </div>
        </div>

        <Link
          href="/admin/products"
          className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
        >
          Назад към продуктите
        </Link>
      </div>

      {query.error && (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold leading-7 text-red-200">
          {query.error}
        </div>
      )}

      {query.uploaded && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Снимката беше качена успешно.
        </div>
      )}

      {query.primaryUpdated && (
        <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] p-5 text-sm font-bold leading-7 text-sky-100">
          Основната снимка беше обновена.
        </div>
      )}

      {query.deleted && (
        <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] p-5 text-sm font-bold leading-7 text-sky-100">
          Снимката беше премахната.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <ImageUploadForm
          productId={product.id}
          productName={product.name}
          nextSortOrder={nextSortOrder}
          hasImages={images.length > 0}
        />

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                Галерия
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Качени снимки
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Общо: {images.length}
            </p>
          </div>

          {images.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-3xl text-slate-500">
                🖼️
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Все още няма снимки.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
                Първата качена снимка автоматично ще стане основна снимка на
                продукта.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-5">
              {images.map((image) => {
                const imageUrl = image.storage_path
                  ? supabase.storage
                      .from("product-images")
                      .getPublicUrl(image.storage_path).data.publicUrl
                  : null;

                return (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                  >
                    <div className="grid gap-5 p-4 md:grid-cols-[180px_minmax(0,1fr)] md:p-5">
                      <div className="rounded-2xl bg-white p-3">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={image.alt_text || product.name}
                            className="h-40 w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center text-slate-500">
                            Няма URL
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {image.is_primary ? (
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 ring-1 ring-emerald-400/20">
                              Основна
                            </span>
                          ) : (
                            <form
                              action={setPrimaryProductImage.bind(
                                null,
                                product.id,
                                image.id,
                              )}
                            >
                              <button
                                type="submit"
                                className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white transition hover:bg-white/[0.09]"
                              >
                                Направи основна
                              </button>
                            </form>
                          )}

                          <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300">
                            Ред: {image.sort_order ?? 0}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {image.alt_text || product.name}
                        </p>

                        <p className="mt-3 break-all text-xs leading-6 text-slate-600">
                          {image.storage_path}
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                          Качена: {formatDate(image.created_at)}
                        </p>

                        <form
                          action={deleteProductImage.bind(
                            null,
                            product.id,
                            image.id,
                          )}
                          className="mt-5"
                        >
                          <button
                            type="submit"
                            className="cursor-pointer rounded-full border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-xs font-black text-red-200 transition hover:bg-red-400/[0.14]"
                          >
                            Изтрий снимката
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
