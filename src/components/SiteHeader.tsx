"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileCategoryName, setMobileCategoryName] = useState<string | null>(
    null,
  );

  const hoveredCategory = catalogCategories.find(
    (category) => category.name === hoveredCategoryName,
  );

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  function navigationClass(active: boolean) {
    return active
      ? "text-white"
      : "text-slate-300 transition hover:text-white";
  }

  function closeProductsMenu() {
    setProductsMenuOpen(false);
    setHoveredCategoryName(null);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileCategoryName(null);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen((current) => !current);
  }

  function toggleMobileProducts() {
    setMobileProductsOpen((current) => {
      const next = !current;

      if (!next) {
        setMobileCategoryName(null);
      }

      return next;
    });
  }

  function toggleMobileCategory(categoryName: string) {
    setMobileCategoryName((current) =>
      current === categoryName ? null : categoryName,
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 -mx-5 border-b border-white/10 bg-[#05070d]/95 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-4"
          >
            <div className="flex h-12 w-40 shrink-0 items-center justify-center overflow-hidden sm:h-14 sm:w-52 lg:w-56">
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

          {/* Desktop navigation */}
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
            className="hidden shrink-0 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-slate-200 lg:inline-flex"
          >
            WhatsApp
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Отворете менюто"
            aria-expanded={mobileMenuOpen}
            className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 lg:hidden"
          >
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#05070d] text-white lg:hidden">
          <div className="shrink-0 border-b border-white/10 px-5 py-4 md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex h-12 w-40 items-center overflow-hidden sm:h-14 sm:w-52"
              >
                <Image
                  src="/sky-music-logo-dark-header.png"
                  alt="SKY MUSIC BG logo"
                  width={360}
                  height={120}
                  className="h-auto w-full object-contain"
                  priority
                />
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Затворете менюто"
                className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <span className="absolute h-0.5 w-6 rotate-45 bg-white" />
                <span className="absolute h-0.5 w-6 -rotate-45 bg-white" />
              </button>
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-8">
            <div className="mx-auto grid max-w-7xl gap-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={
                  activePage === "home"
                    ? "rounded-2xl bg-sky-400 px-5 py-4 font-black text-black"
                    : "rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-bold text-white"
                }
              >
                Начало
              </Link>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
                <button
                  type="button"
                  onClick={toggleMobileProducts}
                  className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left font-black text-white"
                >
                  <span>Продукти</span>

                  <span
                    className={`text-sm text-sky-300 transition ${
                      mobileProductsOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {mobileProductsOpen && (
                  <div className="border-t border-white/10 p-3">
                    <Link
                      href="/products"
                      onClick={closeMobileMenu}
                      className="mb-3 block rounded-xl bg-sky-400/10 px-4 py-3 text-sm font-black text-sky-200 transition hover:bg-sky-400/20"
                    >
                      Всички категории →
                    </Link>

                    <div className="grid gap-1">
                      {catalogCategories.map((category) => {
                        const expanded =
                          mobileCategoryName === category.name;

                        return (
                          <div key={category.name}>
                            <button
                              type="button"
                              onClick={() =>
                                toggleMobileCategory(category.name)
                              }
                              className={
                                expanded
                                  ? "flex w-full cursor-pointer items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-black text-white"
                                  : "flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
                              }
                            >
                              <span>{category.name}</span>

                              <span
                                className={`text-sky-300 transition ${
                                  expanded ? "rotate-90" : ""
                                }`}
                              >
                                ›
                              </span>
                            </button>

                            {expanded && (
                              <div className="mx-2 mb-3 mt-1 rounded-xl border border-white/10 bg-black/30 p-2">
                                <Link
                                  href={makeCategoryLink(category.name)}
                                  onClick={closeMobileMenu}
                                  className="mb-2 block rounded-lg border border-sky-400/15 bg-sky-400/10 px-3 py-3 text-sm font-bold text-sky-200"
                                >
                                  Подкатегории в {category.name} →
                                </Link>

                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory}
                                    href={makeSubcategoryLink(
                                      category.name,
                                      subcategory,
                                    )}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                                  >
                                    {subcategory}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/#brands"
                onClick={closeMobileMenu}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-bold text-white"
              >
                Марки
              </Link>

              <Link
                href="/#contact"
                onClick={closeMobileMenu}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-bold text-white"
              >
                Контакти
              </Link>

              <Link
                href="/request"
                onClick={closeMobileMenu}
                className={
                  activePage === "request"
                    ? "rounded-2xl bg-sky-400 px-5 py-4 font-black text-black"
                    : "rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-bold text-white"
                }
              >
                Поръчка / доставка
              </Link>
            </div>
          </nav>

          <div className="shrink-0 border-t border-white/10 bg-[#05070d] px-5 py-4 md:px-8">
            <a
              href={makeWhatsappLink()}
              target="_blank"
              rel="noreferrer"
              onClick={closeMobileMenu}
              className="mx-auto block max-w-7xl cursor-pointer rounded-2xl bg-white px-5 py-4 text-center font-black text-black transition hover:bg-slate-200"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}