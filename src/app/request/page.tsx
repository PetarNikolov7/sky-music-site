"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

const phone = "+359884211761";
const whatsappNumber = "359884211761";
const email = "skymusicstorebg@gmail.com";
const messengerUrl = "https://m.me/skymusicbg";

type RequestForm = {
  product: string;
  name: string;
  phone: string;
  email: string;
  delivery: string;
  note: string;
};

function makeDeliveryWhatsappLink(form: RequestForm) {
  const message = [
    "Здравейте, искам да оставя данни за заявка / доставка.",
    "",
    `Продукт: ${form.product || "не е избран"}`,
    `Име: ${form.name || "не е попълнено"}`,
    `Телефон: ${form.phone || "не е попълнен"}`,
    `Имейл: ${form.email || "не е попълнен"}`,
    `Адрес / офис на куриер: ${form.delivery || "не е попълнен"}`,
    `Бележка: ${form.note || "няма"}`,
    "",
    "Моля, потвърдете наличност, крайна цена и начин на изпращане.",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function RequestPage() {
  const [form, setForm] = useState<RequestForm>({
    product: "",
    name: "",
    phone: "",
    email: "",
    delivery: "",
    note: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productFromUrl = params.get("product");

    if (productFromUrl) {
      setForm((current) => ({
        ...current,
        product: productFromUrl,
      }));
    }
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((product) => product.name === form.product);
  }, [form.product]);

  const canSubmit =
    form.product.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.delivery.trim().length > 0;

  function updateForm(field: keyof RequestForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    window.open(makeDeliveryWhatsappLink(form), "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-6xl px-5 py-6 md:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
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
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Каталог
            </a>
            <a
              href={`tel:${phone}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              Обади се
            </a>
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/50 to-black p-8 shadow-2xl shadow-black/30">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
                Заявка
              </p>

              <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Остави данни за доставка
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Попълни продукта, контактите и адреса/офиса на куриер. След
                изпращане ще се отвори WhatsApp съобщение към SKY MUSIC BG.
              </p>

              <div className="mt-8 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6">
                <p className="font-bold text-sky-100">Важно:</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Сайтът не записва тези данни в база. Те се използват само за
                  контакт, потвърждение на заявката и организация на доставка.
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                <a
                  href={`mailto:${email}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  ✉️ {email}
                </a>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Messenger
                </a>
              </div>
            </div>

            {selectedProduct && (
              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                  Избран продукт
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  {selectedProduct.name}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {selectedProduct.brand} · {selectedProduct.category}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <span className="text-sm text-slate-400">Цена</span>
                  <span className="text-2xl font-black">
                    {selectedProduct.price}
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="request-product"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Избран продукт *
                </label>
                <input
                  id="request-product"
                  list="product-options"
                  value={form.product}
                  onChange={(event) =>
                    updateForm("product", event.target.value)
                  }
                  placeholder="Например: Yamaha Pacifica 112V"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
                <datalist id="product-options">
                  {products.map((product) => (
                    <option key={product.id} value={product.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="request-name"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Име *
                  </label>
                  <input
                    id="request-name"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Име и фамилия"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="request-phone"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Телефон *
                  </label>
                  <input
                    id="request-phone"
                    value={form.phone}
                    onChange={(event) =>
                      updateForm("phone", event.target.value)
                    }
                    placeholder="+359..."
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="request-email"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Имейл *
                </label>
                <input
                  id="request-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>

              <div>
                <label
                  htmlFor="request-delivery"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Адрес или офис на куриер *
                </label>
                <textarea
                  id="request-delivery"
                  value={form.delivery}
                  onChange={(event) =>
                    updateForm("delivery", event.target.value)
                  }
                  placeholder="Град, адрес или офис на Еконт / Спиди"
                  rows={4}
                  required
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>

              <div>
                <label
                  htmlFor="request-note"
                  className="mb-2 block text-sm font-bold text-slate-300"
                >
                  Бележка
                </label>
                <textarea
                  id="request-note"
                  value={form.note}
                  onChange={(event) => updateForm("note", event.target.value)}
                  placeholder="Въпрос, предпочитана доставка, удобно време за контакт..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-4 text-center font-black text-white shadow-xl shadow-blue-950/50 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                Изпрати данните по WhatsApp
              </button>

              <p className="text-xs leading-5 text-slate-500">
                Полетата със * са задължителни. След натискане на бутона ще се
                отвори WhatsApp с готов текст към SKY MUSIC BG.
              </p>
            </div>
          </form>
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