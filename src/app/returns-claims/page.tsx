import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

const companyName = "Скаймюзик БГ ЕООД";
const companyEmail = "skymusicstorebg@gmail.com";
const phoneDisplay = "+359 884 211 761";
const phoneLink = "tel:+359884211761";
const returnAddress = "гр. Бургас, ул. Георги Баев 23";

export const metadata: Metadata = {
  title: "Отказ, връщане и рекламации",
  description:
    "Информация за право на отказ, връщане на стоки, рекламации и законова гаранция в SKY MUSIC BG.",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
      {children}
    </h2>
  );
}

export default function ReturnsClaimsPage() {
  return (
    <LegalPageLayout
      eyebrow="Информация за клиенти"
      title="Отказ, връщане и рекламации"
      intro="Информация за упражняване право на отказ при дистанционни покупки, връщане на получени стоки и предявяване на рекламация при дефект или несъответствие."
    >
      <div className="space-y-10 text-sm leading-7 text-slate-300 md:text-base">
        <section>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.08] p-5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                Отказ от покупка
              </p>

              <h2 className="mt-4 text-xl font-black text-white">
                До 14 дни при договор от разстояние
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Когато договорът за покупка е сключен от разстояние, като
                потребител имате право да се откажете от него в законоустановения
                срок, без да посочвате причина, освен когато е приложимо
                законово изключение.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                Рекламация
              </p>

              <h2 className="mt-4 text-xl font-black text-white">
                При дефект или несъответствие
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                При установено несъответствие или дефект можете да предявите
                рекламация. Законова гаранция за съответствие се прилага за
                срок от 2 години от получаването на стоката.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Право на отказ при дистанционна покупка</SectionTitle>

          <p>
            Когато след изпратена заявка бъде потвърдена и сключена покупка от
            разстояние, потребителят има право да се откаже от договора в срок
            от <strong className="text-white">14 дни</strong>, считано от
            датата, на която потребителят или посочено от него трето лице,
            различно от превозвача, е получило стоката.
          </p>

          <p>
            За покупка, сключена изцяло във физическия магазин, връщане на
            стока без дефект и без посочване на причина не се прилага по същия
            начин като правото на отказ при договор от разстояние.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <p className="font-black text-white">
              Как да ни уведомите за отказ
            </p>

            <p className="mt-4">
              Изпратете ясно заявление за отказ преди изтичането на 14-дневния
              срок на:
            </p>

            <a
              href={`mailto:${companyEmail}`}
              className="mt-3 inline-flex font-black text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>

            <p className="mt-4">
              Можете да използвате стандартния формуляр, публикуван по-долу на
              тази страница, или друго недвусмислено заявление, от което ясно
              се разбира решението Ви да се откажете от договора.
            </p>
          </div>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Връщане на стоката</SectionTitle>

          <p>
            След като ни уведомите за решението си да се откажете от договор от
            разстояние, трябва да изпратите или предадете стоката обратно без
            неоправдано забавяне и не по-късно от{" "}
            <strong className="text-white">14 дни</strong> от датата на
            уведомяването.
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
              Адрес за връщане
            </p>

            <p className="mt-4 text-lg font-black text-white">{companyName}</p>

            <p className="mt-2">
              {returnAddress}
              <br />
              България
            </p>

            <p className="mt-4">
              Телефон за контакт:{" "}
              <a
                href={phoneLink}
                className="font-bold text-sky-300 transition hover:text-sky-200"
              >
                {phoneDisplay}
              </a>
            </p>
          </div>

          <p>
            Преките разходи по връщане на стоката са за сметка на потребителя,
            освен ако предварително не сме уговорили друго.
          </p>

          <p>
            Препоръчваме стоката да бъде върната с придружаващите я аксесоари,
            документи и защитна опаковка, когато са налични, така че да бъде
            предпазена при транспортиране.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Състояние на върнатата стока</SectionTitle>

          <p>
            Потребителят има право да прегледа и изпробва стоката само
            доколкото е необходимо, за да установи нейното естество,
            характеристики и добро функциониране.
          </p>

          <p>
            Отварянето на опаковката или необходимото изпробване не водят сами
            по себе си до загуба на правото на отказ. Потребителят отговаря
            единствено за намалената стойност на стоката, когато тя е причинена
            от действия, надхвърлящи необходимото за установяване на нейното
            естество, характеристики и функциониране.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Възстановяване на платени суми</SectionTitle>

          <p>
            При валидно упражнено право на отказ възстановяваме получените
            плащания, включително разхода за стандартна доставка до клиента,
            когато такъв е бил заплатен. Не се възстановяват допълнителни
            разходи, произтичащи от избран по-скъп начин на доставка от
            предлагания стандартен вариант.
          </p>

          <p>
            Възстановяването се извършва в законоустановения срок до{" "}
            <strong className="text-white">14 дни</strong> от уведомяването за
            отказ. Когато е приложимо, можем да задържим възстановяването до
            получаване на стоката обратно или до представяне на доказателство,
            че тя е изпратена, в зависимост от това кое настъпи по-рано.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Кога правото на отказ може да не се прилага</SectionTitle>

          <p>
            Законовото право на отказ не се прилага или може да бъде изгубено
            в определени случаи, когато са приложими към конкретния продукт.
            Такива случаи могат да включват:
          </p>

          <div className="grid gap-3">
            {[
              "стоки, изработени по поръчка на клиента или съобразно негови индивидуални изисквания;",
              "запечатани стоки, които не могат да бъдат върнати поради съображения за защита на здравето или хигиена и са разпечатани след доставката;",
              "запечатани звукозаписи, видеозаписи или компютърен софтуер, които са разпечатани след доставката;",
              "други изрично предвидени в закона случаи.",
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
            Когато за конкретен продукт е приложимо изключение, ще Ви
            информираме ясно преди потвърждаване на заявката.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Рекламации и законова гаранция</SectionTitle>

          <p>
            За всички продавани стоки се прилага законова гаранция за
            съответствие със сключения договор за продажба за срок от{" "}
            <strong className="text-white">2 години</strong> от получаването им.
          </p>

          <p>
            Ако установите дефект или несъответствие на получен продукт, можете
            да предявите рекламация пред {companyName}. За по-бърза обработка
            препоръчваме рекламацията да бъде изпратена писмено на{" "}
            <a
              href={`mailto:${companyEmail}`}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>
            .
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="font-black text-white">
              При рекламация приложете, когато е приложимо:
            </p>

            <ul className="mt-4 grid gap-3">
              {[
                "име и данни за контакт;",
                "продукт и дата на покупката;",
                "касова бележка, фактура или друг документ за покупката;",
                "описание на установения дефект или несъответствие;",
                "снимки или други документи, когато могат да подпомогнат проверката;",
                "предпочитано разрешение на рекламацията.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-sky-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>
            При основателна рекламация потребителят може да поиска привеждане
            на стоката в съответствие чрез ремонт или замяна, освен когато това
            е невъзможно или би довело до непропорционално големи разходи.
            Намаляване на цената или разваляне на договора се прилагат в
            предвидените от закона случаи. Потребителят няма право да развали
            договора, когато несъответствието е незначително.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Повреда при доставка</SectionTitle>

          <p>
            При получаване на пратка препоръчваме да използвате услугата
            „Преглед и тест“, когато е приложима за продукта и се предлага от
            куриера. При видима транспортна повреда уведомете куриера и се
            свържете с нас възможно най-скоро.
          </p>

          <p>
            Тази препоръка не ограничава законовите Ви права при дефект или
            несъответствие на продукта.
          </p>
        </section>

        <section className="space-y-5 border-t border-white/10 pt-9">
          <SectionTitle>Стандартен формуляр за упражняване право на отказ</SectionTitle>

          <p>
            Формулярът се използва само ако желаете да се откажете от договор
            от разстояние. Копирайте текста, попълнете данните и го изпратете на{" "}
            <a
              href={`mailto:${companyEmail}`}
              className="font-bold text-sky-300 transition hover:text-sky-200"
            >
              {companyEmail}
            </a>
            .
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-slate-300 md:p-7">
            <p>
              До: {companyName}
              <br />
              Адрес: {returnAddress}
              <br />
              Имейл: {companyEmail}
            </p>

            <p className="mt-6">
              С настоящото Ви уведомявам, че се отказвам от сключения от мен
              договор от разстояние за следната стока/стоки:
            </p>

            <div className="mt-5 space-y-3 text-slate-400">
              <p>Стока/стоки: ...................................................................</p>
              <p>Дата на поръчката: ...........................................................</p>
              <p>Дата на получаване: .........................................................</p>
              <p>Име на потребителя: .........................................................</p>
              <p>Адрес на потребителя: .......................................................</p>
              <p>Телефон / имейл за контакт: .................................................</p>
              <p>Дата: ........................................................................</p>
              <p>Подпис, само ако формулярът е на хартия: ....................................</p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 pt-9">
          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-400/[0.07] p-6">
            <SectionTitle>Контакт за отказ или рекламация</SectionTitle>

            <p className="mt-5">
              При въпроси относно връщане на продукт, рекламация или право на
              отказ можете да се свържете с нас:
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