import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublishedCatalogData } from "@/lib/catalog/supabaseCatalog";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: "Catalog adapter test",
  robots: {
    index: false,
    follow: false,
  },
};

async function requireAdmin() {
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

  return {
    user,
    adminProfile,
  };
}

export default async function CatalogAdapterTestPage() {
  const { user, adminProfile } = await requireAdmin();

  let catalogData;
  let errorMessage = "";

  try {
    catalogData = await getPublishedCatalogData();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Възникна грешка при зареждане на Supabase catalog adapter.";
  }

  const publishedProducts = catalogData?.products ?? [];
  const totalSubcategories =
    catalogData?.catalogCategories.reduce(
      (total, category) => total + category.subcategories.length,
      0,
    ) ?? 0;
  const featuredProducts = publishedProducts.filter((product) => product.featured);
  const yamahaC40 = publishedProducts.find((product) => product.slug === "yamaha-c40");
  const hiddenTestProductVisible = publishedProducts.some(
    (product) => product.slug === "test-product-sky-music",
  );

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/10 bg-[#060914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
              SKY MUSIC BG / ADMIN
            </p>

            <h1 className="mt-3 text-2xl font-black">
              Supabase catalog adapter test
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              Табло
            </Link>

            <Link
              href="/admin/catalog-preview"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              Catalog preview
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
            Public Catalog Adapter v0.6b-safe
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            Данните от Supabase са отделени от публичния UI.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Тази вътрешна страница тества read adapter-а преди да пипаме
            публичния каталог. Публичният <strong>/products</strong> остава
            стабилен, докато този слой не бъде потвърден.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
            Admin: {adminProfile.display_name || "Admin"} · {user.email}
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-6 text-red-200">
            <p className="font-black">Грешка при adapter теста</p>
            <p className="mt-3 text-sm leading-7">{errorMessage}</p>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                {
                  label: "Категории",
                  value: catalogData?.catalogCategories.length ?? 0,
                },
                {
                  label: "Подкатегории",
                  value: totalSubcategories,
                },
                {
                  label: "Марки",
                  value: catalogData?.brands.length ?? 0,
                },
                {
                  label: "Публикувани",
                  value: publishedProducts.length,
                },
                {
                  label: "Featured",
                  value: featuredProducts.length,
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
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-2">
              <div
                className={
                  yamahaC40
                    ? "rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-5"
                    : "rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5"
                }
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  YAMAHA C40
                </p>

                <p className="mt-3 text-xl font-black">
                  {yamahaC40 ? "Намерен" : "Липсва"}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Очакваме публикуван продукт с slug <strong>yamaha-c40</strong>.
                </p>
              </div>

              <div
                className={
                  hiddenTestProductVisible
                    ? "rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5"
                    : "rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] p-5"
                }
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Скрит тестов продукт
                </p>

                <p className="mt-3 text-xl font-black">
                  {hiddenTestProductVisible ? "Вижда се — проблем" : "Не се вижда"}
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Adapter-ът трябва да връща само <strong>is_published=true</strong>.
                </p>
              </div>
            </section>

            {yamahaC40 && (
              <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-7">
                <div className="grid gap-7 lg:grid-cols-[320px_1fr]">
                  <div>
                    {yamahaC40.image ? (
                      <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-white">
                        <Image
                          src={yamahaC40.image}
                          alt={yamahaC40.name}
                          fill
                          sizes="320px"
                          className="object-contain p-5"
                        />
                      </div>
                    ) : (
                      <div className="flex h-72 items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 text-slate-500">
                        Няма снимка
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xl font-black">{yamahaC40.images.length}</p>
                        <p className="mt-1 text-slate-500">снимки</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xl font-black">{yamahaC40.specs.length}</p>
                        <p className="mt-1 text-slate-500">specs</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xl font-black">
                          {yamahaC40.featured ? "Да" : "Не"}
                        </p>
                        <p className="mt-1 text-slate-500">featured</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                      {yamahaC40.brand}
                    </p>

                    <h3 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                      {yamahaC40.name}
                    </h3>

                    <p className="mt-4 text-slate-400">
                      {yamahaC40.category} · {yamahaC40.subcategory}
                    </p>

                    <p className="mt-5 text-3xl font-black">{yamahaC40.price}</p>

                    <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
                      {yamahaC40.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {yamahaC40.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-sky-100"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 overflow-hidden rounded-2xl border border-white/10">
                      {yamahaC40.specs.map((spec) => (
                        <div
                          key={`${spec.label}-${spec.value}`}
                          className="grid gap-2 border-b border-white/10 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[0.9fr_1.1fr]"
                        >
                          <p className="font-bold text-slate-400">{spec.label}</p>
                          <p className="text-white">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-7">
              <h3 className="text-2xl font-black">Категории от adapter-а</h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {catalogData?.catalogCategories.map((category) => (
                  <div
                    key={category.name}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="font-black">{category.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {category.subcategories.length} подкатегории
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
