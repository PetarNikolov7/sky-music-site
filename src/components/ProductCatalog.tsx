"use client";

import Image from "next/image";
import { categories, products } from "@/data/products";

const phone = "+359884211761";
const whatsappNumber = "359884211761";
const email = "skymusicstorebg@gmail.com";
const messengerUrl = "https://m.me/skymusicbg";

const brandBanners = [
  {
    name: "Yamaha",
    label: "YAMAHA",
    subtitle: "Инструменти, клавири и оборудване",
  },
  {
    name: "Shure",
    label: "SHURE",
    subtitle: "Микрофони и сценичен звук",
  },
  {
    name: "Focusrite",
    label: "FOCUSRITE",
    subtitle: "Аудио интерфейси и студио решения",
  },
  {
    name: "Casio",
    label: "CASIO",
    subtitle: "Клавишни инструменти",
  },
  {
    name: "Roland",
    label: "ROLAND",
    subtitle: "Сцена, студио и електронни инструменти",
  },
  {
    name: "Behringer",
    label: "BEHRINGER",
    subtitle: "Студио и live sound техника",
  },
];

const shoppingPaths = [
  {
    title: "За китаристи",
    description:
      "Китари, аксесоари, кабели и оборудване за репетиции, сцена и домашно свирене.",
    href: "/products?category=Струнни%20инструменти",
    icon: "🎸",
    tag: "Струнни инструменти",
  },
  {
    title: "За вокал и сцена",
    description:
      "Микрофони, сценични решения и техника за репетиции, участия и live sound.",
    href: "/products?category=Микрофони",
    icon: "🎤",
    tag: "Микрофони",
  },
  {
    title: "За домашно студио",
    description:
      "Аудио интерфейси, мониторинг, студио оборудване и решения за запис.",
    href: "/products?category=Студио%20оборудване",
    icon: "🎚️",
    tag: "Студио оборудване",
  },
  {
    title: "За клавиристи",
    description:
      "Клавишни инструменти, синтезатори и решения за учене, сцена и студио.",
    href: "/products?category=Клавишни%20инструменти",
    icon: "🎹",
    tag: "Клавишни инструменти",
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

const howItWorks = [
  {
    step: "01",
    title: "Разглеждаш каталога",
    description:
      "Избираш категория, марка или конкретен продукт от каталога.",
  },
  {
    step: "02",
    title: "Пишеш или оставяш данни",
    description:
      "Можеш да изпратиш WhatsApp запитване или да оставиш данни за доставка.",
  },
  {
    step: "03",
    title: "Уточняваме детайлите",
    description:
      "Потвърждаваме наличност, крайна цена, доставка или вземане от магазина.",
  },
];

const featuredProducts = products.slice(0, 6);

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

              <div className="hidden lg:block">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Burgas Music Store
                </p>
                <p className="text-sm font-bold text-slate-300">
                  Instruments · Studio · Accessories
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <a href="/products" className="hover:text-white">
                Продукти
              </a>
              <a href="#brands" className="hover:text-white">
                Марки
              </a>
              <a href="#directions" className="hover:text-white">
                Насоки
              </a>
              <a href="#contact" className="hover:text-white">
                Контакти
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

        <section className="grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200">
              Физически магазин в Бургас · Каталог без онлайн плащане
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Музикални инструменти, студио оборудване и аксесоари.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              SKY MUSIC BG е каталог за музиканти, студиа и сцена. Разгледай
              продукти, избери марка или категория и се свържи с нас за
              наличност, цена и доставка.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/products"
                className="rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-4 text-center font-black text-white shadow-xl shadow-blue-950/50 transition hover:scale-[1.02]"
              >
                Виж каталога
              </a>

              <a
                href="/request"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10"
              >
                Остави данни
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black">{products.length}+</p>
                <p className="mt-1 text-xs text-slate-400">примерни продукта</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black">6</p>
                <p className="mt-1 text-xs text-slate-400">категории</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-black">BG</p>
                <p className="mt-1 text-xs text-slate-400">Бургас</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-sky-500/30 via-blue-700/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/50">
              <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-950 to-black p-8">
                <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/15 via-blue-700/10 to-white/5 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                    SKY MUSIC BG
                  </p>
                  <h2 className="mt-4 text-3xl font-black leading-tight">
                    Избери категория и започни оттам
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Всеки сегмент отваря каталога вече филтриран по съответната
                    категория.
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  {[
                    "Струнни инструменти",
                    "Клавишни инструменти",
                    "Микрофони",
                    "Студио оборудване",
                  ].map((item) => {
                    const visual = getCategoryVisual(item);

                    return (
                      <a
                        key={item}
                        href={makeCategoryLink(item)}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{visual.icon}</span>
                          <div>
                            <p className="font-bold">{item}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              Виж продуктите в категорията
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl bg-white p-5 text-black">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                    Контакт
                  </p>
                  <p className="mt-2 text-2xl font-black">{phone}</p>
                  <p className="mt-1 text-sm text-slate-600">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="brands" className="py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                Марки
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Популярни брандове
              </h2>
              <p className="mt-4 max-w-2xl text-slate-400">
                Избери марка и отвори каталога филтриран само по нея. По-късно
                ще заменим текстовите банери с реални лога.
              </p>
            </div>

            <a
              href="/products"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
            >
              Всички продукти
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {brandBanners.map((brand) => (
              <a
                key={brand.name}
                href={makeBrandLink(brand.name)}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.08]"
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl transition group-hover:bg-sky-400/20" />
                <div className="relative">
                  <p className="text-2xl font-black tracking-tight text-white">
                    {brand.label}
                  </p>
                  <p className="mt-3 min-h-12 text-xs leading-5 text-slate-400">
                    {brand.subtitle}
                  </p>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-sky-300">
                    Виж марката →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="directions" className="py-14">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/30 to-black p-8 md:p-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                  Избор според нуждата
                </p>
                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  Намери правилното оборудване по-бързо
                </h2>
              </div>

              <p className="max-w-xl text-slate-400">
                Вместо да търсиш на сляпо, започни от конкретна посока —
                китара, вокал, домашно студио или клавишни инструменти.
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
                    Отвори категорията →
                  </p>
                </a>
              ))}
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
                Кратък начален подбор. За пълния каталог, филтри по марка и
                категории отвори страницата с всички продукти.
              </p>
            </div>

            <a
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
            >
              Виж всички продукти
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => {
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

                    <h3 className="mt-3 text-2xl font-black leading-tight transition group-hover:text-sky-200">
                      {product.name}
                    </h3>

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
        </section>

        <section
          id="about"
          className="my-16 grid gap-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-black p-8 md:grid-cols-3 md:p-12"
        >
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              За SKY MUSIC BG
            </p>
            <h2 className="mt-4 text-4xl font-black">
              Реален магазин, лично обслужване и консултация преди покупка.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              SKY MUSIC BG предлага музикални инструменти, студио оборудване
              и аксесоари в Бургас. Сайтът служи като каталог — клиентът
              разглежда, избира и се свързва с нас за потвърждение на наличност,
              цена и начин на получаване.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              "Физически магазин в Бургас",
              "Запитване преди покупка",
              "Консултация за избор",
              "Доставка след уговорка",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 font-bold"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-10">
          <div className="overflow-hidden rounded-[2rem] bg-white text-black">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 md:p-12">
                <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-700">
                  Контакти
                </p>
                <h2 className="mt-4 text-4xl font-black md:text-5xl">
                  Хареса ли си продукт?
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                  Свържи се с нас и ще уточним наличност, цена, доставка
                  или вземане от магазина.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a
                    href={`tel:${phone}`}
                    className="rounded-2xl bg-black px-6 py-5 text-center font-black text-white"
                  >
                    📞 {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="rounded-2xl bg-slate-900 px-6 py-5 text-center font-black text-white"
                  >
                    ✉️ Имейл
                  </a>
                  <a
                    href={makeWhatsappLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-green-600 px-6 py-5 text-center font-black text-white"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={messengerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-blue-600 px-6 py-5 text-center font-black text-white"
                  >
                    Messenger
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-950 via-slate-950 to-black p-8 text-white md:p-12">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                    SKY MUSIC BG
                  </p>
                  <h3 className="mt-4 text-3xl font-black">
                    Бургас · Музикален магазин
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Лична консултация, проверка на наличност и изпращане след
                    уговорка.
                  </p>
                </div>

                <div className="mt-8 space-y-4 text-slate-300">
                  <p>Бургас</p>
                  <p>Музикални инструменти</p>
                  <p>Студио оборудване</p>
                  <p>Аксесоари</p>
                  <p>Каталог с цени и директно запитване</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-8 md:p-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                  Как работи
                </p>
                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  Каталог без количка и онлайн плащане
                </h2>
              </div>

              <p className="max-w-xl text-slate-400">
                Целта е клиентът да избере продукт и да се свърже с магазина.
                Така потвърждаваме наличност и детайли преди изпращане.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <p className="text-sm font-black text-sky-300">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-2xl font-black">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-500">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p>© 2026 SKY MUSIC BG. Всички права запазени.</p>
            <p>
              Бургас · {phone} · {email}
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}