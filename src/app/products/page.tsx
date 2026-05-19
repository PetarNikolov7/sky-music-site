"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useEffect, Suspense, type WheelEvent } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products } from "@/data/products";

const phone = "+359884211761";
const whatsappNumber = "359884211761";

const categoryVisuals: Record<
  string,
  {
    icon: string;
    subtitle: string;
    gradient: string;
  }
> = {
  "Струнни инструменти": {
    icon: "🎸",
    subtitle: "Китари, бас китари и струнни аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(14,165,233,0.28), rgba(30,64,175,0.38), rgba(2,6,23,0.98))",
  },
  "Клавишни инструменти": {
    icon: "🎹",
    subtitle: "Клавири, синтезатори и дигитални пиана",
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(37,99,235,0.35), rgba(15,23,42,0.98))",
  },
  "Ударни инструменти": {
    icon: "🥁",
    subtitle: "Барабани, перкусии и ритъм аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(30,41,59,0.45), rgba(2,6,23,0.98))",
  },
  Микрофони: {
    icon: "🎤",
    subtitle: "Вокални, студийни и сценични микрофони",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.24), rgba(29,78,216,0.35), rgba(2,6,23,0.98))",
  },
  "Студио оборудване": {
    icon: "🎚️",
    subtitle: "Аудио интерфейси, монитори и студио техника",
    gradient:
      "linear-gradient(135deg, rgba(96,165,250,0.26), rgba(15,23,42,0.55), rgba(0,0,0,0.98))",
  },
  Аксесоари: {
    icon: "🔌",
    subtitle: "Кабели, стойки, адаптери и консумативи",
    gradient:
      "linear-gradient(135deg, rgba(148,163,184,0.22), rgba(30,64,175,0.28), rgba(2,6,23,0.98))",
  },
};

function makeWhatsappLink(productName?: string) {
  const message = productName
    ? `Здравейте, интересувам се от ${productName}. Наличен ли е продуктът и как мога да го получа?`
    : "Здравейте, интересувам се от продуктите на SKY MUSIC BG.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function makeRequestLink(productName?: string) {
  if (!productName) {
    return "/request";
  }

  return `/request?product=${encodeURIComponent(productName)}`;
}

function makeProductLink(productId: string) {
  return `/products/${productId}`;
}

function makeCategoryUrl(category: string) {
  if (category === "Всички") {
    return "/products";
  }

  return `/products?category=${encodeURIComponent(category)}`;
}

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

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState("Всички");
  const [search, setSearch] = useState("");
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
      return;
    }

    setSelectedCategory("Всички");
  }, [categoryFromUrl]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Всички" || product.category === selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  function scrollCategories(direction: "left" | "right") {
    const scroller = categoryScrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  }

  function handleCategoryWheel(event: WheelEvent<HTMLDivElement>) {
    const scroller = categoryScrollerRef.current;

    if (!scroller) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    }
  }

  function selectCategory(category: string) {
    setSelectedCategory(category);
    window.history.replaceState(null, "", makeCategoryUrl(category));
  }

  function openProduct(productId: string) {
    window.location.href = makeProductLink(productId);
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <header className="sticky top-0 z-30 -mx-5 border-b border-white/10 bg-[#05070d]/85 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="/" className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-48 shrink-0 items-center justify-center overflow-hidden sm:w-60">
                <Image
                  src="/sky-music-logo-dark-header.png"
                  alt="SKY MUSIC BG logo"
                  width={360}
                  height={120}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </a>

            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <a href="/" className="hover:text-white">
                Начало
              </a>
              <a href="/products" className="text-white">
                Продукти
              </a>
              <a href="/request" className="hover:text-white">
                Заявка
              </a>
            </nav>

            <a
              href={makeWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              WhatsApp
            </a>
          </div>
        </header>

        <section className="py-14 md:py-20">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              SKY MUSIC BG каталог
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                  Всички продукти
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Разгледай продуктите по категория, търси по име или марка и
                  отвори детайлна страница за всеки продукт. Няма онлайн количка
                  — уточняваме наличност, цена и доставка лично.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
                <p className="text-3xl font-black">{filteredProducts.length}</p>
                <p className="mt-1 text-sm text-slate-300">
                  намерени продукта
                </p>
              </div>
            </div>

            {selectedCategory !== "Всички" && (
              <div className="mt-6 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-100">
                Филтър: {selectedCategory}
              </div>
            )}
          </div>
        </section>

        <section className="pb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute left-12 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#05070d] to-transparent" />
              <div className="pointer-events-none absolute right-12 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#05070d] to-transparent" />

              <button
                type="button"
                onClick={() => scrollCategories("left")}
                aria-label="Предишни категории"
                className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                ‹
              </button>

              <div
                ref={categoryScrollerRef}
                onWheel={handleCategoryWheel}
                className="mx-12 flex gap-3 overflow-x-auto px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((category) => {
                  const active = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className={
                        active
                          ? "whitespace-nowrap rounded-full bg-sky-400 px-5 py-3 text-sm font-black text-black"
                          : "whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollCategories("right")}
                aria-label="Следващи категории"
                className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                ›
              </button>
            </div>

            <div className="w-full md:max-w-sm">
              <label className="sr-only" htmlFor="product-search-page">
                Търси продукт
              </label>
              <input
                id="product-search-page"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Търси продукт, марка или категория..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
              />
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const visual = getCategoryVisual(product.category);

              return (
                <article
                  key={product.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => openProduct(product.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProduct(product.id);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.07]"
                >
                  <div
                    className="relative flex h-60 flex-col justify-between overflow-hidden p-6"
                    style={{ background: visual.gradient }}
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl transition group-hover:bg-sky-300/30" />
                    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-sky-100 ring-1 ring-white/10">
                        {product.category}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-5xl shadow-2xl shadow-black/20">
                        {visual.icon}
                      </div>
                      <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">
                        {visual.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                      {product.brand}
                    </p>

                    <h2 className="mt-3 text-2xl font-black leading-tight transition group-hover:text-sky-200">
                      {product.name}
                    </h2>

                    <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">
                      {product.description}
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                            Цена
                          </p>
                          <p className="mt-1 text-3xl font-black">
                            {product.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                            Детайли
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            Отвори продукта
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <a
                        href={makeProductLink(product.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                      >
                        Виж продукта
                      </a>

                      <a
                        href={makeWhatsappLink(product.name)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition hover:bg-sky-100"
                      >
                        Запитване
                      </a>

                      <a
                        href={`tel:${phone}`}
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                      >
                        Обади се
                      </a>

                      <a
                        href={makeRequestLink(product.name)}
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-4 py-3 text-center text-sm font-black text-white transition hover:scale-[1.01]"
                      >
                        Остави данни
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-xl font-bold">Няма намерени продукти.</p>
              <p className="mt-2 text-slate-400">
                Пробвай друга категория или изчисти търсенето.
              </p>
            </div>
          )}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#05070d] text-white">
          <section className="mx-auto max-w-7xl px-5 py-10">
            Зареждане...
          </section>
        </main>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}