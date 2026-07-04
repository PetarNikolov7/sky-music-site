import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "SKY MUSIC BG | Сайтът се обновява",
  description:
    "SKY MUSIC BG обновява своя онлайн магазин. За връзка: +359884211761, skymusicstorebg@gmail.com.",
  robots: {
    index: false,
    follow: false,
  },
};

const phoneRaw = "+359884211761";
const phoneDisplay = "+359 884 211 761";
const email = "skymusicstorebg@gmail.com";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.26),transparent_38%)]" />
      <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="absolute -right-32 bottom-12 h-80 w-80 rounded-full bg-blue-700/20 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 py-12 text-center">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-10">
          <div className="mx-auto flex max-w-sm items-center justify-center rounded-[2rem] border border-sky-400/20 bg-black/30 p-5">
            <Image
              src="/sky-music-logo-dark-header.png"
              alt="SKY MUSIC BG"
              width={420}
              height={180}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="mt-8 inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-sky-200">
            Сайтът се обновява
          </div>

          <h1 className="mt-7 text-4xl font-black leading-tight md:text-6xl">
            Онлайн магазинът на SKY MUSIC BG е в процес на обновяване.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Подготвяме нова версия на сайта с продукти, заявки и удобна
            информация за доставка. Междувременно може да се свържете с нас
            директно по телефон или имейл.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            <a
              href={`tel:${phoneRaw}`}
              className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/10 p-5 text-left transition hover:bg-sky-400/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                Телефон
              </p>
              <p className="mt-3 text-2xl font-black text-white">
                {phoneDisplay}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Натиснете за директно обаждане от мобилно устройство.
              </p>
            </a>

            <a
              href={`mailto:${email}`}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.08]"
            >
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                Имейл
              </p>
              <p className="mt-3 break-all text-2xl font-black text-white">
                {email}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Пишете ни за продукти, наличности и поръчки.
              </p>
            </a>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-slate-400">
            <p className="font-black text-white">SKY MUSIC BG · Бургас</p>
            <p className="mt-2">
              Музикални инструменти, озвучаване, аксесоари и консултация при
              избор на оборудване.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
