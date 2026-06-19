import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Следващи стъпки за продукт",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProductNextPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    created?: string;
  }>;
};

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
  name: string | null;
  is_published: boolean | null;
  product_images: ProductImageRow[] | null;
  product_specs: ProductSpecRow[] | null;
};

function getStepState(ok: boolean) {
  return ok
    ? {
        label: "OK",
        className:
          "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-100",
      }
    : {
        label: "Остава",
        className: "border-amber-400/20 bg-amber-400/[0.08] text-amber-100",
      };
}

export default async function AdminProductNextPage({
  params,
  searchParams,
}: AdminProductNextPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        is_published,
        product_images(id, is_primary),
        product_specs(id)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as unknown as ProductRow;
  const images = product.product_images ?? [];
  const specs = product.product_specs ?? [];
  const hasImages = images.length > 0;
  const hasPrimaryImage = images.some((image) => image.is_primary);
  const hasSpecs = specs.length > 0;
  const isPublished = Boolean(product.is_published);
  const hasSlug = Boolean(product.slug);

  const steps = [
    {
      title: "1. Провери основните данни",
      description:
        "Име, slug, цена, марка, категория, подкатегория, наличност и publish статус.",
      href: `/admin/products/${product.id}/edit`,
      button: "Редакция",
      ok: true,
    },
    {
      title: "2. Качи снимки",
      description: hasImages
        ? `Има ${images.length} качени снимки. ${hasPrimaryImage ? "Основната снимка е избрана." : "Избери основна снимка."}`
        : "Качи поне една снимка и избери основна снимка.",
      href: `/admin/products/${product.id}/images`,
      button: "Снимки",
      ok: hasImages && hasPrimaryImage,
    },
    {
      title: "3. Добави характеристики",
      description: hasSpecs
        ? `Има ${specs.length} характеристики.`
        : "Добави спецификации от доставчик или ги въведи ръчно.",
      href: `/admin/products/${product.id}/specs`,
      button: "Характеристики",
      ok: hasSpecs,
    },
    {
      title: "4. Провери готовност",
      description:
        "Readiness страницата показва дали продуктът е готов за публичния каталог.",
      href: "/admin/products/readiness",
      button: "Проверка готовност",
      ok: hasImages && hasPrimaryImage && hasSpecs,
    },
    {
      title: "5. Admin preview",
      description:
        "Прегледай продукта като клиент, без да го публикуваш в публичния каталог.",
      href: `/admin/products/${product.id}/preview`,
      button: "Admin preview",
      ok: hasImages && hasPrimaryImage,
    },
    {
      title: "6. Publish",
      description: isPublished
        ? "Продуктът вече е публикуван."
        : "Публикувай чак когато снимките, характеристиките и данните са готови.",
      href: `/admin/products/${product.id}/edit`,
      button: isPublished ? "Провери publish" : "Publish от редакция",
      ok: isPublished,
    },
  ];

  return (
    <AdminShell
      activePage="products"
      title="Следващи стъпки"
      description="Практичен workflow след създаване на продукт."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Product Workflow v1.0e
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {query.created ? "Продуктът е създаден" : "Workflow за продукт"}
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              {product.name || "Нов продукт"} вече е в базата. Следвай
              стъпките по-долу, за да го подготвиш безопасно преди публично
              показване.
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

      <section className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-black">{product.name || "Без име"}</h3>
            <p className="mt-2 text-sm text-slate-400">
              Slug: {product.slug || "—"} · Снимки: {images.length} ·
              Характеристики: {specs.length} · Статус:{" "}
              {isPublished ? "Published" : "Hidden"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/admin/products/${product.id}/preview`}
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
            >
              Admin preview
            </Link>

            {hasSlug && isPublished ? (
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
              >
                Преглед в сайта
              </Link>
            ) : (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] px-5 py-3 text-sm font-bold text-amber-100">
                Публичният preview ще е активен след publish.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {steps.map((step) => {
          const state = getStepState(step.ok);

          return (
            <article
              key={step.title}
              className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 md:p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${state.className}`}
                    >
                      {state.label}
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>

                <Link
                  href={step.href}
                  className="rounded-full border border-sky-400/25 bg-sky-400/10 px-5 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                >
                  {step.button}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-400 md:p-6">
        <p className="font-black text-white">Работен ред:</p>
        <p className="mt-2">
          Не публикувай продукт само с име и цена. Първо качи снимка, добави
          характеристики, провери readiness, после publish.
        </p>
      </div>
    </AdminShell>
  );
}
