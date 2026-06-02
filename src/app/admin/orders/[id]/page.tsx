import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";
import { deleteOrder, updateOrderStatusAndNote } from "../actions";

export const metadata: Metadata = {
  title: "Admin детайл на поръчка",
  robots: {
    index: false,
    follow: false,
  },
};

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    updated?: string;
    error?: string;
  }>;
};

type OrderRow = {
  id: string;
  order_number: number;
  status: string;
  source: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_method: string;
  courier: string | null;
  delivery_city: string | null;
  delivery_address: string | null;
  courier_office_id: string | null;
  courier_office_name: string | null;
  courier_office_address: string | null;
  payment_method: string;
  delivery_price_amount: number | string | null;
  currency: string;
  customer_note: string | null;
  admin_note: string | null;
  terms_version: string | null;
  privacy_version: string | null;
  submitted_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price_amount: number | string | null;
  currency: string;
};

type StatusEventRow = {
  id: string;
  previous_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
};

const statusOptions = [
  { value: "new", label: "Нова" },
  { value: "contacted", label: "Свързахме се" },
  { value: "confirmed", label: "Потвърдена" },
  { value: "preparing", label: "Подготвя се" },
  { value: "shipped", label: "Изпратена" },
  { value: "completed", label: "Завършена" },
  { value: "cancelled", label: "Отказана" },
];

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Sofia",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    new: "Нова",
    contacted: "Свързахме се",
    confirmed: "Потвърдена",
    preparing: "Подготвя се",
    shipped: "Изпратена",
    completed: "Завършена",
    cancelled: "Отказана",
  };

  return labels[status] ?? status;
}

function getStatusClass(status: string) {
  if (status === "new") {
    return "bg-sky-400/10 text-sky-100 ring-1 ring-sky-400/20";
  }

  if (["contacted", "confirmed", "preparing", "shipped"].includes(status)) {
    return "bg-amber-400/10 text-amber-100 ring-1 ring-amber-400/20";
  }

  if (status === "completed") {
    return "bg-emerald-400/10 text-emerald-100 ring-1 ring-emerald-400/20";
  }

  if (status === "cancelled") {
    return "bg-red-400/10 text-red-100 ring-1 ring-red-400/20";
  }

  return "bg-white/[0.06] text-slate-300 ring-1 ring-white/10";
}

function getFulfillmentLabel(value: string) {
  const labels: Record<string, string> = {
    pickup_store: "Вземане от магазина",
    courier_office: "Куриерски офис",
    courier_locker: "Автомат",
    courier_address: "Доставка до адрес",
    to_confirm: "За уточняване",
  };

  return labels[value] ?? value;
}

function getPaymentLabel(value: string) {
  const labels: Record<string, string> = {
    cash_on_delivery: "Наложен платеж",
    pay_in_store: "Плащане в магазина",
    to_confirm: "За уточняване",
  };

  return labels[value] ?? value;
}

function formatPrice(value: number | string | null, currency: string) {
  if (value === null || value === undefined) {
    return "—";
  }

  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;

  if (!Number.isFinite(numeric)) {
    return `${value} ${currency}`;
  }

  return (
    new Intl.NumberFormat("bg-BG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric) + ` ${currency}`
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold leading-6 text-white">
        {value || "—"}
      </p>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { id } = await params;
  const messages = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (orderError || !orderData) {
    notFound();
  }

  const order = orderData as OrderRow;

  const [{ data: itemsData }, { data: eventsData }] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, product_name, product_sku, quantity, unit_price_amount, currency")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("order_status_events")
      .select("id, previous_status, new_status, note, created_at")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
  ]);

  const items = (itemsData ?? []) as OrderItemRow[];
  const events = (eventsData ?? []) as StatusEventRow[];

  return (
    <AdminShell
      activePage="orders"
      title={`Поръчка #${order.order_number}`}
      description="Детайл на заявка, изпратена през сайта."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Admin Orders v0.8b
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-black leading-tight md:text-5xl">
                #{order.order_number}
              </h2>

              <span
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${getStatusClass(
                  order.status,
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <p className="mt-4 text-slate-300">
              Получена на {formatDate(order.submitted_at)}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/orders"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
            >
              ← Всички поръчки
            </Link>

            <a
              href={`tel:${order.customer_phone}`}
              className="rounded-full bg-sky-400 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-sky-300"
            >
              Обадете се
            </a>
          </div>
        </div>
      </div>

      {messages.updated && (
        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5 text-sm font-bold text-emerald-200">
          Поръчката беше обновена успешно.
        </div>
      )}

      {messages.error && (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
          {messages.error}
        </div>
      )}

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/[0.06] p-6 md:p-8">
          <h3 className="text-2xl font-black">Управление</h3>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            За нормална работа сменяйте статусите. Изтриването е само за
            тестови, грешни или спам заявки.
          </p>

          <form action={updateOrderStatusAndNote} className="mt-6 grid gap-5">
            <input type="hidden" name="order_id" value={order.id} />

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Статус
              </label>

              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="w-full cursor-pointer rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-sky-400"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-note"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Admin бележка
              </label>

              <textarea
                id="admin-note"
                name="admin_note"
                defaultValue={order.admin_note ?? ""}
                rows={5}
                placeholder="Вътрешна бележка само за администратора..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
              />
            </div>

            <div>
              <label
                htmlFor="status-note"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Бележка към смяната на статус
              </label>

              <input
                id="status-note"
                name="status_note"
                placeholder="Напр. Клиентът потвърди по телефона."
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Тази бележка се записва в историята само ако статусът се смени.
              </p>
            </div>

            <button
              type="submit"
              className="cursor-pointer rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 font-black text-white shadow-xl shadow-blue-950/30 transition hover:brightness-110"
            >
              Запази промяната
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h3 className="text-2xl font-black">Бърз преглед</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Клиент" value={order.customer_name} />
            <InfoCard label="Телефон" value={order.customer_phone} />
            <InfoCard label="Имейл" value={order.customer_email} />
            <InfoCard
              label="Получаване"
              value={getFulfillmentLabel(order.fulfillment_method)}
            />
            <InfoCard label="Град" value={order.delivery_city} />
            <InfoCard label="Адрес / офис" value={order.delivery_address} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h3 className="text-2xl font-black">Клиент и доставка</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Име" value={order.customer_name} />
            <InfoCard label="Телефон" value={order.customer_phone} />
            <InfoCard label="Имейл" value={order.customer_email} />
            <InfoCard label="Източник" value={order.source} />
            <InfoCard
              label="Метод"
              value={getFulfillmentLabel(order.fulfillment_method)}
            />
            <InfoCard label="Куриер" value={order.courier} />
            <InfoCard label="Град" value={order.delivery_city} />
            <InfoCard label="Адрес" value={order.delivery_address} />
            <InfoCard label="Офис" value={order.courier_office_name} />
            <InfoCard label="Адрес на офис" value={order.courier_office_address} />
            <InfoCard
              label="Плащане"
              value={getPaymentLabel(order.payment_method)}
            />
            <InfoCard
              label="Цена доставка"
              value={formatPrice(order.delivery_price_amount, order.currency)}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <h3 className="text-2xl font-black">Продукти</h3>

            <div className="mt-5 grid gap-4">
              {items.length === 0 ? (
                <p className="text-slate-400">Няма записани продукти.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="font-black text-white">{item.product_name}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Количество: {item.quantity} · SKU: {item.product_sku || "—"}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-200">
                      Цена: {formatPrice(item.unit_price_amount, item.currency)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <h3 className="text-2xl font-black">Бележки</h3>

            <div className="mt-5 grid gap-4">
              <InfoCard label="Бележка от клиента" value={order.customer_note} />
              <InfoCard label="Admin бележка" value={order.admin_note} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <h3 className="text-2xl font-black">История на статусите</h3>

        {events.length === 0 ? (
          <p className="mt-5 text-slate-400">Няма записана история.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-black text-white">
                  {event.previous_status
                    ? `${getStatusLabel(event.previous_status)} → ${getStatusLabel(
                        event.new_status,
                      )}`
                    : getStatusLabel(event.new_status)}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {formatDate(event.created_at)}
                </p>
                {event.note && (
                  <p className="mt-2 text-sm text-slate-300">{event.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-[2rem] border border-red-400/20 bg-red-400/[0.06] p-6 md:p-8">
        <h3 className="text-2xl font-black text-red-100">Danger zone</h3>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-red-100/80">
          Използвайте изтриване само за тестови, грешни или спам заявки.
          За реална отказана поръчка използвайте статус „Отказана“, за да се
          запази историята.
        </p>

        <form action={deleteOrder} className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <input type="hidden" name="order_id" value={order.id} />
          <input
            type="hidden"
            name="order_number"
            value={String(order.order_number)}
          />

          <div>
            <label
              htmlFor="delete-confirmation"
              className="mb-2 block text-sm font-bold text-red-100"
            >
              За изтриване въведете номера на поръчката: {order.order_number}
            </label>

            <input
              id="delete-confirmation"
              name="delete_confirmation"
              placeholder={String(order.order_number)}
              className="w-full rounded-2xl border border-red-400/20 bg-black/30 px-5 py-4 text-white outline-none placeholder:text-red-100/30 focus:border-red-300"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-2xl border border-red-300/30 bg-red-500/15 px-6 py-4 font-black text-red-100 transition hover:bg-red-500/25"
            >
              Изтрий окончателно
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
