import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";

const companyName = "Скаймюзик БГ ЕООД";
const companyNumber = "206264731";
const companyAddress = "гр. Бургас, ул. Георги Баев 23";
const companyEmail = "skymusicstorebg@gmail.com";
const phoneDisplay = "+359 884 211 761";
const phoneLink = "tel:+359884211761";

export const metadata: Metadata = {
  title: "Общи условия",
  description:
    "Общи условия за използване на сайта и заявяване на продукти от SKY MUSIC BG / Скаймюзик БГ ЕООД.",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
        >
          <span className="mt-0.5 text-sky-300">•</span>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Правна информация"
      title="Общи условия"
      intro="Настоящите общи условия уреждат използването на сайта SKY MUSIC BG, изпращането на заявки за продукти и условията, приложими при последващо потвърждаване на покупка от Скаймюзик БГ ЕООД."
    >
      <div className="space-y-10 text-sm leading-7 text-slate-300 md:text-base">
        <section>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] p-5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Важно за заявките през сайта
            </p>

            <p className="mt-4 leading-7 text-slate-200">
              Изпращането на форма чрез „Поръчка / доставка“ представлява
              заявка за покупка и контакт. Заявката не е автоматично
              потвърждение на наличност, доставка или сключена продажба. След
              получаването ѝ ще се свържем с Вас, за да потвърдим продукта,
              цената, наличността, начина и цената на доставката и начина на
              плащане.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle>1. Данни за търговеца</SectionTitle>

          <p>
            Сайтът SKY MUSIC BG се управлява от следния търговец:
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="text-lg font-black text-white">{companyName}</p>

            <div className="mt-4 grid gap-2 text-slate-300">
              <p>ЕИК: {companyNumber}</p>
              <p>Дружеството не е регистрирано по ДДС.</p>
              <p>Седалище и адрес на управление: {companyAddress}</p>
              <p>Адрес на физическия магазин: ул. Георги Баев 23, Бургас, България</p>

              <p>
                Имейл: {" "}
                <a
                  href={`mailto:${companyEmail}`}
                  className="font-bold text-sky-300 transition hover:text-sky-200"
                >
                  {companyEmail}
                </a>
              </p>

              <p>
                Телефон: {" "}
                <a
                  href={phoneLink}
                  className="font-bold text-sky-300 transition hover:text-sky-200"
                >
                  {phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>2. Обхват и приемане на условията</SectionTitle>

          <p>
            Настоящите общи условия се прилагат при използване на сайта,
            разглеждане на продукти, изпращане на заявка чрез формата
            „Поръчка / доставка“ и при покупка, която впоследствие бъде
            потвърдена от търговеца и клиента.
          </p>

          <p>
            С изпращане на заявка през сайта потвърждавате, че сте се
            запознали с тези общи условия, с {" "}
            <Link
              href="/privacy"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              Политиката за поверителност
            </Link>{" "}
            и с приложимата информация за {" "}
            <Link
              href="/delivery-payment"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              доставка и плащане
            </Link>
            .
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>3. Продукти и информация в сайта</SectionTitle>

          <p>
            На сайта се публикува информация за предлагани музикални
            инструменти, студио оборудване и аксесоари, включително снимки,
            описание, категория, марка, цена и обозначение за наличност, когато
            такова е посочено.
          </p>

          <BulletList
            items={[
              "Снимките на продуктите имат информационен характер и е възможно да има разлики, произтичащи от дисплей, осветление или актуализация на производител.",
              "Публикуваното обозначение за наличност се потвърждава при обработването на конкретната заявка.",
              "При очевидна техническа или редакционна грешка в публикувана информация ще се свържем с клиента преди потвърждаване на покупката.",
            ]}
          />
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>4. Цени</SectionTitle>

          <p>
            Цените на продуктите са посочени на съответната продуктова
            страница. Когато е показана цена в повече от една валута, при
            потвърждаване на заявката се уточнява приложимата крайна цена за
            конкретната покупка.
          </p>

          <p>
            Цената на доставката не е включена в цената на продукта, освен ако
            това не е изрично посочено. Тя се определя според тарифата на
            избрания куриер и се уточнява при потвърждението на заявката.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>5. Изпращане на заявка и потвърждаване на покупка</SectionTitle>

          <p>
            За да заявите продукт, можете да използвате страницата
            „Поръчка / доставка“, като попълните необходимите данни за продукт,
            контакт и предпочитан начин на получаване.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Изпращате заявка",
                text: "Попълвате продукта и данните за контакт и доставка.",
              },
              {
                step: "02",
                title: "Свързваме се с Вас",
                text: "Потвърждаваме наличност, цена, доставка и плащане.",
              },
              {
                step: "03",
                title: "Потвърждаване",
                text: "Покупката се финализира след съгласуване с клиента.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                  {item.step}
                </p>
                <h3 className="mt-3 font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p>
            Преди изпращане на заявката клиентът носи отговорност да провери
            правилността на въведените данни. Ако установите грешка след
            изпращането, свържете се с нас възможно най-скоро на {" "}
            <a
              href={`mailto:${companyEmail}`}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>{" "}
            или на {" "}
            <a
              href={phoneLink}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {phoneDisplay}
            </a>
            .
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>6. Начини на плащане</SectionTitle>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                При доставка
              </p>
              <h3 className="mt-3 font-black text-white">Наложен платеж</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Заплащате поръчката при получаване чрез избрания куриер.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
                При лично получаване
              </p>
              <h3 className="mt-3 font-black text-white">Плащане в магазина</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Плащането се извършва на място във физическия магазин.
              </p>
            </div>
          </div>

          <p>
            Към момента сайтът не предлага онлайн картово плащане и не приема
            плащане чрез банков превод през онлайн формата.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>7. Доставка и лично вземане</SectionTitle>

          <p>
            Доставка се предлага чрез <strong className="text-white">Еконт</strong>{" "}
            и <strong className="text-white">Спиди</strong> до офис, автомат
            или адрес, когато съответната услуга е налична. Клиентът може също
            да получи потвърдена поръчка лично от магазина на ул. Георги Баев
            23, Бургас, България.
          </p>

          <BulletList
            items={[
              "Цената на доставката е съгласно тарифата на избрания куриер, освен ако изрично не е уговорено друго.",
              "След потвърждение на заявката и наличността продуктът се изпраща в срок до 5 работни дни, освен ако не е уговорен различен срок.",
              "Преглед и тест се предлагат, когато са приложими за конкретния продукт и се поддържат от избрания куриер.",
            ]}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p>
              Подробна информация ще намерите на страницата {" "}
              <Link
                href="/delivery-payment"
                className="font-black text-sky-300 transition hover:text-sky-200"
              >
                „Доставка и плащане“
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>8. Получаване, преглед и риск при доставка</SectionTitle>

          <p>
            При доставка препоръчваме да проверите целостта на пратката и,
            когато услугата е налична и приложима, да използвате „Преглед и
            тест“ преди окончателното приемане от куриера.
          </p>

          <p>
            При видима транспортна повреда уведомете куриера и се свържете с
            нас възможно най-скоро. Това не ограничава законовите Ви права при
            дефект или несъответствие на продукта.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>9. Право на отказ при договор от разстояние</SectionTitle>

          <p>
            Когато сте потребител и покупката е сключена от разстояние, имате
            право да се откажете от договора в срок от {" "}
            <strong className="text-white">14 дни</strong> от получаването на
            стоката, освен когато е приложимо законово изключение.
          </p>

          <p>
            За да упражните правото си на отказ, следва да ни уведомите с ясно
            заявление преди изтичането на срока. Разходите за връщане на
            стоката са за сметка на потребителя, освен ако не е уговорено
            друго.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p>
              Подробни условия и стандартен формуляр са публикувани на
              страницата {" "}
              <Link
                href="/returns-claims"
                className="font-black text-sky-300 transition hover:text-sky-200"
              >
                „Отказ, връщане и рекламации“
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>10. Рекламации и законова гаранция</SectionTitle>

          <p>
            За стоките се прилага законова гаранция за съответствие за срок от
            <strong className="text-white"> 2 години</strong> от получаването
            им. При дефект или несъответствие можете да предявите рекламация
            пред {companyName}.
          </p>

          <p>
            Рекламации могат да бъдат изпращани на {" "}
            <a
              href={`mailto:${companyEmail}`}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>{" "}
            или заявени на адрес: {companyAddress}.
          </p>

          <p>
            Подробна информация за рекламациите и законовата гаранция е
            публикувана на страницата {" "}
            <Link
              href="/returns-claims"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              „Отказ, връщане и рекламации“
            </Link>
            .
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>11. Лични данни и комуникация</SectionTitle>

          <p>
            При изпращане на заявка обработваме предоставените от клиента
            данни за целите на връзката, потвърждаването и изпълнението на
            поръчката. Подробности относно категориите данни, основанията,
            получателите и правата Ви са публикувани в {" "}
            <Link
              href="/privacy"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              Политиката за поверителност
            </Link>
            .
          </p>

          <p>
            Ако по Ваша инициатива използвате външен канал за контакт чрез
            плаващия бутон „Чат с нас“, като WhatsApp или Messenger,
            комуникацията се осъществява чрез съответната външна услуга.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>12. Бисквитки и външни услуги</SectionTitle>

          <p>
            Към момента сайтът не използва Google Analytics, Meta Pixel или
            други рекламни/аналитични инструменти, активирани от търговеца за
            проследяване на посетителите.
          </p>

          <p>
            Сайтът съдържа връзки към външни услуги като Google Maps, WhatsApp
            и Messenger, които се отварят само при действие от страна на
            посетителя. Повече информация е достъпна в {" "}
            <Link
              href="/cookies"
              className="font-black text-sky-300 transition hover:text-sky-200"
            >
              Политиката за бисквитки
            </Link>
            .
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>13. Права върху съдържанието</SectionTitle>

          <p>
            Съдържанието на сайта, включително текстове, структура, визуални
            елементи, лого и изображения, за които {companyName} притежава или
            има право да използва, не следва да бъде копирано, разпространявано
            или използвано за търговски цели без разрешение, освен доколкото
            законът допуска друго.
          </p>

          <p>
            Търговските марки и изображения на производители принадлежат на
            съответните им правоносители и могат да бъдат използвани в сайта с
            цел представяне на предлаганите продукти.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>14. Приложимо право и разрешаване на спорове</SectionTitle>

          <p>
            За въпроси, неуредени в настоящите общи условия, се прилага
            действащото законодателство на Република България и приложимото
            право на Европейския съюз. Настоящите условия не ограничават
            законовите права на потребителите.
          </p>

          <p>
            При възникнал въпрос или спор Ви насърчаваме първо да се свържете
            с нас, за да потърсим практично решение. Потребителят може да се
            обърне и към компетентните контролни органи, включително Комисията
            за защита на потребителите, или към компетентния съд.
          </p>

          <a
            href="https://kzp.bg/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-sky-400/30 hover:bg-white/[0.1]"
          >
            Посетете сайта на КЗП →
          </a>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>15. Промени в общите условия</SectionTitle>

          <p>
            Възможно е периодично да актуализираме настоящите общи условия при
            промяна на функционалността на сайта, начина на продажба или
            приложимите изисквания. Актуалната версия се публикува на тази
            страница с посочена дата на последна актуализация.
          </p>

          <p>
            За потвърдени поръчки се прилагат условията и договореностите,
            действащи и предоставени на клиента при потвърждаване на
            конкретната покупка, освен ако законът изисква друго.
          </p>
        </section>

        <section className="border-t border-white/10 pt-9">
          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/[0.07] p-6">
            <SectionTitle>Контакт с търговеца</SectionTitle>

            <p className="mt-5">
              За въпроси относно продукти, заявка, доставка, рекламация или
              настоящите общи условия можете да се свържете с {companyName}:
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
