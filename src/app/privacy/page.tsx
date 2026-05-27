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
  title: "Политика за поверителност",
  description:
    "Политика за поверителност и обработване на лични данни от SKY MUSIC BG / Скаймюзик БГ ЕООД.",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Правна информация"
      title="Политика за поверителност"
      intro="Настоящата политика описва как Скаймюзик БГ ЕООД събира, използва и защитава личните данни на посетителите и клиентите на сайта SKY MUSIC BG."
    >
      <div className="space-y-10 text-sm leading-7 text-slate-300 md:text-base">
        <section>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] p-5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
              Накратко
            </p>

            <p className="mt-4 leading-7 text-slate-200">
              Използваме предоставените от Вас данни, за да обработим заявка
              за поръчка, да се свържем с Вас, да уточним доставката или
              получаването от магазина и да изпълним законовите си задължения.
              Към момента сайтът не използва Google Analytics, Meta Pixel или
              други рекламни/аналитични инструменти.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <SectionTitle>1. Администратор на лични данни</SectionTitle>

          <p>
            Администратор на личните данни, обработвани чрез този сайт, е:
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="text-lg font-black text-white">{companyName}</p>

            <div className="mt-4 grid gap-2 text-slate-300">
              <p>ЕИК: {companyNumber}</p>
              <p>Адрес: {companyAddress}</p>

              <p>
                Имейл:{" "}
                <a
                  href={`mailto:${companyEmail}`}
                  className="font-bold text-sky-300 transition hover:text-sky-200"
                >
                  {companyEmail}
                </a>
              </p>

              <p>
                Телефон:{" "}
                <a
                  href={phoneLink}
                  className="font-bold text-sky-300 transition hover:text-sky-200"
                >
                  {phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <p>
            Можете да използвате тези контакти за въпроси относно обработването
            на Вашите лични данни или за упражняване на правата си.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>2. Какви данни събираме</SectionTitle>

          <p>
            В зависимост от начина, по който използвате сайта, можем да
            обработваме следните категории лични данни:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Заявка за поръчка",
                items: [
                  "име и фамилия;",
                  "телефон за връзка;",
                  "имейл адрес, когато е предоставен;",
                  "избран продукт;",
                  "начин на получаване;",
                  "град и адрес или предпочитан офис/автомат за доставка;",
                  "съдържание на бележката към заявката.",
                ],
              },
              {
                title: "Комуникация с нас",
                items: [
                  "данни, които предоставяте по телефон или имейл;",
                  "съдържание на запитването Ви;",
                  "данни, предоставени чрез WhatsApp или Messenger, когато доброволно изберете такъв канал.",
                ],
              },
              {
                title: "Доставка и рекламации",
                items: [
                  "данни за доставка и получаване;",
                  "информация относно връщане или рекламация;",
                  "документи и доказателства, когато са необходими за разглеждане на рекламация.",
                ],
              },
              {
                title: "Технически данни",
                items: [
                  "стандартни технически данни, необходими за зареждане и сигурност на сайта;",
                  "данни, необходими за предотвратяване на злоупотреби със заявките.",
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <h3 className="font-black text-white">{group.title}</h3>

                <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-400">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-sky-300">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p>
            Не изискваме да предоставяте чувствителни лични данни чрез формата
            за поръчка или бележката към нея. Моля, не изпращайте такава
            информация, освен ако това не е строго необходимо и предварително
            уговорено.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>3. За какво използваме данните и на какво основание</SectionTitle>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-[1.1fr_1.35fr_1fr] gap-5 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 md:grid">
              <p>Цел</p>
              <p>Какво включва</p>
              <p>Основание</p>
            </div>

            {[
              {
                purpose: "Обработка на заявка",
                details:
                  "Получаване на заявката, връзка с Вас, потвърждение на наличност, начин на доставка и плащане.",
                basis:
                  "Стъпки преди сключване на договор и изпълнение на договор, когато поръчката бъде потвърдена.",
              },
              {
                purpose: "Доставка или лично получаване",
                details:
                  "Предаване на необходимите данни за доставка на избрания куриер или подготовка за получаване от магазина.",
                basis: "Изпълнение на потвърдена поръчка.",
              },
              {
                purpose: "Рекламации и отказ",
                details:
                  "Приемане и разглеждане на рекламации, отказ от договор от разстояние и връщане на стоки.",
                basis:
                  "Изпълнение на договор и спазване на приложими законови задължения.",
              },
              {
                purpose: "Счетоводство и законови задължения",
                details:
                  "Съхраняване на документи и информация, когато това се изисква от приложимото законодателство.",
                basis: "Законово задължение.",
              },
              {
                purpose: "Сигурност и защита",
                details:
                  "Предотвратяване на злоупотреби, спам заявки и защита на законните ни интереси при спор.",
                basis: "Легитимен интерес.",
              },
            ].map((item) => (
              <div
                key={item.purpose}
                className="grid gap-3 border-b border-white/10 px-5 py-5 last:border-b-0 md:grid-cols-[1.1fr_1.35fr_1fr] md:gap-5"
              >
                <p className="font-black text-white">{item.purpose}</p>
                <p className="text-slate-400">{item.details}</p>
                <p className="text-slate-300">{item.basis}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>4. Заявката през сайта и потвърждението на поръчка</SectionTitle>

          <p>
            Изпращането на формата „Поръчка / доставка“ представлява заявка за
            контакт и покупка. То не означава автоматично потвърждение на
            наличност, доставка или окончателно сключване на продажба.
          </p>

          <p>
            След получаване на заявката ще се свържем с Вас чрез предоставения
            телефон или имейл, за да уточним наличността, доставката, цената на
            доставката и плащането.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p>
              Повече информация за начина на доставка и плащане можете да
              намерите на страницата{" "}
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
          <SectionTitle>5. На кого могат да бъдат предоставени данните</SectionTitle>

          <p>
            Не продаваме Вашите лични данни. Данните могат да бъдат
            предоставяни само доколкото е необходимо за работа на сайта,
            обработване на заявката или изпълнение на потвърдена поръчка.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Email услуга",
                text: "Използваме Resend за изпращане на уведомлението за Вашата заявка към нашия служебен имейл адрес.",
              },
              {
                title: "Хостинг на сайта",
                text: "Сайтът се публикува чрез Vercel, която осигурява техническата инфраструктура за работата на приложението.",
              },
              {
                title: "Куриери",
                text: "При потвърдена доставка необходимите данни могат да бъдат предоставени на Еконт или Спиди за изпълнение на доставката.",
              },
              {
                title: "Външни канали за контакт",
                text: "Ако доброволно изберете WhatsApp или Messenger чрез бутона „Чат с нас“, комуникацията се осъществява чрез съответната външна услуга.",
              },
              {
                title: "Компетентни органи",
                text: "Данни могат да бъдат предоставени на държавни или контролни органи, когато това се изисква по закон.",
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
            При използване на външни доставчици на технологични или
            комуникационни услуги е възможно данните да бъдат обработвани извън
            Европейското икономическо пространство в съответствие с
            приложимите механизми за защита и условията на съответния
            доставчик.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>6. Колко време съхраняваме данните</SectionTitle>

          <p>
            Съхраняваме личните данни само толкова дълго, колкото е необходимо
            за целите, за които са събрани, или доколкото законът изисква това.
          </p>

          <div className="grid gap-4">
            {[
              {
                title: "Заявки, които не водят до потвърдена поръчка",
                text: "Съхраняват се за срока, необходим за обработване на запитването и последващата комуникация, както и за защита при възникнал спор.",
              },
              {
                title: "Потвърдени поръчки и продажби",
                text: "Съхраняват се за сроковете, приложими към договорните, счетоводните, данъчните и потребителските задължения на търговеца.",
              },
              {
                title: "Рекламации, откази и връщания",
                text: "Съхраняват се за срока, необходим за разглеждането им и за приложимите законови или давностни срокове.",
              },
              {
                title: "Комуникация по въпрос",
                text: "Съхранява се доколкото е необходимо за отговор и последваща връзка по конкретното запитване.",
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
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>7. Вашите права</SectionTitle>

          <p>
            Съгласно приложимото законодателство за защита на личните данни
            можете да упражните следните права, когато условията за това са
            налице:
          </p>

          <div className="grid gap-3">
            {[
              "право на информация и достъп до обработваните лични данни;",
              "право на коригиране на неточни или непълни данни;",
              "право на изтриване на лични данни;",
              "право на ограничаване на обработването;",
              "право на възражение срещу обработване, основано на легитимен интерес;",
              "право на преносимост на данните, когато е приложимо;",
              "право да оттеглите съгласие, когато обработването се основава на съгласие, без това да засяга законосъобразността преди оттеглянето;",
              "право да подадете жалба до компетентния надзорен орган.",
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

          <p>
            За упражняване на право изпратете заявка на{" "}
            <a
              href={`mailto:${companyEmail}`}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>
            . Възможно е да поискаме допълнителна информация за потвърждаване
            на самоличността Ви преди предоставяне на данни или извършване на
            действие по заявката.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>8. Жалба до надзорен орган</SectionTitle>

          <p>
            Ако считате, че личните Ви данни се обработват в нарушение на
            закона, имате право да подадете жалба до:
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="text-lg font-black text-white">
              Комисия за защита на личните данни (КЗЛД)
            </p>

            <p className="mt-3">
              бул. „Проф. Цветан Лазаров“ № 2
              <br />
              1592 София, България
            </p>

            <a
              href="https://cpdp.bg/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:border-sky-400/30 hover:bg-white/[0.1]"
            >
              Посетете сайта на КЗЛД →
            </a>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>9. Бисквитки и аналитични инструменти</SectionTitle>

          <p>
            Към момента сайтът не използва Google Analytics, Meta Pixel или
            други рекламни/аналитични технологии за проследяване на
            посетителите.
          </p>

          <p>
            Ако в бъдеще бъдат активирани аналитични или рекламни инструменти,
            тази политика и{" "}
            <Link
              href="/cookies"
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              Политиката за бисквитки
            </Link>{" "}
            ще бъдат актуализирани, а когато е необходимо, посетителите ще
            получат възможност да направят избор относно използването им преди
            тяхното активиране.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>10. Външни връзки и комуникационни услуги</SectionTitle>

          <p>
            Сайтът съдържа връзки към външни услуги, включително Google Maps,
            WhatsApp и Messenger. Отварянето или използването на тези услуги се
            извършва извън сайта на SKY MUSIC BG и може да бъде предмет на
            техните собствени политики за поверителност и условия.
          </p>

          <p>
            Плаващият бутон „Чат с нас“ не изпраща автоматично Ваши данни към
            WhatsApp или Messenger. Данни се предоставят на съответната услуга,
            когато изберете да я отворите и да започнете комуникация.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>11. Автоматизирани решения и маркетинг</SectionTitle>

          <p>
            Към момента не използваме автоматизирано вземане на решения или
            профилиране, което да поражда правни последици или да Ви засяга
            съществено по сходен начин.
          </p>

          <p>
            Към момента не изпращаме рекламни бюлетини въз основа на данните,
            предоставени чрез формата за заявка. Ако в бъдеще бъде въведен
            маркетингов бюлетин, той ще бъде организиран отделно и при
            необходимост след изрично съгласие.
          </p>
        </section>

        <section className="border-t border-white/10 pt-9">
          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/[0.07] p-6">
            <SectionTitle>Контакт относно личните данни</SectionTitle>

            <p className="mt-5">
              За въпроси по тази политика или за упражняване на Вашите права
              можете да се свържете с {companyName}:
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