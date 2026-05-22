"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { catalogCategories } from "@/data/products";

const whatsappNumber = "359884211761";

type SiteHeaderProps = {
  activePage?: "home" | "products" | "request";
};

function makeWhatsappLink() {
  const message =
    "Здравейте, интересувам се от продуктите на SKY MUSIC BG.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function makeCategoryLink(category: string) {
  return `/products?category=${encodeURIComponent(category)}`;
}

function makeSubcategoryLink(category: string, subcategory: string) {
  return `/products?category=${encodeURIComponent(
    category,
  )}&subcategory=${encodeURIComponent(subcategory)}`;
}

export default function SiteHeader({ activePage = "home" }: SiteHeaderProps) {
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [hoveredCategoryName, setHoveredCategoryName] = useState<string | null>(
    null,
  );

  const hoveredCategory = catalogCategories.find(
    (category) => category.name === hoveredCategoryName,
  );

  function navigationClass(active: boolean) {
    return active
      ? "text-white"
      : "text-slate-300 transition hover:text-white";
  }

  function closeProductsMenu() {
    setProductsMenuOpen(false);
    setHoveredCategoryName(null);
  }

  return (
    <header className="sticky top-0 z-50 -mx-5 border-b border-white/10 bg-[#05070d]/90 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-48 shrink-0 items-center justify-center overflow-hidden sm:w-56">
            <Image
              src="/sky-music-logo-dark-header.png"
              alt="SKY MUSIC BG logo"
              width={360}
              height={120}
              className="h-auto w-full object-contain"
              priority
            />
          </div>

          <div className="hidden xl:block">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Музикален магазин в Бургас
            </p>
            <p className="text-sm font-bold text-slate-300">
              Инструменти · Студио · Аксесоари
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <Link href="/" className={navigationClass(activePage === "home")}>
            Начало
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setProductsMenuOpen(true)}
            onMouseLeave={closeProductsMenu}
          >
            <Link
              href="/products"
              onFocus={() => setProductsMenuOpen(true)}
              className={`flex items-center gap-2 ${navigationClass(
                activePage === "products" || productsMenuOpen,
              )}`}
            >
              Продукти

              <span
                className={`text-xs transition duration-200 ${
                  productsMenuOpen ? "rotate-180 text-sky-300" : ""
                }`}
              >
                ▾
              </span>
            </Link>

            <div
              className={`absolute left-1/2 top-full -translate-x-1/2 pt-5 transition duration-200 ${
                productsMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              <div className="relative w-[275px] rounded-[1.6rem] border border-white/10 bg-[#090e18]/98 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
                <div className="border-b border-white/10 px-2 pb-4">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
                    Продукти
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Изберете категория
                  </p>
                </div>

                <div className="mt-3 grid gap-1">
                  {catalogCategories.map((category) => {
                    const active = category.name === hoveredCategoryName;

                    return (
                      <Link
                        key={category.name}
                        href={makeCategoryLink(category.name)}
                        onMouseEnter={() =>
                          setHoveredCategoryName(category.name)
                        }
                        onFocus={() => setHoveredCategoryName(category.name)}
                        className={
                          active
                            ? "flex items-center justify-between rounded-xl bg-sky-400 px-3 py-2.5 text-sm font-black text-black"
                            : "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        }
                      >
                        {category.name}

                        <span
                          className={active ? "text-black" : "text-slate-600"}
                        >
                          ›
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href="/products"
                  className="mt-4 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Всички категории →
                </Link>

                {hoveredCategory && (
                  <div className="absolute left-full top-0 pl-3">
                    <div className="w-[385px] rounded-[1.6rem] border border-white/10 bg-[#090e18]/98 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
                      <div className="border-b border-white/10 pb-4">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                          Категория
                        </p>

                        <p className="mt-2 text-xl font-black text-white">
                          {hoveredCategory.name}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1">
                        {hoveredCategory.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            href={makeSubcategoryLink(
                              hoveredCategory.name,
                              subcategory,
                            )}
                            className="rounded-lg px-2 py-2 text-sm leading-5 text-slate-400 transition hover:bg-white/5 hover:text-sky-200"
                          >
                            {subcategory}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link href="/#brands" className={navigationClass(false)}>
            Марки
          </Link>

          <Link href="/#contact" className={navigationClass(false)}>
            Контакти
          </Link>

          <Link
            href="/request"
            className={navigationClass(activePage === "request")}
          >
            Поръчка / доставка
          </Link>
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
  );
}