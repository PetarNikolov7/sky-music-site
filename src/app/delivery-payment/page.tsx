import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

const phoneDisplay = "+359 884 211 761";
const phoneLink = "tel:+359884211761";
const email = "skymusicstorebg@gmail.com";

export const metadata: Metadata = {
  title: "Доставка и плащане",
  description:
    "Информация за доставка, лично вземане и начините на плащане в SKY MUSIC BG.",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

export default function DeliveryPaymentPage() {
  return (
    <LegalPageLayout
      eyebrow="Информация за клиенти"
      title="Доставка и плащане"
      intro="Информация за начина на получаване на продуктите, сроковете за изпращане и наличните начини на плащане при заявка през сайта на SKY MUSIC BG."
    >
      <div className="space-y-10 text-sm leading-7 text-slate-300 md:text-base">
        <section>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] p-5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Важно
            </p>

            <p className="mt-4 leading-7 text-slate-200">
              Изпращането на заявка през сайта не представлява автоматично
              потвърждение на поръчката. След получаване на заявката
              представител на <strong className="text-white">Скаймюзик БГ ЕООД</strong>{" "}
              ще се свърже с Вас за потвърждение на наличността, начина на
              получаване, стойността на доставката и плащането.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle>Начини на получаване</SectionTitle>

          <p>
            Можете да заявите продукт за получаване по един от следните
            начини:
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Лично вземане",
                description:
                  "От физическия магазин на адрес: ул. Георги Баев 23, Бургас, България.",
              },
              {
                title: "Доставка с Еконт",
                description:
                  "До офис, автомат или адрес, след потвърждение на заявката.",
              },
              {
                title: "Доставка със Спиди",
                description:
                  "До офис, автомат или адрес, след потвърждение на заявката.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="font-black text-white">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p>
            Докато бъде въведен автоматичният избор на офис или автомат в
            сайта, можете да посочите предпочитания куриер и офис в полето за
            адрес или бележка към заявката. Ние ще потвърдим данните при
            връзката с Вас.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Цена на доставката</SectionTitle>

          <p>
            Цената на доставката се определя според актуалната тарифа на
            избрания куриер — Еконт или Спиди — освен когато изрично е обявено
            друго условие за конкретен продукт или промоция.
          </p>

          <p>
            Преди изпращане на поръчката ще уточним с Вас избрания начин на
            получаване и приложимата цена на доставката.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Срок за изпращане</SectionTitle>

          <p>
            След потвърждение на заявката и наличността продуктът се изпраща
            в срок до <strong className="text-white">5 работни дни</strong>,
            освен ако за конкретния продукт не бъде уговорен различен срок.
          </p>

          <p>
            При обстоятелства, които могат да доведат до забавяне, ще се
            свържем с Вас чрез предоставения телефон или имейл.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Начини на плащане</SectionTitle>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                При доставка
              </p>

              <h3 className="mt-3 font-black text-white">Наложен платеж</h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Заплащате стойността на поръчката при получаване от куриера.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                В магазина
              </p>

              <h3 className="mt-3 font-black text-white">Плащане на място</h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                При лично вземане плащането се извършва във физическия магазин.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p>
              Към момента сайтът не предлага онлайн плащане с карта и не
              приема плащане чрез банков превод през онлайн формата.
            </p>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Преглед и тест при доставка</SectionTitle>

          <p>
            Преглед и тест при доставка могат да бъдат предоставени, когато са
            приложими за конкретния продукт и когато услугата се поддържа от
            избрания куриер. Конкретните условия ще бъдат уточнени при
            потвърждаване на заявката.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Лично вземане от магазина</SectionTitle>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="font-black text-white">SKY MUSIC BG</p>

            <p className="mt-3">
              ул. Георги Баев 23
              <br />
              Бургас, България
            </p>

            <div className="mt-5 grid gap-1 text-slate-400">
              <p>Понеделник – Петък: 10:00 – 18:00</p>
              <p>Събота: 10:00 – 13:00</p>
              <p>Неделя: Почивен ден</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-9">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
            <SectionTitle>Въпроси относно доставка или плащане</SectionTitle>

            <p className="mt-5">
              Свържете се с нас преди изпращане на заявката или използвайте
              плаващия бутон „Чат с нас“ на сайта.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={phoneLink}
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-black text-black transition hover:bg-slate-200"
              >
                {phoneDisplay}
              </a>

              <a
                href={`mailto:${email}`}
                className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.1]"
              >
                {email}
              </a>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}