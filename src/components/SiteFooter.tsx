import Link from "next/link";

const phoneDisplay = "+359 884 211 761";
const phoneLink = "tel:+359884211761";
const email = "skymusicstorebg@gmail.com";
const mapsLink = "https://maps.app.goo.gl/MbzcxmoBwE7t3Y8c6";

const customerLinks = [
  {
    label: "Продукти",
    href: "/products",
  },
  {
    label: "Поръчка / доставка",
    href: "/request",
  },
  {
    label: "Доставка и плащане",
    href: "/delivery-payment",
  },
  {
    label: "Отказ, връщане и рекламации",
    href: "/returns-claims",
  },
];

const legalLinks = [
  {
    label: "Общи условия",
    href: "/terms",
  },
  {
    label: "Политика за поверителност",
    href: "/privacy",
  },
  {
    label: "Политика за бисквитки",
    href: "/cookies",
  },
];

const linkClassName =
  "text-sm leading-6 text-slate-400 transition hover:text-sky-200";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#060914] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.85fr_0.95fr_1.15fr]">
          <div>
            <Link href="/" className="inline-block">
              <p className="text-xs font-black uppercase tracking-[0.34em] text-sky-300">
                SKY MUSIC BG
              </p>

              <p className="mt-4 text-2xl font-black text-white">
                Музикален магазин
              </p>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Музикални инструменти, студио оборудване и аксесоари с доставка
              в цяла България и лично обслужване във физическия ни магазин.
            </p>

            <div className="mt-6 rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] p-4">
              <p className="text-sm leading-6 text-slate-300">
                Заявките за поръчка се потвърждават допълнително от наш
                представител преди изпращане или получаване от магазина.
              </p>
            </div>
          </div>

          <nav aria-label="Връзки за клиенти">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
              За клиенти
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {customerLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Правна информация">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
              Правна информация
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="mt-7 text-xs leading-6 text-slate-500">
              Плащане с наложен платеж или на място в магазина. Доставка чрез
              Еконт и Спиди.
            </p>
          </nav>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
              Контакти и посещение
            </p>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
              <div>
                <p className="font-bold text-white">ул. Георги Баев 23</p>
                <p>Бургас, България</p>
              </div>

              <div>
                <p>Понеделник – Петък: 10:00 – 18:00</p>
                <p>Събота: 10:00 – 13:00</p>
                <p>Неделя: Почивен ден</p>
              </div>

              <div className="flex flex-col gap-2">
                <a href={phoneLink} className={linkClassName}>
                  {phoneDisplay}
                </a>

                <a href={`mailto:${email}`} className={linkClassName}>
                  {email}
                </a>
              </div>
            </div>

            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-sky-400/30 hover:bg-white/[0.09]"
            >
              Отворете в Google Maps →
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col justify-between gap-4 text-xs leading-6 text-slate-500 lg:flex-row lg:items-center">
            <p>© 2026 SKY MUSIC BG. Всички права запазени.</p>

            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <span>Скаймюзик БГ ЕООД</span>
              <span className="hidden text-slate-700 sm:inline">·</span>
              <span>ЕИК: 206264731</span>
              <span className="hidden text-slate-700 sm:inline">·</span>
              <span>Дружеството не е регистрирано по ДДС</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}