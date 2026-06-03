"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

const phone = "+359884211761";
const email = "skymusicstorebg@gmail.com";

type DeliveryMethod =
  | "Доставка до офис на куриер"
  | "Доставка до адрес"
  | "Вземане от магазина"
  | "Ще уточним допълнително";

type CourierProvider = "" | "Еконт" | "Спиди";

type SubmitStatus = "idle" | "sending" | "success" | "error";

const deliveryMethods: DeliveryMethod[] = [
  "Доставка до офис на куриер",
  "Доставка до адрес",
  "Вземане от магазина",
  "Ще уточним допълнително",
];

const courierProviders: CourierProvider[] = ["", "Еконт", "Спиди"];

function RequestPageContent() {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") ?? "";

  const [product, setProduct] = useState(productFromUrl);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    "Доставка до офис на куриер",
  );
  const [courierProvider, setCourierProvider] = useState<CourierProvider>("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [courierOfficeName, setCourierOfficeName] = useState("");
  const [courierOfficeAddress, setCourierOfficeAddress] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const isSending = submitStatus === "sending";
  const isSuccess = submitStatus === "success";

  useEffect(() => {
    setProduct(productFromUrl);
    setSubmitStatus("idle");
    setSubmitError("");
    setOrderNumber(null);
  }, [productFromUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitError("");

    if (
      deliveryMethod === "Доставка до офис на куриер" &&
      (!courierProvider || !city.trim() || !courierOfficeName.trim())
    ) {
      setSubmitStatus("error");
      setSubmitError(
        "Моля, изберете куриер и попълнете град и офис за доставката.",
      );
      return;
    }

    if (
      deliveryMethod === "Доставка до адрес" &&
      (!courierProvider || !city.trim() || !address.trim())
    ) {
      setSubmitStatus("error");
      setSubmitError(
        "Моля, изберете куриер и попълнете град и адрес за доставката.",
      );
      return;
    }

    setSubmitStatus("sending");

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          name,
          phone: customerPhone,
          email: customerEmail,
          deliveryMethod,
          courierProvider,
          city,
          address,
          courierOfficeName,
          courierOfficeAddress,
          note,
          website,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; orderNumber?: number | string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ??
            "Заявката не можа да бъде изпратена. Моля, опитайте отново.",
        );
      }

      const receivedOrderNumber = Number(result.orderNumber);

      setOrderNumber(
        Number.isFinite(receivedOrderNumber) ? receivedOrderNumber : null,
      );
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Възникна грешка при изпращане на заявката.",
      );
    }
  }

  function startNewOrder() {
    setName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setDeliveryMethod("Доставка до офис на куриер");
    setCourierProvider("");
    setCity("");
    setAddress("");
    setCourierOfficeName("");
    setCourierOfficeAddress("");
    setNote("");
    setWebsite("");
    setOrderNumber(null);
    setSubmitStatus("idle");
    setSubmitError("");
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
                След изпращане ще получим заявката Ви директно и ще се
                свържем с Вас за потвърждение и уточняване на доставката или
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
                    За въпроси преди поръчка можете да се свържете с нас по
                    телефон или имейл. Заявката се изпраща директно през тази
                    страница, без да напускате сайта.
                  </p>
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
              {isSuccess ? (
                <div className="py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl text-emerald-300 ring-1 ring-emerald-400/25">
                    ✓
                  </div>

                  <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                    Заявката е получена
                  </p>

                  <h2 className="mt-4 text-4xl font-black leading-tight">
                    Благодарим Ви, че избрахте SKY MUSIC BG!
                  </h2>

                  <p className="mt-5 text-lg leading-8 text-slate-300">
                    Заявката Ви за поръчка е получена успешно. Ще се свържем с
                    Вас за потвърждение и уточняване на доставката.
                  </p>

                  {orderNumber && (
                    <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                        Номер на заявка
                      </p>

                      <p className="mt-3 text-3xl font-black text-white">
                        #{orderNumber}
                      </p>
                    </div>
                  )}

                  {product && (
                    <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-5">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                        Заявен продукт
                      </p>

                      <p className="mt-3 text-lg font-black text-white">
                        {product}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="/products"
                      className="cursor-pointer rounded-full bg-white px-7 py-4 text-center text-sm font-black text-black transition hover:bg-slate-200"
                    >
                      Разгледайте продуктите
                    </a>

                    <button
                      type="button"
                      onClick={startNewOrder}
                      className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-white/10"
                    >
                      Нова заявка
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                    Форма за заявка
                  </p>

                  <h2 className="mt-4 text-4xl font-black">
                    Данни за заявка
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    Попълнете необходимите данни за връзка и доставка.
                    Заявката ще бъде изпратена директно до SKY MUSIC BG.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website</label>

                      <input
                        id="website"
                        name="website"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

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
                        disabled={isSending}
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
                          autoComplete="name"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                          required
                          disabled={isSending}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="customer-phone"
                          className="mb-2 block text-sm font-bold text-slate-300"
                        >
                          Телефон
                        </label>

                        <input
                          id="customer-phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(event) =>
                            setCustomerPhone(event.target.value)
                          }
                          placeholder="Телефон за връзка"
                          autoComplete="tel"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                          required
                          disabled={isSending}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="customer-email"
                        className="mb-2 block text-sm font-bold text-slate-300"
                      >
                        Имейл
                      </label>

                      <input
                        id="customer-email"
                        type="email"
                        value={customerEmail}
                        onChange={(event) =>
                          setCustomerEmail(event.target.value)
                        }
                        placeholder="Имейл за връзка"
                        autoComplete="email"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                        disabled={isSending}
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
                          setDeliveryMethod(
                            event.target.value as DeliveryMethod,
                          )
                        }
                        className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-sky-400"
                        disabled={isSending}
                      >
                        {deliveryMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(deliveryMethod === "Доставка до офис на куриер" ||
                      deliveryMethod === "Доставка до адрес") && (
                      <div>
                        <label
                          htmlFor="courier-provider"
                          className="mb-2 block text-sm font-bold text-slate-300"
                        >
                          Куриер <span className="ml-1 text-sky-300">*</span>
                        </label>

                        <select
                          id="courier-provider"
                          value={courierProvider}
                          onChange={(event) =>
                            setCourierProvider(
                              event.target.value as CourierProvider,
                            )
                          }
                          className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-sky-400"
                          required={
                            deliveryMethod === "Доставка до офис на куриер" ||
                            deliveryMethod === "Доставка до адрес"
                          }
                          disabled={isSending}
                        >
                          {courierProviders.map((provider) => (
                            <option key={provider || "empty"} value={provider}>
                              {provider || "Изберете куриер"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {deliveryMethod === "Доставка до офис на куриер" && (
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="city"
                            className="mb-2 block text-sm font-bold text-slate-300"
                          >
                            Град <span className="ml-1 text-sky-300">*</span>
                          </label>

                          <input
                            id="city"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Град"
                            autoComplete="address-level2"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                            required
                            disabled={isSending}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="courier-office-name"
                            className="mb-2 block text-sm font-bold text-slate-300"
                          >
                            Офис на куриер{" "}
                            <span className="ml-1 text-sky-300">*</span>
                          </label>

                          <input
                            id="courier-office-name"
                            value={courierOfficeName}
                            onChange={(event) =>
                              setCourierOfficeName(event.target.value)
                            }
                            placeholder="Напр. Еконт Бургас Георги Баев"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                            required
                            disabled={isSending}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="courier-office-address"
                            className="mb-2 block text-sm font-bold text-slate-300"
                          >
                            Адрес на офис, ако го знаете
                          </label>

                          <input
                            id="courier-office-address"
                            value={courierOfficeAddress}
                            onChange={(event) =>
                              setCourierOfficeAddress(event.target.value)
                            }
                            placeholder="Адрес на офиса / уточнение"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                            disabled={isSending}
                          />
                        </div>
                      </div>
                    )}

                    {deliveryMethod === "Доставка до адрес" && (
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="city"
                            className="mb-2 block text-sm font-bold text-slate-300"
                          >
                            Град <span className="ml-1 text-sky-300">*</span>
                          </label>

                          <input
                            id="city"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Град"
                            autoComplete="address-level2"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                            required
                            disabled={isSending}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-bold text-slate-300"
                          >
                            Адрес <span className="ml-1 text-sky-300">*</span>
                          </label>

                          <input
                            id="address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Адрес за доставка"
                            autoComplete="street-address"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                            required
                            disabled={isSending}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="note"
                        className="mb-2 block text-sm font-bold text-slate-300"
                      >
                        Бележка към заявката
                      </label>

                      <textarea
                        id="note"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Допълнителна информация, въпрос или предпочитан начин за връзка"
                        rows={5}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                        disabled={isSending}
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div
                        role="alert"
                        className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-100"
                      >
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSending}
                      className="cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-4 text-center font-black text-white shadow-xl shadow-blue-950/40 transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {isSending
                        ? "Изпращане на заявката..."
                        : "Изпратете заявката"}
                    </button>

                    <p className="px-2 text-xs leading-6 text-slate-500">
                      С изпращането на заявката потвърждавате, че сте
                      запознати с{" "}
                      <a
                        href="/terms"
                        className="font-bold text-sky-300 transition hover:text-sky-200"
                      >
                        Общите условия
                      </a>
                      ,{" "}
                      <a
                        href="/privacy"
                        className="font-bold text-sky-300 transition hover:text-sky-200"
                      >
                        Политиката за поверителност
                      </a>{" "}
                      и условията за{" "}
                      <a
                        href="/delivery-payment"
                        className="font-bold text-sky-300 transition hover:text-sky-200"
                      >
                        доставка и плащане
                      </a>
                      .
                    </p>
                  </form>
                </>
              )}
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
                    title: "Получаваме заявката",
                    description:
                      "Заявката се изпраща директно до SKY MUSIC BG, без да напускате сайта.",
                  },
                  {
                    step: "03",
                    title: "Свързваме се с Вас",
                    description:
                      "Свързваме се с Вас за потвърждение и уточняваме доставката или вземането от магазина.",
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