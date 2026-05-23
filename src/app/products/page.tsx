"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { catalogCategories, categories, products } from "@/data/products";

const phone = "+359884211761";
const whatsappNumber = "359884211761";
const allBrandsLabel = "Всички марки";

const categoryVisuals: Record<
  string,
  {
    icon: string;
    subtitle: string;
    gradient: string;
    image: string;
    imagePosition: string;
  }
> = {
  Клавишни: {
    icon: "🎹",
    subtitle: "Пиана, клавири, синтезатори и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(37,99,235,0.35), rgba(15,23,42,0.98))",
    image: "/categories/keyboards.webp",
    imagePosition: "center center",
  },
  Струнни: {
    icon: "🎸",
    subtitle: "Китари, цигулки, усилватели и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(14,165,233,0.28), rgba(30,64,175,0.38), rgba(2,6,23,0.98))",
    image: "/categories/strings.webp",
    imagePosition: "center center",
  },
  Озвучаване: {
    icon: "🔊",
    subtitle: "Тонколони, системи, пултове и усилватели",
    gradient:
      "linear-gradient(135deg, rgba(56,189,248,0.24), rgba(30,64,175,0.34), rgba(2,6,23,0.98))",
    image: "/categories/sound.webp",
    imagePosition: "center center",
  },
  Ударни: {
    icon: "🥁",
    subtitle: "Барабани, перкусии, палки и аксесоари",
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(30,41,59,0.45), rgba(2,6,23,0.98))",
    image: "/categories/drums.webp",
    imagePosition: "center center",
  },
  Духови: {
    icon: "🎷",
    subtitle: "Кларинети, саксофони, тромпети и флейти",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.22), rgba(30,64,175,0.32), rgba(2,6,23,0.98))",
    image: "/categories/wind.webp",
    imagePosition: "center center",
  },
  Микрофони: {
    icon: "🎤",
    subtitle: "Кабелни, безжични и студийни микрофони",
    gradient:
      "linear-gradient(135deg, rgba(125,211,252,0.24), rgba(29,78,216,0.35), rgba(2,6,23,0.98))",
    image: "/categories/microphones.webp",
    imagePosition: "center center",
  },
  Студио: {
    icon: "🎚️",
    subtitle: "Аудио интерфейси, монитори и слушалки",
    gradient:
      "linear-gradient(135deg, rgba(96,165,250,0.26), rgba(15,23,42,0.55), rgba(0,0,0,0.98))",
    image: "/categories/studio.webp",
    imagePosition: "center center",
  },
  Аксесоари: {
    icon: "🔌",
    subtitle: "Кабели, стойки, калъфи и куфари",
    gradient:
      "linear-gradient(135deg, rgba(148,163,184,0.22), rgba(30,64,175,0.28), rgba(2,6,23,0.98))",
    image: "/categories/accessories.webp",
    imagePosition: "center center",
  },
};

function makeWhatsappLink(productName?: string) {
  const message = productName
    ? `Здравейте, интересувам се от ${productName}. Моля за повече информация.`
    : "Здравейте, интересувам се от продуктите на SKY MUSIC BG.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function makeRequestLink(productName?: string) {
  return productName
    ? `/request?product=${encodeURIComponent(productName)}`
    : "/request";
}

function makeProductLink(productId: string) {
  return `/products/${productId}`;
}

function makeProductsUrl(
  category: string,
  subcategory: string | null,
  brand: string,
) {
  const params = new URLSearchParams();

  if (category !== "Всички") {
    params.set("category", category);
  }

  if (category !== "Всички" && subcategory) {
    params.set("subcategory", subcategory);
  }

  if (brand !== allBrandsLabel) {
    params.set("brand", brand);
  }

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

function getCategoryVisual(category: string) {
  return (
    categoryVisuals[category] ?? {
      icon: "🎵",
      subtitle: "Музикално оборудване и аксесоари",
      gradient:
        "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(30,64,175,0.35), rgba(2,6,23,0.98))",
      image: "",
      imagePosition: "center center",
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

function getProductCountLabel(count: number) {
  return count === 1 ? "намерен продукт" : "намерени продукта";
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category");
  const subcategoryFromUrl = searchParams.get("subcategory");
  const brandFromUrl = searchParams.get("brand");

  const [selectedCategory, setSelectedCategory] = useState("Всички");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedBrand, setSelectedBrand] = useState(allBrandsLabel);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allBrands = useMemo(() => {
    const productBrands = Array.from(
      new Set(products.map((product) => product.brand).filter(Boolean)),
    ).sort((first, second) => first.localeCompare(second, "bg"));

    return [allBrandsLabel, ...productBrands];
  }, []);

  const availableSubcategories = useMemo(() => {
    const category = catalogCategories.find(
      (item) => item.name === selectedCategory,
    );

    return category?.subcategories ?? [];
  }, [selectedCategory]);

  useEffect(() => {
    const validCategory =
      categoryFromUrl && categories.includes(categoryFromUrl)
        ? categoryFromUrl
        : "Всички";

    const category = catalogCategories.find(
      (item) => item.name === validCategory,
    );

    const validSubcategory =
      validCategory !== "Всички" &&
      subcategoryFromUrl &&
      category?.subcategories.includes(subcategoryFromUrl)
        ? subcategoryFromUrl
        : null;

    setSelectedCategory(validCategory);
    setSelectedSubcategory(validSubcategory);
  }, [categoryFromUrl, subcategoryFromUrl]);

  useEffect(() => {
    if (brandFromUrl && allBrands.includes(brandFromUrl)) {
      setSelectedBrand(brandFromUrl);
    } else {
      setSelectedBrand(allBrandsLabel);
    }
  }, [brandFromUrl, allBrands]);

  const hasSearch = search.trim().length > 0;
  const hasBrandFilter = selectedBrand !== allBrandsLabel;

  const isMainCategoryLanding =
    selectedCategory === "Всички" &&
    selectedSubcategory === null &&
    !hasSearch &&
    !hasBrandFilter;

  const isSubcategoryLanding =
    selectedCategory !== "Всички" &&
    selectedSubcategory === null &&
    !hasSearch;

  const filteredProducts = useMemo(() => {
    if (isMainCategoryLanding || isSubcategoryLanding) {
      return [];
    }

    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Всички" ||
        product.category === selectedCategory;

      const matchesSubcategory =
        selectedSubcategory === null ||
        product.subcategory === selectedSubcategory;

      const matchesBrand =
        selectedBrand === allBrandsLabel || product.brand === selectedBrand;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.subcategory.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);

      return (
        matchesCategory &&
        matchesSubcategory &&
        matchesBrand &&
        matchesSearch
      );
    });
  }, [
    isMainCategoryLanding,
    isSubcategoryLanding,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    search,
  ]);

  const emptyState = useMemo(() => {
    if (hasSearch) {
      return {
        title: "Няма намерени продукти.",
        description:
          "Променете търсенето или изчистете активните филтри.",
      };
    }

    if (selectedSubcategory) {
      return {
        title: `Все още няма добавени продукти в „${selectedSubcategory}“.`,
        description:
          "Когато бъдат публикувани продукти от този вид, те ще се появят тук.",
      };
    }

    if (hasBrandFilter) {
      return {
        title: `Все още няма добавени продукти от марка „${selectedBrand}“.`,
        description:
          "Изберете друга марка или разгледайте категориите.",
      };
    }

    return {
      title: "Все още няма добавени продукти.",
      description:
        "Публикуваните продукти ще се появят на тази страница.",
    };
  }, [hasSearch, selectedSubcategory, hasBrandFilter, selectedBrand]);

  function selectCategory(category: string) {
    setSelectedCategory(category);
    setSelectedSubcategory(null);

    router.replace(makeProductsUrl(category, null, selectedBrand), {
      scroll: false,
    });
  }

  function selectSubcategory(subcategory: string) {
    setSelectedSubcategory(subcategory);

    router.replace(
      makeProductsUrl(selectedCategory, subcategory, selectedBrand),
      { scroll: false },
    );
  }

  function selectBrand(brand: string) {
    setSelectedBrand(brand);

    router.replace(
      makeProductsUrl(selectedCategory, selectedSubcategory, brand),
      { scroll: false },
    );
  }

  function clearFilters() {
    setSelectedCategory("Всички");
    setSelectedSubcategory(null);
    setSelectedBrand(allBrandsLabel);
    setSearch("");
    setFiltersOpen(false);

    router.replace("/products", { scroll: false });
  }

  function openProduct(productId: string) {
    window.location.href = makeProductLink(productId);
  }

  const activeFilterCount = [
    selectedCategory !== "Всички",
    selectedSubcategory !== null,
    selectedBrand !== allBrandsLabel,
  ].filter(Boolean).length;

  const hasActiveFilter =
    activeFilterCount > 0 || search.trim().length > 0;

  const resultMetricValue = isMainCategoryLanding
    ? catalogCategories.length
    : isSubcategoryLanding
      ? availableSubcategories.length
      : filteredProducts.length;

  const resultMetricLabel = isMainCategoryLanding
    ? "основни категории"
    : isSubcategoryLanding
      ? "подкатегории"
      : getProductCountLabel(filteredProducts.length);

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <SiteHeader activePage="products" />

        <section className="py-14 md:py-20">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              SKY MUSIC BG
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
                  Продукти
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Изберете категория, намерете конкретен вид продукт или
                  използвайте търсачката и филтрите.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
                <p className="text-3xl font-black">{resultMetricValue}</p>
                <p className="mt-1 text-sm text-slate-300">
                  {resultMetricLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-4 md:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <label className="sr-only" htmlFor="product-search-page">
                  Търсете продукт
                </label>

                <input
                  id="product-search-page"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Търсете продукт, марка или вид..."
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />

                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                  ⌕
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                aria-controls="products-filter-panel"
                className={
                  filtersOpen || activeFilterCount > 0
                    ? "flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-sky-400 px-6 py-4 font-black text-black transition hover:bg-sky-300"
                    : "flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white transition hover:bg-white/10"
                }
              >
                <span>Филтри</span>

                {activeFilterCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black/15 px-2 text-xs font-black">
                    {activeFilterCount}
                  </span>
                )}

                <span
                  className={`text-xs transition ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Изчистете
                </button>
              )}
            </div>

            {hasActiveFilter && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedCategory !== "Всички" && (
                  <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-100">
                    {selectedCategory}
                  </span>
                )}

                {selectedSubcategory && (
                  <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
                    {selectedSubcategory}
                  </span>
                )}

                {selectedBrand !== allBrandsLabel && (
                  <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-100">
                    {selectedBrand}
                  </span>
                )}

                {search.trim().length > 0 && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200">
                    „{search}“
                  </span>
                )}
              </div>
            )}

            {filtersOpen && (
              <div
                id="products-filter-panel"
                className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/20 p-5 md:p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                      Категория
                    </p>

                    {selectedCategory !== "Всички" && (
                      <button
                        type="button"
                        onClick={() => selectCategory("Всички")}
                        className="cursor-pointer text-sm font-bold text-slate-400 transition hover:text-white"
                      >
                        Нулирайте категорията
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories
                      .filter((category) => category !== "Всички")
                      .map((category) => {
                        const active = selectedCategory === category;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => selectCategory(category)}
                            className={
                              active
                                ? "cursor-pointer rounded-full bg-sky-400 px-5 py-3 text-sm font-black text-black"
                                : "cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                            }
                          >
                            {category}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {selectedCategory !== "Всички" && (
                  <div className="mt-7 border-t border-white/10 pt-6">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                      Подкатегория
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableSubcategories.map((subcategory) => {
                        const active = selectedSubcategory === subcategory;

                        return (
                          <button
                            key={subcategory}
                            type="button"
                            onClick={() => selectSubcategory(subcategory)}
                            className={
                              active
                                ? "cursor-pointer rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-black"
                                : "cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                            }
                          >
                            {subcategory}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                    Марка
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {allBrands.map((brand) => {
                      const active = selectedBrand === brand;

                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => selectBrand(brand)}
                          className={
                            active
                              ? "cursor-pointer rounded-full bg-white px-5 py-3 text-sm font-black text-black"
                              : "cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                          }
                        >
                          {brand}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Изчистете филтрите
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-slate-200"
                  >
                    Затворете
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="pb-16">
          {isMainCategoryLanding ? (
            <div>
              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
                  Категории
                </p>

                <h2 className="mt-3 text-3xl font-black md:text-4xl">
                  Изберете основна категория
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catalogCategories.map((category) => {
                  const visual = getCategoryVisual(category.name);

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => selectCategory(category.name)}
                      className="group cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-left shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.07]"
                    >
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        {visual.image ? (
                          <Image
                            src={visual.image}
                            alt={`${category.name} - SKY MUSIC BG`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            style={{ objectPosition: visual.imagePosition }}
                            className="object-cover transition duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: visual.gradient }}
                          />
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                      </div>

                      <div className="p-5">
                        <h3 className="text-2xl font-black leading-tight text-white">
                          {category.name}
                        </h3>

                        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                          {visual.subtitle}
                        </p>

                        <p className="mt-5 text-sm font-bold text-sky-300 transition group-hover:text-sky-200">
                          Вижте подкатегориите →
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : isSubcategoryLanding ? (
            <div>
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
                    {selectedCategory}
                  </p>

                  <h2 className="mt-3 text-3xl font-black md:text-4xl">
                    Подкатегории
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => selectCategory("Всички")}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  ← Основни категории
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    type="button"
                    onClick={() => selectSubcategory(subcategory)}
                    className="group flex min-h-[104px] cursor-pointer items-center justify-between gap-5 rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-5 text-left shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/[0.07]"
                  >
                    <div>
                      <h3 className="text-lg font-black leading-snug text-white">
                        {subcategory}
                      </h3>

                      <p className="mt-2 text-sm font-bold text-slate-400 transition group-hover:text-sky-200">
                        Разгледайте продуктите
                      </p>
                    </div>

                    <span className="shrink-0 text-xl font-black text-sky-300 transition group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const visual = getCategoryVisual(product.category);
                const productBadges = (product.badges ?? [])
                  .filter((badge) => badge !== product.status)
                  .slice(0, 3);
                const hasImage = Boolean(product.image);

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
                      className={`relative h-72 overflow-hidden ${
                        hasImage ? "bg-white" : ""
                      }`}
                      style={
                        hasImage ? undefined : { background: visual.gradient }
                      }
                    >
                      {hasImage ? (
                        <Image
                          src={product.image as string}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-contain p-6 transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl transition group-hover:bg-sky-300/30" />
                          <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

                          <div className="absolute bottom-6 left-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-5xl shadow-2xl shadow-black/20">
                              {visual.icon}
                            </div>

                            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-300">
                              {visual.subtitle}
                            </p>
                          </div>
                        </>
                      )}

                      <div className="absolute left-6 right-6 top-6 flex items-start justify-between gap-4">
                        <span
                          className={
                            hasImage
                              ? "rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white ring-1 ring-black/10 backdrop-blur"
                              : "rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-sky-100 ring-1 ring-white/10"
                          }
                        >
                          {product.subcategory}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            product.status,
                          )}`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                        {product.brand}
                      </p>

                      <h2 className="mt-3 text-2xl font-black leading-tight transition group-hover:text-sky-200">
                        {product.name}
                      </h2>

                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                        {product.category} · {product.subcategory}
                      </p>

                      <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">
                        {product.description}
                      </p>

                      {productBadges.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {productBadges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-sky-100"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}

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
                              Отворете продукта
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <a
                          href={makeProductLink(product.id)}
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                        >
                          Вижте продукта
                        </a>

                        <a
                          href={makeWhatsappLink(product.name)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition hover:bg-sky-100"
                        >
                          Запитване
                        </a>

                        <a
                          href={`tel:${phone}`}
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                        >
                          Обадете се
                        </a>

                        <a
                          href={makeRequestLink(product.name)}
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-4 py-3 text-center text-sm font-black text-white transition hover:scale-[1.01]"
                        >
                          Поръчка / доставка
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center md:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                ♫
              </div>

              <h2 className="mt-6 text-2xl font-black">{emptyState.title}</h2>

              <p className="mx-auto mt-3 max-w-xl text-slate-400">
                {emptyState.description}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-slate-200"
              >
                Вижте категориите
              </button>
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