import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";
import {
  createProductSpec,
  deleteProductSpec,
  replaceProductSpecsFromText,
  updateProductSpec,
} from "./actions";

export const metadata: Metadata = {
  title: "Admin характеристики",
  robots: {
    index: false,
    follow: false,
  },
};

type ProductSpecsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    bulkUpdated?: string;
    error?: string;
  }>;
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
};

type ProductSpecRow = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "—";
  }

  return value?.name ?? "—";
}

function createBulkSpecsText(specs: ProductSpecRow[]) {
  return specs
    .map((spec) => `${spec.label}: ${spec.value}`)
    .join("\n");
}

export default async function ProductSpecsPage({
  params,
  searchParams,
}: ProductSpecsPageProps) {
  const { id } = await params;
  const messages = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        sku,
        brands(name),
        categories(name),
        subcategories(name)
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (productError || !productData) {
    notFound();
  }

  const product = productData as unknown as ProductRow;

  const { data: specsData, error: specsError } = await supabase
    .from("product_specs")
    .select("id, label, value, sort_order, created_at, updated_at")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const specs = (specsData ?? []) as ProductSpecRow[];
  const nextSortOrder =
    specs.length > 0
      ? Math.max(...specs.map((spec) => spec.sort_order ?? 0)) + 10
      : 10;
  const bulkSpecsText = createBulkSpecsText(specs);

  return (
    <AdminShell
      activePage="products"
      title="Характеристики"
      description="Управление на product_specs за конкретен продукт."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-7 md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Product Specs v0.7b
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight">
              {product.name}
            </h2>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-slate-300">
                slug: {product.slug}
              </span>

              {product.sku && (
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-slate-300">
                  SKU: {product.sku}
                </span>
              )}

              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sky-100">
                {getRelationName(product.brands)}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-slate-300">
                {getRelationName(product.categories)} ·{" "}
                {getRelationName(product.subcategories)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              ← Продукти
            </Link>

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
          </div>
        </div>
      </div>

      {messages.created && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Характеристиката беше добавена успешно.
        </div>
      )}

      {messages.updated && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Характеристиката беше обновена успешно.
        </div>
      )}

      {messages.bulkUpdated && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold leading-7 text-emerald-200">
          Характеристиките бяха записани успешно. Записани редове:{" "}
          {messages.bulkUpdated}.
        </div>
      )}

      {messages.deleted && (
        <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] p-5 text-sm font-bold leading-7 text-sky-100">
          Характеристиката беше изтрита успешно.
        </div>
      )}

      {messages.error && (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold leading-7 text-red-200">
          {messages.error}
        </div>
      )}

      {specsError && (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm leading-7 text-red-200">
          <p className="font-black">Грешка при зареждане на характеристиките.</p>
          <p className="mt-2">{specsError.message}</p>
        </div>
      )}

      <section className="mt-8 rounded-[2rem] border border-sky-400/20 bg-sky-400/[0.06] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Бързо редактиране
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Копирайте характеристиките наведнъж
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Поставете всяка характеристика на нов ред във формат{" "}
              <strong>Име: Стойност</strong>. При запис системата ще замени
              текущите характеристики с тези редове и ще ги подреди автоматично.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-300">
            Текущи характеристики:{" "}
            <span className="font-black text-white">{specs.length}</span>
          </div>
        </div>

        <form action={replaceProductSpecsFromText} className="mt-7">
          <input type="hidden" name="product_id" value={product.id} />

          <label
            htmlFor="bulk-specs"
            className="mb-3 block text-sm font-bold text-slate-200"
          >
            Характеристики
          </label>

          <textarea
            id="bulk-specs"
            name="bulk_specs"
            defaultValue={bulkSpecsText}
            rows={14}
            placeholder={`Размер: 4/4 стандартен – 39"\nЧелна дъска: Смърч\nЗадна дъска и страници: Meranti\nГриф: Палисандър`}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 font-mono text-sm leading-7 text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
          />

          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-4 text-sm leading-7 text-amber-100">
            Внимание: този бутон заменя всички текущи характеристики на продукта
            с текста от голямото поле. Това е удобно при копиране от доставчик.
          </div>

          <button
            type="submit"
            className="mt-5 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 font-black text-white shadow-xl shadow-blue-950/30 transition hover:brightness-110"
          >
            Запази характеристиките
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Единичен ред
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Добавете характеристика ръчно
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Използвайте това само ако искате да добавите един отделен ред, без
              да заменяте целия списък.
            </p>
          </div>
        </div>

        <form
          action={createProductSpec}
          className="mt-7 grid gap-4 lg:grid-cols-[0.9fr_1.2fr_140px_auto]"
        >
          <input type="hidden" name="product_id" value={product.id} />

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Име
            </label>
            <input
              name="label"
              placeholder="Напр. Челна дъска"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Стойност
            </label>
            <input
              name="value"
              placeholder="Напр. Смърч"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Ред
            </label>
            <input
              name="sort_order"
              type="number"
              defaultValue={nextSortOrder}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-2xl bg-white px-5 py-3 font-black text-black transition hover:bg-slate-200"
            >
              Добави
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Списък
            </p>

            <h3 className="mt-3 text-3xl font-black">Текущи характеристики</h3>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400">
            За дребна поправка редактирайте конкретния ред отдолу. За масово
            копиране използвайте голямото поле горе.
          </p>
        </div>

        {specs.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-slate-400">
            Този продукт все още няма характеристики.
          </div>
        ) : (
          <div className="mt-7 grid gap-4">
            {specs.map((spec) => (
              <article
                key={spec.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5"
              >
                <form
                  action={updateProductSpec}
                  className="grid gap-4 lg:grid-cols-[120px_0.85fr_1.2fr_auto_auto]"
                >
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="spec_id" value={spec.id} />

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Ред
                    </label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={spec.sort_order}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Име
                    </label>
                    <input
                      name="label"
                      defaultValue={spec.label}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none focus:border-sky-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Стойност
                    </label>
                    <input
                      name="value"
                      defaultValue={spec.value}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none focus:border-sky-400"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-xl bg-sky-400 px-4 py-3 text-sm font-black text-black transition hover:bg-sky-300"
                    >
                      Запази
                    </button>
                  </div>

                  <div className="flex items-end">
                    <button
                      form={`delete-spec-${spec.id}`}
                      type="submit"
                      className="w-full cursor-pointer rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-400/[0.14]"
                    >
                      Изтрий
                    </button>
                  </div>
                </form>

                <form
                  id={`delete-spec-${spec.id}`}
                  action={deleteProductSpec}
                  className="hidden"
                >
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="spec_id" value={spec.id} />
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
