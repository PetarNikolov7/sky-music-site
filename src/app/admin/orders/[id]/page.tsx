import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

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
    contacted: "Контактуван",
    confirmed: "Потвърдена",
    preparing: "Подготовка",
    shipped: "Изпратена",
    completed: "Завършена",
    cancelled: "Отказана",
  };

  return labels[status] ?? status;
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
}: OrderDetailPageProps) {
  const { id } = await params;
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
              Admin Orders v0.8a
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              #{order.order_number} · {getStatusLabel(order.status)}
            </h2>

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

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h3 className="text-2xl font-black">Клиент</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Име" value={order.customer_name} />
            <InfoCard label="Телефон" value={order.customer_phone} />
            <InfoCard label="Имейл" value={order.customer_email} />
            <InfoCard label="Източник" value={order.source} />
          </div>

          <h3 className="mt-8 text-2xl font-black">Получаване</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Метод"
              value={getFulfillmentLabel(order.fulfillment_method)}
            />
            <InfoCard label="Куриер" value={order.courier} />
            <InfoCard label="Град" value={order.delivery_city} />
            <InfoCard label="Адрес" value={order.delivery_address} />
            <InfoCard label="Офис" value={order.courier_office_name} />
            <InfoCard label="Адрес на офис" value={order.courier_office_address} />
          </div>

          <h3 className="mt-8 text-2xl font-black">Плащане</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Метод"
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
    </AdminShell>
  );
}
