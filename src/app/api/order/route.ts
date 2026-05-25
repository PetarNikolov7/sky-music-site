import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type OrderPayload = {
  product?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  deliveryMethod?: unknown;
  city?: unknown;
  address?: unknown;
  note?: unknown;
  website?: unknown;
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

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Email услугата не е конфигурирана." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as OrderPayload;

    const website = cleanText(body.website, 200);

    /*
      Скритото поле website ще бъде добавено във формата като basic spam trap.
      Ако бот го попълни, връщаме успешен отговор без да изпращаме имейл.
    */
    if (website) {
      return NextResponse.json({ success: true });
    }

    const product = cleanText(body.product, 250);
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 60);
    const email = cleanText(body.email, 150);
    const deliveryMethod = cleanText(body.deliveryMethod, 120);
    const city = cleanText(body.city, 120);
    const address = cleanText(body.address, 250);
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

    const submittedAt = new Intl.DateTimeFormat("bg-BG", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Sofia",
    }).format(new Date());

    const subject = `Нова поръчка от сайта: ${product}`;

    const textContent = [
      "НОВА ПОРЪЧКА — SKY MUSIC BG",
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
      `Град: ${textValue(city)}`,
      `Адрес / офис за доставка: ${textValue(address)}`,
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
            <h1 style="margin:0;font-size:26px;line-height:1.3;">Нова поръчка от сайта</h1>
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
              <tr><td style="padding:8px 0;color:#64748b;">Град</td><td style="padding:8px 0;font-weight:700;">${htmlValue(city)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Адрес / офис</td><td style="padding:8px 0;font-weight:700;">${htmlValue(address)}</td></tr>
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

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from:
        process.env.ORDER_SENDER_EMAIL ??
        "SKY MUSIC BG <onboarding@resend.dev>",
      to: [
        process.env.ORDER_RECEIVER_EMAIL ?? "skymusicstorebg@gmail.com",
      ],
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("Resend order email error:", error);

      return NextResponse.json(
        { error: "Поръчката не можа да бъде изпратена. Моля, опитайте отново." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Възникна грешка при изпращане на поръчката." },
      { status: 500 },
    );
  }
}