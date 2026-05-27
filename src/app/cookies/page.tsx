import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";

const companyName = "Скаймюзик БГ ЕООД";
const companyEmail = "skymusicstorebg@gmail.com";
const phoneDisplay = "+359 884 211 761";
const phoneLink = "tel:+359884211761";

export const metadata: Metadata = {
  title: "Политика за бисквитки",
  description:
    "Информация за бисквитките и сходните технологии, използвани в сайта на SKY MUSIC BG.",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

export default function CookiesPage() {
  return (
    <LegalPageLayout
      eyebrow="Правна информация"
      title="Политика за бисквитки"
      intro="Настоящата политика описва използването на бисквитки и сходни технологии в сайта на SKY MUSIC BG, както и начина, по който тази информация може да бъде актуализирана при бъдещо добавяне на аналитични или рекламни инструменти."
    >
      <div className="space-y-10 text-sm leading-7 text-slate-300 md:text-base">
        <section>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] p-5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Текущо състояние
            </p>

            <h2 className="mt-4 text-xl font-black text-white md:text-2xl">
              Към момента не използваме рекламни или аналитични бисквитки
            </h2>

            <p className="mt-4 leading-7 text-slate-200">
              В сайта не са активирани от {companyName} инструменти като
              Google Analytics, Google Ads conversion tracking или Meta Pixel
              за анализ, реклама или проследяване на посетителите.
            </p>

            <p className="mt-4 leading-7 text-slate-200">
              Ако в бъдеще бъдат добавени такива инструменти, настоящата
              политика ще бъде актуализирана, а когато е необходимо, ще бъде
              предоставена възможност за избор преди тяхното активиране.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle>1. Какво представляват бисквитките</SectionTitle>

          <p>
            Бисквитките са малки текстови файлове или сходни технически
            средства, които могат да бъдат съхранявани на устройството Ви при
            посещение на уебсайт. Те могат да служат за осигуряване на
            основната работа на сайта, запомняне на предпочитания, анализ на
            посещенията или рекламни цели.
          </p>

          <p>
            Не всички бисквитки имат еднаква цел. Част от тях могат да бъдат
            необходими за правилната и сигурна работа на услугата, докато други
            се използват само при допълнителни функции като анализ или
            персонализирана реклама.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>2. Какви категории бисквитки съществуват</SectionTitle>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Необходими",
                status: "Не изискват предварителен избор",
                text: "Технически средства, необходими за зареждане, сигурност и нормално използване на основните функции на сайта.",
                enabled: true,
              },
              {
                title: "Функционални",
                status: "Не са активирани отделно към момента",
                text: "Средства за запомняне на допълнителни предпочитания или подобрено персонализирано използване на сайта.",
                enabled: false,
              },
              {
                title: "Аналитични",
                status: "Не се използват към момента",
                text: "Инструменти за измерване на посещаемост, разглеждани страници и поведение на посетителите, например Google Analytics.",
                enabled: false,
              },
              {
                title: "Маркетингови / рекламни",
                status: "Не се използват към момента",
                text: "Инструменти за измерване на рекламни кампании или показване на персонализирани реклами, например Meta Pixel или Google Ads tracking.",
                enabled: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={
                  item.enabled
                    ? "rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-5 md:p-6"
                    : "rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6"
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-black text-white">
                    {item.title}
                  </h3>

                  <span
                    className={
                      item.enabled
                        ? "rounded-full bg-sky-400/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-sky-200"
                        : "rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"
                    }
                  >
                    {item.enabled ? "Необходими" : "Неактивни"}
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-slate-300">
                  {item.status}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>3. Използване на сайта без маркетингови технологии</SectionTitle>

          <p>
            Можете да разглеждате продуктите, категориите, информацията за
            магазина и правните страници без активирани рекламни или
            аналитични технологии от наша страна.
          </p>

          <p>
            Изпращането на заявка чрез страницата „Поръчка / доставка“ служи
            за предаване на въведените от Вас данни към {companyName} с цел
            обработване на заявката. Повече информация за личните данни можете
            да намерите в{" "}
            <Link
              href="/privacy"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              Политиката за поверителност
            </Link>
            .
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>4. Външни услуги и връзки</SectionTitle>

          <p>
            Сайтът съдържа бутони или връзки към външни услуги, включително
            Google Maps, WhatsApp и Messenger.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Google Maps",
                text: "Отваря се само когато натиснете бутона за местоположението на магазина.",
              },
              {
                title: "WhatsApp",
                text: "Отваря се само когато го изберете чрез плаващия бутон „Чат с нас“.",
              },
              {
                title: "Messenger",
                text: "Отваря се само когато го изберете чрез плаващия бутон „Чат с нас“.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="font-black text-white">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p>
            След като отворите външна услуга, нейният доставчик може да използва
            собствени бисквитки или технологии съгласно собствените си условия
            и политики. Тези външни услуги не се управляват от {companyName}.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>5. Управление на бисквитки чрез браузъра</SectionTitle>

          <p>
            Можете да използвате настройките на браузъра си, за да преглеждате,
            ограничавате или изтривате съхранени бисквитки. Имайте предвид, че
            блокирането на технически необходими средства може да повлияе на
            правилната работа на някои функции на сайтовете, които посещавате.
          </p>

          <p>
            Понеже към момента не използваме незадължителни аналитични или
            маркетингови бисквитки в сайта, не показваме отделен панел за
            избор на такива технологии.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>6. Бъдещо добавяне на анализ и реклама</SectionTitle>

          <p>
            В бъдеще е възможно да използваме инструменти за анализ на
            посещаемостта или измерване на рекламни кампании, например Google
            Analytics, Google Ads или Meta Pixel.
          </p>

          <p>
            Преди активиране на технологии, за които се изисква съгласие, ще:
          </p>

          <div className="grid gap-3">
            {[
              "актуализираме настоящата политика;",
              "опишем конкретните използвани инструменти и тяхната цел;",
              "посочим начина и срока на използване на съответните технологии, когато е приложимо;",
              "осигурим панел за избор и възможност за отказ, когато това се изисква;",
              "не активираме незадължителните технологии преди Вашия избор, когато се изисква предварително съгласие.",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <span className="mt-0.5 text-sky-300">•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>7. Промени в тази политика</SectionTitle>

          <p>
            Можем да актуализираме тази политика при промяна във
            функционалността на сайта, въвеждане на нови услуги или промяна на
            приложимите изисквания.
          </p>

          <p>
            Актуалната версия ще бъде публикувана на тази страница с посочена
            дата на последна актуализация.
          </p>
        </section>

        <section className="border-t border-white/10 pt-9">
          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/[0.07] p-6">
            <SectionTitle>Контакт</SectionTitle>

            <p className="mt-5">
              За въпроси относно използването на бисквитки или защитата на
              личните данни можете да се свържете с {companyName}:
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={phoneLink}
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
              >
                {phoneDisplay}
              </a>

              <a
                href={`mailto:${companyEmail}`}
                className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.1]"
              >
                {companyEmail}
              </a>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}