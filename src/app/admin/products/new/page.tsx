import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Нов продукт",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminNewProductPlaceholderPage() {
  const { user, adminProfile } = await requireAdmin();

  return (
    <AdminShell
      activePage="products"
      title="Нов продукт"
      description="Формата за добавяне на продукт ще бъде активирана в следващия batch."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Следващ етап
        </p>

        <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight">
          Тук ще бъде формата за добавяне на продукт.
        </h2>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">
          Първо потвърждаваме, че Admin панелът чете продуктите от Supabase.
          След това добавяме реална форма за име, категория, марка, цена,
          наличност, публикуване и снимки.
        </p>

        <Link
          href="/admin/products"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-slate-200"
        >
          Назад към продуктите
        </Link>
      </section>
    </AdminShell>
  );
}
