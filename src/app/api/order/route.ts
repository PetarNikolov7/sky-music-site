import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type OrderPayload = {
  product?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  deliveryMethod?: unknown;
  courierProvider?: unknown;
  city?: unknown;
  address?: unknown;
  courierOfficeId?: unknown;
  courierOfficeName?: unknown;
  courierOfficeAddress?: unknown;
  note?: unknown;
  website?: unknown;
};

type FulfillmentMethod =
  | "pickup_store"
  | "courier_office"
  | "courier_locker"
  | "courier_address"
  | "to_confirm";

type CourierProvider = "econt" | "speedy" | null;

type ProductLookup = {
  id: string;
  sku: string | null;
  price_amount: number | string | null;
  currency: string | null;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textValue(value: string) {
  return value || "Не е посочено";
}

function htmlValue(value: string) {
  return escapeHtml(value || "Не е посочено");
}

function isValidEmail(value: string) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mapFulfillmentMethod(deliveryMethod: string): FulfillmentMethod {
  if (deliveryMethod === "Вземане от магазина") {
    return "pickup_store";
  }

  if (deliveryMethod === "Доставка до офис на куриер") {
    return "courier_office";
  }

  if (deliveryMethod === "Доставка до адрес") {
    return "courier_address";
  }

  return "to_confirm";
}

function mapCourierProvider(courierProvider: string): CourierProvider {
  if (courierProvider === "Еконт") {
    return "econt";
  }

  if (courierProvider === "Спиди") {
    return "speedy";
  }

  return null;
}

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service role key is not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function findProductByName(productName: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, sku, price_amount, currency")
    .eq("name", productName)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Order product lookup error:", error);
    return null;
  }

  return data as ProductLookup | null;
}

async function createOrderRecord({
  product,
  name,
  phone,
  email,
  deliveryMethod,
  courierProvider,
  city,
  address,
  courierOfficeId,
  courierOfficeName,
  courierOfficeAddress,
  note,
}: {
  product: string;
  name: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  courierProvider: string;
  city: string;
  address: string;
  courierOfficeId: string;
  courierOfficeName: string;
  courierOfficeAddress: string;
  note: string;
}) {
  const supabase = createServiceRoleClient();
  const fulfillmentMethod = mapFulfillmentMethod(deliveryMethod);
  const mappedCourier = mapCourierProvider(courierProvider);
  const productRecord = await findProductByName(product);

  const isCourierOffice = fulfillmentMethod === "courier_office";
  const isCourierAddress = fulfillmentMethod === "courier_address";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      source: "website",
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      fulfillment_method: fulfillmentMethod,
      courier:
        isCourierOffice || isCourierAddress ? mappedCourier : null,
      delivery_city:
        isCourierOffice || isCourierAddress ? city || null : null,
      delivery_address: isCourierAddress ? address || null : null,
      courier_office_id: isCourierOffice ? courierOfficeId || null : null,
      courier_office_name: isCourierOffice
        ? courierOfficeName || address || null
        : null,
      courier_office_address: isCourierOffice
        ? courierOfficeAddress || null
        : null,
      payment_method: "to_confirm",
      customer_note: note || null,
      terms_version: "terms-2026-05-28",
      privacy_version: "privacy-2026-05-28",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("Supabase order insert error:", orderError);
    throw new Error("Поръчката не можа да бъде записана.");
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productRecord?.id ?? null,
    product_name: product,
    product_sku: productRecord?.sku ?? null,
    quantity: 1,
    unit_price_amount: productRecord?.price_amount ?? null,
    currency: productRecord?.currency ?? "EUR",
  });

  if (itemError) {
    console.error("Supabase order item insert error:", itemError);
    throw new Error("Редът с продукта към поръчката не можа да бъде записан.");
  }

  return {
    id: order.id as string,
    orderNumber: order.order_number as number,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderPayload;

    const website = cleanText(body.website, 200);

    /*
      Скритото поле website е basic spam trap.
      Ако бот го попълни, връщаме успешен отговор без запис и без имейл.
    */
    if (website) {
      return NextResponse.json({ success: true });
    }

    const product = cleanText(body.product, 250);
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 60);
    const email = cleanText(body.email, 150);
    const deliveryMethod = cleanText(body.deliveryMethod, 120);
    const courierProvider = cleanText(body.courierProvider, 40);
    const city = cleanText(body.city, 120);
    const address = cleanText(body.address, 250);
    const courierOfficeId = cleanText(body.courierOfficeId, 120);
    const courierOfficeName = cleanText(body.courierOfficeName, 250);
    const courierOfficeAddress = cleanText(body.courierOfficeAddress, 250);
    const note = cleanText(body.note, 1200);

    if (!product || !name || !phone || !deliveryMethod) {
      return NextResponse.json(
        {
          error:
            "Моля, попълнете продукт, име, телефон и начин на получаване.",
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Моля, въведете валиден имейл адрес." },
        { status: 400 },
      );
    }

    if (
      deliveryMethod === "Доставка до офис на куриер" &&
      (!courierProvider || !city || !courierOfficeId || !courierOfficeName)
    ) {
      return NextResponse.json(
        { error: "Моля, изберете куриер, град и офис от списъка." },
        { status: 400 },
      );
    }

    if (
      deliveryMethod === "Доставка до адрес" &&
      (!courierProvider || !city || !address)
    ) {
      return NextResponse.json(
        { error: "Моля, изберете куриер и попълнете град и адрес." },
        { status: 400 },
      );
    }

    const orderRecord = await createOrderRecord({
      product,
      name,
      phone,
      email,
      deliveryMethod,
      courierProvider,
      city,
      address,
      courierOfficeId,
      courierOfficeName,
      courierOfficeAddress,
      note,
    });

    const submittedAt = new Intl.DateTimeFormat("bg-BG", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Sofia",
    }).format(new Date());

    const subject = `Нова поръчка #${orderRecord.orderNumber} от сайта: ${product}`;

    const textContent = [
      `НОВА ПОРЪЧКА #${orderRecord.orderNumber} — SKY MUSIC BG`,
      "",
      `Продукт: ${product}`,
      "",
      "КЛИЕНТ",
      `Име: ${name}`,
      `Телефон: ${phone}`,
      `Имейл: ${textValue(email)}`,
      "",
      "ПОЛУЧАВАНЕ",
      `Начин: ${deliveryMethod}`,
      `Куриер: ${textValue(courierProvider)}`,
      `Град: ${textValue(city)}`,
      `Адрес за доставка: ${textValue(address)}`,
      `Офис: ${textValue(courierOfficeName)}`,
      `Адрес на офис: ${textValue(courierOfficeAddress)}`,
      "",
      "БЕЛЕЖКА",
      textValue(note),
      "",
      `Получена на: ${submittedAt}`,
    ].join("\n");

    const htmlContent = `
      <div style="margin:0;padding:32px;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
          <div style="padding:28px 32px;background:#071225;color:#ffffff;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.22em;color:#7dd3fc;">
              SKY MUSIC BG
            </p>
            <h1 style="margin:0;font-size:26px;line-height:1.3;">Нова поръчка #${htmlValue(String(orderRecord.orderNumber))} от сайта</h1>
          </div>

          <div style="padding:30px 32px;">
            <div style="margin-bottom:26px;padding:18px;background:#eff6ff;border-radius:14px;border:1px solid #dbeafe;">
              <p style="margin:0 0 7px;font-size:11px;font-weight:700;letter-spacing:0.16em;color:#64748b;">ПРОДУКТ</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;">${htmlValue(product)}</p>
            </div>

            <h2 style="margin:0 0 14px;font-size:17px;">Клиент</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">
              <tr><td style="padding:8px 0;color:#64748b;width:165px;">Име</td><td style="padding:8px 0;font-weight:700;">${htmlValue(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Телефон</td><td style="padding:8px 0;font-weight:700;">${htmlValue(phone)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Имейл</td><td style="padding:8px 0;font-weight:700;">${htmlValue(email)}</td></tr>
            </table>

            <h2 style="margin:0 0 14px;font-size:17px;">Получаване</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">
              <tr><td style="padding:8px 0;color:#64748b;width:165px;">Начин</td><td style="padding:8px 0;font-weight:700;">${htmlValue(deliveryMethod)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Куриер</td><td style="padding:8px 0;font-weight:700;">${htmlValue(courierProvider)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Град</td><td style="padding:8px 0;font-weight:700;">${htmlValue(city)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Адрес</td><td style="padding:8px 0;font-weight:700;">${htmlValue(address)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Офис</td><td style="padding:8px 0;font-weight:700;">${htmlValue(courierOfficeName)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Адрес на офис</td><td style="padding:8px 0;font-weight:700;">${htmlValue(courierOfficeAddress)}</td></tr>
            </table>

            <h2 style="margin:0 0 12px;font-size:17px;">Бележка</h2>
            <div style="padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${htmlValue(note)}</div>

            <p style="margin:28px 0 0;font-size:12px;color:#64748b;">
              Получена на: ${htmlValue(submittedAt)}
            </p>
          </div>
        </div>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    let emailId: string | undefined;

    if (apiKey) {
      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from:
          process.env.ORDER_SENDER_EMAIL ??
          "SKY MUSIC BG <onboarding@resend.dev>",
        to: [process.env.ORDER_RECEIVER_EMAIL ?? "skymusicstorebg@gmail.com"],
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error("Resend order email error:", error);
      } else {
        emailSent = true;
        emailId = data?.id;
      }
    } else {
      console.error("RESEND_API_KEY is not configured. Order saved without email.");
    }

    return NextResponse.json({
      success: true,
      id: emailId,
      orderId: orderRecord.id,
      orderNumber: orderRecord.orderNumber,
      emailSent,
    });
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Възникна грешка при изпращане на поръчката." },
      { status: 500 },
    );
  }
}
