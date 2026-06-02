import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";
import ProductForm, { type ProductFormInitialValues } from "../../ProductForm";

type AdminEditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number | null;
};

type SubcategoryRow = {
  id: string;
  category_id: string;
  name: string;
  sort_order: number | null;
};

type BrandRow = {
  id: string;
  name: string;
};

type ProductRow = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  brand_id: string | null;
  category_id: string;
  subcategory_id: string;
  short_description: string | null;
  description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  badges: string[] | null;
  is_published: boolean | null;
  is_featured: boolean | null;
};

export const metadata: Metadata = {
  title: "Редакция на продукт",
  robots: {
    index: false,
    follow: false,
  },
};

function formatPriceForInput(value: number | string | null) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return value.toFixed(2).replace(".", ",");
  }

  return value.replace(".", ",");
}

export default async function AdminEditProductPage({
  params,
  searchParams,
}: AdminEditProductPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const [
    { data: productData, error: productError },
    { data: categoriesData },
    { data: subcategoriesData },
    { data: brandsData },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
          id,
          slug,
          sku,
          name,
          brand_id,
          category_id,
          subcategory_id,
          short_description,
          description,
          price_amount,
          currency,
          stock_status,
          badges,
          is_published,
          is_featured
        `,
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("subcategories")
      .select("id, category_id, name, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("brands")
      .select("id, name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (productError || !productData) {
    notFound();
  }

  const product = productData as unknown as ProductRow;
  const categories = (categoriesData ?? []) as CategoryRow[];
  const subcategories = (subcategoriesData ?? []) as SubcategoryRow[];
  const brands = (brandsData ?? []) as BrandRow[];

  const formCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: subcategories
      .filter((subcategory) => subcategory.category_id === category.id)
      .map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
      })),
  }));

  const initialValues: ProductFormInitialValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    brandId: product.brand_id ?? "",
    categoryId: product.category_id,
    subcategoryId: product.subcategory_id,
    shortDescription: product.short_description ?? "",
    description: product.description ?? "",
    priceAmount: formatPriceForInput(product.price_amount),
    currency: product.currency ?? "EUR",
    stockStatus: product.stock_status ?? "available",
    badges: product.badges ?? [],
    isPublished: Boolean(product.is_published),
    isFeatured: Boolean(product.is_featured),
  };

  return (
    <AdminShell
      activePage="products"
      title="Редакция на продукт"
      description="Промяна на продуктови данни, цена, категория, наличност и видимост."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-7 md:flex-row md:items-end md:p-9">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Admin Product Edit v0.4
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight">
            {product.name}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Редактирайте данните на продукта. Публикуването и скриването могат
            да се управляват и от списъка с продукти.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/admin/products/${product.id}/images`}
            className="rounded-full border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/15"
          >
            Снимки
          </Link>

          <Link
            href="/admin/products"
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
          >
            Назад към продуктите
          </Link>
        </div>
      </div>

      {query.error && (
        <div className="mb-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold leading-7 text-red-200">
          {query.error}
        </div>
      )}

      {formCategories.length === 0 ? (
        <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.08] p-8 text-amber-100">
          <h3 className="text-2xl font-black">Липсват категории.</h3>
          <p className="mt-4 text-sm leading-7">
            Първо трябва да се изпълни taxonomy seed migration-ът за категории
            и подкатегории.
          </p>
        </div>
      ) : (
        <ProductForm
          mode="edit"
          categories={formCategories}
          brands={brands}
          initialValues={initialValues}
        />
      )}
    </AdminShell>
  );
}
