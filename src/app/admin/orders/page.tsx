import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

export const metadata: Metadata = {
  title: "Admin поръчки",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminOrdersPageProps = {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
  }>;
};

type OrderItemRow = {
  product_name: string;
  quantity: number;
};

type OrderRow = {
  id: string;
  order_number: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_method: string;
  delivery_city: string | null;
  delivery_address: string | null;
  customer_note: string | null;
  submitted_at: string;
  order_items: OrderItemRow[] | null;
};

function formatDate(value: string) {
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

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;
  const { supabase, user, adminProfile } = await requireAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        customer_name,
        customer_phone,
        customer_email,
        fulfillment_method,
        delivery_city,
        delivery_address,
        customer_note,
        submitted_at,
        order_items(product_name, quantity)
      `,
    )
    .order("submitted_at", { ascending: false });

  const orders = (data ?? []) as unknown as OrderRow[];
  const newOrders = orders.filter((order) => order.status === "new").length;
  const activeOrders = orders.filter((order) =>
    ["new", "contacted", "confirmed", "preparing", "shipped"].includes(
      order.status,
    ),
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;

  return (
    <AdminShell
      activePage="orders"
      title="Поръчки"
      description="Заявки, изпратени през формата за поръчка и доставка."
      userEmail={user.email}
      displayName={adminProfile.displayName}
    >
      <div className="rounded-[2rem] border border-sky-400/15 bg-gradient-to-br from-slate-900 via-blue-950/40 to-black p-7 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Admin Orders v0.8b
        </p>

        <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
          Управление на поръчки
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          Следете новите заявки, сменяйте статусите и пазете вътрешни бележки
          към всяка поръчка.
        </p>
      </div>

      {params.deleted && (
        <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/[0.08] p-5 text-sm font-bold text-sky-100">
          Поръчка #{params.deleted} беше изтрита окончателно.
        </div>
      )}

      {params.error && (
        <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
          Възникна грешка при действие с поръчка.
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Нови",
            value: newOrders,
            description: "изчакват първи контакт",
          },
          {
            label: "Активни",
            value: activeOrders,
            description: "в процес на обработка",
          },
          {
            label: "Завършени",
            value: completedOrders,
            description: "приключени поръчки",
          },
          {
            label: "Отказани",
            value: cancelledOrders,
            description: "архивирани като отказани",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-4 text-3xl font-black">{item.value}</p>

            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </section>

      {error && (
        <div className="mt-8 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-5 text-sm font-bold text-red-200">
          Възникна грешка при зареждане на поръчките: {error.message}
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center md:p-14">
          <h3 className="text-2xl font-black">Все още няма поръчки.</h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Когато клиент изпрати заявка през /request, тя ще се появи тук.
          </p>
        </div>
      )}

      {!error && orders.length > 0 && (
        <section className="mt-8 grid gap-5">
          {orders.map((order) => {
            const firstItem = order.order_items?.[0];

            return (
              <article
                key={order.id}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-sky-400/30 hover:bg-white/[0.06] md:p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black">
                        #{order.order_number}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      Получена: {formatDate(order.submitted_at)}
                    </p>

                    <p className="mt-4 text-lg font-black text-white">
                      {firstItem?.product_name ?? "Без продукт"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Клиент: {order.customer_name} · {order.customer_phone}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Получаване: {getFulfillmentLabel(order.fulfillment_method)}
                      {order.delivery_city ? ` · ${order.delivery_city}` : ""}
                    </p>

                    {order.customer_note && (
                      <p className="mt-4 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-400">
                        {order.customer_note}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-full bg-sky-400 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-sky-300"
                    >
                      Отвори
                    </Link>

                    <a
                      href={`tel:${order.customer_phone}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
                    >
                      Обади се
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AdminShell>
  );
}
