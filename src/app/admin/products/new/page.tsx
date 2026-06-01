import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";
import ProductForm from "../ProductForm";

type AdminNewProductPageProps = {
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

export const metadata: Metadata = {
  title: "Нов продукт",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminNewProductPage({
  searchParams,
}: AdminNewProductPageProps) {
  const params = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const [{ data: categoriesData }, { data: subcategoriesData }, { data: brandsData }] =
    await Promise.all([
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

  return (
    <AdminShell
      activePage="products"
      title="Нов продукт"
      description="Добавяне на продукт в Supabase каталога."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-7 md:flex-row md:items-end md:p-9">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Admin Product Create v0.2
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight">
            Добавяне на продукт
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Първата работеща форма записва продукт в базата. Снимките ще бъдат добавени в отделен Storage batch.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
        >
          Назад към продуктите
        </Link>
      </div>

      {params.error && (
        <div className="mb-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold leading-7 text-red-200">
          {params.error}
        </div>
      )}

      {formCategories.length === 0 ? (
        <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.08] p-8 text-amber-100">
          <h3 className="text-2xl font-black">Липсват категории.</h3>
          <p className="mt-4 text-sm leading-7">
            Първо трябва да се изпълни taxonomy seed migration-ът за категории и подкатегории.
          </p>
        </div>
      ) : (
        <ProductForm categories={formCategories} brands={brands} />
      )}
    </AdminShell>
  );
}
