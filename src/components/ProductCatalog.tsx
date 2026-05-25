"use client";

import Image from "next/image";
import ChatInquiryButton from "@/components/ChatInquiryButton";
import HomeBannerSlideshow from "@/components/HomeBannerSlideshow";
import SiteHeader from "@/components/SiteHeader";
import { catalogCategories, products } from "@/data/products";

const phone = "+359884211761";
const email = "skymusicstorebg@gmail.com";

const brandDescriptions: Record<string, string> = {
  Yamaha: "Музикални инструменти и оборудване",
};

const shoppingPaths = [
  {
    title: "За китаристи",
    description:
      "Класически, акустични и електрически китари, усилватели, ефекти и аксесоари.",
    href: "/products?category=Струнни",
    icon: "🎸",
    tag: "Струнни",
  },
  {
    title: "За вокал и сцена",
    description:
      "Кабелни и безжични микрофони за изпълнения, репетиции и събития.",
    href: "/products?category=Микрофони",
    icon: "🎤",
    tag: "Микрофони",
  },
  {
    title: "За домашно студио",
    description:
      "Аудио интерфейси, студийни монитори, слушалки и микрофони за запис.",
    href: "/products?category=Студио",
    icon: "🎚️",
    tag: "Студио",
  },
  {
    title: "За клавиристи",
    description:
      "Дигитални пиана, аранжори, преносими клавири и синтезатори.",
    href: "/products?category=Клавишни",
    icon: "🎹",
    tag: "Клавишни",
  },
];

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

const heroCategoryNames = ["Клавишни", "Струнни", "Озвучаване", "Микрофони"];

const featuredProducts = products
  .filter((product) => product.featured)
  .slice(0, 6);

const availableBrands = Array.from(
  new Set(products.map((product) => product.brand).filter(Boolean)),
).sort((first, second) => first.localeCompare(second, "bg"));

function makeRequestLink(productName?: string) {
  if (!productName) {
    return "/request";
  }

  return `/request?product=${encodeURIComponent(productName)}`;
}

function makeProductLink(productId: string) {
  return `/products/${productId}`;
}

function makeCategoryLink(category: string) {
  return `/products?category=${encodeURIComponent(category)}`;
}

function makeBrandLink(brand: string) {
  return `/products?brand=${encodeURIComponent(brand)}`;
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

export default function ProductCatalog() {
  function openProduct(productId: string) {
    window.location.href = makeProductLink(productId);
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <SiteHeader activePage="home" />

        <HomeBannerSlideshow />

        <section className="grid gap-12 py-14 md:py-20 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
              SKY MUSIC BG
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Инструменти и звук за музиката, която създавате.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Музикални инструменти, студио оборудване и аксесоари с лично
              обслужване и консултация при избор. Разгледайте продуктите или
              изпратете поръчка директно през сайта.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/products"
                className="rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-4 text-center font-black text-white shadow-xl shadow-blue-950/50 transition hover:scale-[1.02]"
              >
                Разгледайте продуктите
              </a>

              <a
                href="/request"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10"
              >
                Поръчка / доставка
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-sky-500/25 via-blue-700/15 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/50">
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-950 to-black p-7 md:p-8">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-sky-300">
                  Категории
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight">
                  Изберете посока
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Отворете желаната категория и разгледайте наличните продукти.
                </p>

                <div className="mt-8 grid gap-3">
                  {heroCategoryNames.map((categoryName) => {
                    const visual = getCategoryVisual(categoryName);

                    return (
                      <a
                        key={categoryName}
                        href={makeCategoryLink(categoryName)}
                        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                            {visual.icon}
                          </span>

                          <div>
                            <p className="font-black">{categoryName}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              Отворете категорията
                            </p>
                          </div>
                        </div>

                        <span className="text-sky-300 transition group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    );
                  })}
                </div>

                <a
                  href="/products"
                  className="mt-6 block rounded-full border border-sky-400/25 bg-sky-400/10 px-6 py-3 text-center text-sm font-black text-sky-100 transition hover:bg-sky-400/20"
                >
                  Всички категории
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                Подбор
              </p>

              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Избрани продукти
              </h2>

              <p className="mt-4 max-w-2xl text-slate-400">
                Актуални предложения от каталога на SKY MUSIC BG.
              </p>
            </div>

            <a
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
            >
              Всички продукти
            </a>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => {
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

                      <h3 className="mt-3 text-2xl font-black leading-tight transition group-hover:text-sky-200">
                        {product.name}
                      </h3>

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
                          href={`tel:${phone}`}
                          onClick={(event) => event.stopPropagation()}
                          className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                        >
                          Обадете се
                        </a>

                        <ChatInquiryButton
                          productName={product.name}
                          className="cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition hover:bg-sky-100"
                        >
                          Запитване
                        </ChatInquiryButton>

                        <a
                          href={makeRequestLink(product.name)}
                          onClick={(event) => event.stopPropagation()}
                          className="col-span-2 cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-4 py-4 text-center text-sm font-black text-white transition hover:scale-[1.01]"
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
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
              Продуктите ще бъдат показани тук при публикуване.
            </div>
          )}
        </section>

        <section id="brands" className="py-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                Марки
              </p>

              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Продукти по марка
              </h2>

              <p className="mt-4 max-w-2xl text-slate-400">
                Изберете предпочитан бранд и разгледайте публикуваните
                продукти.
              </p>
            </div>

            <a
              href="/products"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
            >
              Всички продукти
            </a>
          </div>

          {availableBrands.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {availableBrands.map((brand) => (
                <a
                  key={brand}
                  href={makeBrandLink(brand)}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.08]"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl transition group-hover:bg-sky-400/20" />

                  <div className="relative">
                    <p className="text-3xl font-black tracking-tight text-white">
                      {brand.toUpperCase()}
                    </p>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                      {brandDescriptions[brand] ??
                        "Разгледайте продуктите от тази марка."}
                    </p>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-sky-300">
                      Вижте продуктите →
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-slate-400">
              Марките ще бъдат показани тук при публикуване на продукти.
            </div>
          )}
        </section>

        <section id="directions" className="py-14">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-8 md:p-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                  Избор според нуждата
                </p>

                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  Намерете правилното оборудване
                </h2>
              </div>

              <p className="max-w-xl text-slate-400">
                Изберете посока според това, което търсите — китара, вокал,
                студио или клавишни инструменти.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {shoppingPaths.map((path) => (
                <a
                  key={path.title}
                  href={path.href}
                  className="group rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.08]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-4xl">
                    {path.icon}
                  </div>

                  <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                    {path.tag}
                  </p>

                  <h3 className="mt-3 text-2xl font-black">{path.title}</h3>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {path.description}
                  </p>

                  <p className="mt-6 text-sm font-black text-white transition group-hover:text-sky-200">
                    Отворете продуктите →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-14">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                  Контакт
                </p>

                <h2 className="mt-4 text-4xl font-black md:text-5xl">
                  Имате въпрос или сте избрали продукт?
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  За бърз въпрос използвайте „Чат с нас“, а за поръчка
                  изпратете заявка директно през сайта. След това ще се свържем
                  с Вас за потвърждение и уточняване на доставката.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[330px]">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black text-white transition hover:bg-white/10"
                  >
                    Обадете се
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black text-white transition hover:bg-white/10"
                  >
                    Имейл
                  </a>
                </div>

                <a
                  href="/request"
                  className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-5 text-center font-black text-white transition hover:brightness-105"
                >
                  Поръчка / доставка
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-500">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p>© 2026 SKY MUSIC BG. Всички права запазени.</p>
            <p>
              {phone} · {email}
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
