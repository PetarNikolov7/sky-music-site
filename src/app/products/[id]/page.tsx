import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery";
import SiteHeader from "@/components/SiteHeader";
import { products } from "@/data/products";

const phone = "+359884211761";
const whatsappNumber = "359884211761";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const categoryVisuals: Record<
  string,
  {
    icon: string;
    subtitle: string;
    gradient: string;
  }
> = {
  Клавишни: {
    icon: "🎹",
    subtitle: "Пиана, клавири, синтезатори и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(37,99,235,0.35), rgba(15,23,42,0.98))",
  },
  Струнни: {
    icon: "🎸",
    subtitle: "Китари, цигулки, усилватели и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(14,165,233,0.28), rgba(30,64,175,0.38), rgba(2,6,23,0.98))",
  },
  Озвучаване: {
    icon: "🔊",
    subtitle: "Тонколони, системи, пултове и усилватели",
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.24), rgba(30,64,175,0.34), rgba(2,6,23,0.98))",
  },
  Ударни: {
    icon: "🥁",
    subtitle: "Барабани, перкусии, палки и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(30,41,59,0.45), rgba(2,6,23,0.98))",
  },
  Духови: {
    icon: "🎷",
    subtitle: "Кларинети, саксофони, тромпети и флейти",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.22), rgba(30,64,175,0.32), rgba(2,6,23,0.98))",
  },
  Микрофони: {
    icon: "🎤",
    subtitle: "Кабелни, безжични и студийни микрофони",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.24), rgba(29,78,216,0.35), rgba(2,6,23,0.98))",
  },
  Студио: {
    icon: "🎚️",
    subtitle: "Аудио интерфейси, монитори и слушалки",
    gradient:
      "linear-gradient(135deg, rgba(96,165,250,0.26), rgba(15,23,42,0.55), rgba(0,0,0,0.98))",
  },
  Аксесоари: {
    icon: "🔌",
    subtitle: "Кабели, стойки, калъфи и куфари",
    gradient:
      "linear-gradient(135deg, rgba(148,163,184,0.22), rgba(30,64,175,0.28), rgba(2,6,23,0.98))",
  },
};

function getCategoryVisual(category: string) {
  return (
    categoryVisuals[category] ?? {
      icon: "🎵",
      subtitle: "Музикално оборудване и аксесоари",
      gradient:
        "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(30,64,175,0.35), rgba(2,6,23,0.98))",
    }
  );
}

function getStatusClass(status: string) {
  if (status === "Наличен") {
    return "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20";
  }

  if (status === "По заявка") {
    return "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20";
  }

  return "bg-red-400/10 text-red-300 ring-1 ring-red-400/20";
}

function makeWhatsappLink(productName: string) {
  const message = `Здравейте, интересувам се от ${productName}. Моля за повече информация.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function makeRequestLink(productName: string) {
  return `/request?product=${encodeURIComponent(productName)}`;
}

function makeCategoryLink(category: string) {
  return `/products?category=${encodeURIComponent(category)}`;
}

function makeSubcategoryLink(category: string, subcategory: string) {
  return `/products?category=${encodeURIComponent(
    category,
  )}&subcategory=${encodeURIComponent(subcategory)}`;
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      title: "Продуктът не е намерен | SKY MUSIC BG",
    };
  }

  return {
    title: `${product.name} | SKY MUSIC BG`,
    description: `${product.name} – ${product.description} Категория: ${product.category}. Вид: ${product.subcategory}. SKY MUSIC BG, Бургас.`,
    openGraph: {
      title: `${product.name} | SKY MUSIC BG`,
      description: product.description,
      type: "website",
      images: [
        {
          url: product.image || "/sky-music-logo-dark-header.png",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const visual = getCategoryVisual(product.category);
  const productBadges = (product.badges ?? []).filter(
    (badge) => badge !== product.status,
  );
  const productSpecs = product.specs ?? [];

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <SiteHeader activePage="products" />

        <nav
          aria-label="Навигация по продуктите"
          className="flex flex-wrap items-center gap-2 pt-9 text-sm text-slate-400"
        >
          <a
            href="/products"
            className="cursor-pointer transition hover:text-white"
          >
            Продукти
          </a>

          <span className="text-slate-600">→</span>

          <a
            href={makeCategoryLink(product.category)}
            className="cursor-pointer transition hover:text-white"
          >
            {product.category}
          </a>

          <span className="text-slate-600">→</span>

          <a
            href={makeSubcategoryLink(product.category, product.subcategory)}
            className="cursor-pointer font-bold text-sky-300 transition hover:text-sky-200"
          >
            {product.subcategory}
          </a>
        </nav>

        <section className="grid gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            {galleryImages.length > 0 ? (
              <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40">
                <ProductImageGallery
                  productName={product.name}
                  images={galleryImages}
                  fallbackImage={product.image}
                />

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={makeSubcategoryLink(
                      product.category,
                      product.subcategory,
                    )}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/15"
                  >
                    {product.subcategory}
                  </a>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusClass(
                      product.status,
                    )}`}
                  >
                    {product.status}
                  </span>
                </div>

                {productBadges.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {productBadges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-100"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative overflow-hidden rounded-[2.5rem] border border-white/10 p-8 shadow-2xl shadow-black/40 md:p-10"
                style={{ background: visual.gradient }}
              >
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-300/20 blur-3xl" />
                <div className="absolute -bottom-24 left-12 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-sky-100 ring-1 ring-white/10">
                      {product.subcategory}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusClass(
                        product.status,
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-16 flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 text-7xl shadow-2xl shadow-black/20">
                    {visual.icon}
                  </div>

                  <p className="mt-8 max-w-md text-lg leading-8 text-slate-200">
                    {visual.subtitle}
                  </p>

                  {productBadges.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {productBadges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <a
              href={makeSubcategoryLink(product.category, product.subcategory)}
              className="mt-5 inline-flex cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              ← Назад към {product.subcategory}
            </a>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
              {product.brand.toUpperCase()}
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              {product.name}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                  Цена
                </p>
                <p className="mt-2 text-3xl font-black">{product.price}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                  Наличност
                </p>
                <p className="mt-2 text-lg font-bold">{product.status}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                  Категория
                </p>
                <p className="mt-2 text-lg font-bold">{product.category}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                  Вид продукт
                </p>
                <p className="mt-2 text-lg font-bold">{product.subcategory}</p>
              </div>
            </div>

            {productSpecs.length > 0 && (
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-2xl font-black">Основни характеристики</h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {productSpecs.map((spec) => (
                    <div
                      key={`${spec.label}-${spec.value}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        {spec.label}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-200">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6">
              <h2 className="text-2xl font-black">Запитване или поръчка</h2>

              <p className="mt-3 leading-7 text-slate-300">
                Ако имате въпроси за този продукт, можете да изпратите
                запитване в WhatsApp или да се свържете с нас по телефон. Ако
                желаете да поръчате директно, използвайте формата за поръчка и
                доставка.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href={makeWhatsappLink(product.name)}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-full bg-white px-6 py-4 text-center font-black text-black transition hover:bg-sky-100"
              >
                Запитване в WhatsApp
              </a>

              <a
                href={`tel:${phone}`}
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-4 text-center font-black text-white transition hover:bg-white/10"
              >
                Обадете се
              </a>

              <a
                href={makeRequestLink(product.name)}
                className="cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 text-center font-black text-white shadow-xl shadow-blue-950/40 transition hover:scale-[1.01] sm:col-span-2"
              >
                Поръчка / доставка
              </a>
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Какво следва?</h2>

              <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-300">
                <p>
                  След като изпратите заявка за поръчка, ние ще се свържем с
                  Вас за потвърждение и уточняване на доставката или вземането
                  от магазина.
                </p>

                <p>
                  При въпроси относно продукта можете да използвате WhatsApp,
                  телефон или формата за заявка.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-500">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p>© 2026 SKY MUSIC BG. Всички права запазени.</p>
            <p>Бургас · {phone}</p>
          </div>
        </footer>
      </section>
    </main>
  );
}