"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

const phone = "+359884211761";
const whatsappNumber = "359884211761";
const email = "skymusicstorebg@gmail.com";
const messengerUrl = "https://m.me/skymusicbg";

type DeliveryMethod =
  | "Доставка до адрес"
  | "Вземане от магазина"
  | "Ще уточним допълнително";

const deliveryMethods: DeliveryMethod[] = [
  "Доставка до адрес",
  "Вземане от магазина",
  "Ще уточним допълнително",
];

function buildWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function RequestPageContent() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") ?? "";

  const [product, setProduct] = useState(productFromUrl);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    "Доставка до адрес",
  );
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setProduct(productFromUrl);
  }, [productFromUrl]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Здравейте, желая да направя поръчка чрез сайта на SKY MUSIC BG.",
      "",
      `Продукт: ${product || "не е посочен"}`,
      `Име: ${name || "не е посочено"}`,
      `Телефон: ${customerPhone || "не е посочен"}`,
      `Имейл: ${customerEmail || "не е посочен"}`,
      `Начин на получаване: ${deliveryMethod}`,
      `Град: ${city || "не е посочен"}`,
      `Адрес / офис за доставка: ${address || "не е посочен"}`,
      `Бележка: ${note || "няма"}`,
      "",
      "Моля, свържете се с мен за потвърждение на поръчката и уточняване на доставката или вземането от магазина.",
    ];

    return lines.join("\n");
  }, [
    product,
    name,
    customerPhone,
    customerEmail,
    deliveryMethod,
    city,
    address,
    note,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(buildWhatsappLink(whatsappMessage), "_blank", "noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <SiteHeader activePage="request" />

        <section className="grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-8 shadow-2xl shadow-black/40 md:p-10">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                SKY MUSIC BG
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
                Поръчка и доставка
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Попълнете данните за желания продукт и начин на получаване.
                След изпращане на заявката ние ще се свържем с Вас за
                потвърждение на поръчката и уточняване на доставката или
                вземането от магазина.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Телефон
                  </p>

                  <a
                    href={`tel:${phone}`}
                    className="mt-2 block cursor-pointer text-2xl font-black text-white transition hover:text-sky-200"
                  >
                    {phone}
                  </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    Имейл
                  </p>

                  <a
                    href={`mailto:${email}`}
                    className="mt-2 block cursor-pointer break-all text-lg font-bold text-white transition hover:text-sky-200"
                  >
                    {email}
                  </a>
                </div>

                <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-5">
                  <p className="text-sm leading-7 text-slate-200">
                    Ако имате въпроси преди поръчка, можете да се свържете с
                    нас по WhatsApp, Messenger, телефон или имейл.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a
                      href={buildWhatsappLink(
                        "Здравейте, имам въпрос относно продукт от SKY MUSIC BG.",
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition hover:bg-sky-100"
                    >
                      WhatsApp
                    </a>

                    <a
                      href={messengerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer rounded-full bg-blue-600 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-blue-500"
                    >
                      Messenger
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/products"
              className="mt-5 inline-flex cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              ← Назад към категориите
            </a>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 md:p-8">
            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                Форма за заявка
              </p>

              <h2 className="mt-4 text-4xl font-black">
                Данни за поръчка
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Попълнете необходимите данни за връзка и доставка. След
                изпращане ще се отвори WhatsApp съобщение с готово съдържание,
                което можете да прегледате преди да го изпратите.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                <div>
                  <label
                    htmlFor="product"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Продукт
                  </label>

                  <input
                    id="product"
                    value={product}
                    onChange={(event) => setProduct(event.target.value)}
                    placeholder="Име на продукт"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-slate-300"
                    >
                      Име и фамилия
                    </label>

                    <input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Вашето име"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-slate-300"
                    >
                      Телефон
                    </label>

                    <input
                      id="phone"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="Телефон за връзка"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Имейл
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="Имейл за връзка"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="delivery-method"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Начин на получаване
                  </label>

                  <select
                    id="delivery-method"
                    value={deliveryMethod}
                    onChange={(event) =>
                      setDeliveryMethod(event.target.value as DeliveryMethod)
                    }
                    className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-sky-400"
                  >
                    {deliveryMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-bold text-slate-300"
                    >
                      Град
                    </label>

                    <input
                      id="city"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="Град"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-bold text-slate-300"
                    >
                      Адрес или офис за доставка
                    </label>

                    <input
                      id="address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Адрес / офис на куриер"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Бележка към поръчката
                  </label>

                  <textarea
                    id="note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Допълнителна информация, въпрос или предпочитан начин за връзка"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-4 text-center font-black text-white shadow-xl shadow-blue-950/40 transition hover:scale-[1.01]"
                >
                  Изпратете заявката в WhatsApp
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-2xl font-black">Как работи?</h3>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Попълвате формата",
                    description:
                      "Въвеждате продукт, телефон и данни за доставка или вземане от магазина.",
                  },
                  {
                    step: "02",
                    title: "Изпращате заявката",
                    description:
                      "Формата подготвя WhatsApp съобщение, което можете да прегледате преди изпращане.",
                  },
                  {
                    step: "03",
                    title: "Ние се свързваме с Вас",
                    description:
                      "Потвърждаваме поръчката и уточняваме доставката или вземането от магазина.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <p className="text-sm font-black text-sky-300">
                      {item.step}
                    </p>

                    <h4 className="mt-3 font-black">{item.title}</h4>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
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

export default function RequestPage() {
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
      <RequestPageContent />
    </Suspense>
  );
}