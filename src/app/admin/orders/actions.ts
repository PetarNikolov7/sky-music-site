"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

const allowedStatuses = new Set([
  "new",
  "contacted",
  "confirmed",
  "preparing",
  "shipped",
  "completed",
  "cancelled",
]);

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(orderId: string, message: string): never {
  redirect(`/admin/orders/${orderId}?error=${encodeURIComponent(message)}`);
}

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role environment variables.");
  }

  return createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function updateOrderStatusAndNote(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const orderId = getText(formData, "order_id");
  const status = getText(formData, "status");
  const adminNote = getText(formData, "admin_note");
  const statusNote = getText(formData, "status_note");

  if (!orderId) {
    redirect("/admin/orders?error=missing-order");
  }

  if (!allowedStatuses.has(status)) {
    redirectWithError(orderId, "Невалиден статус на поръчката.");
  }

  const { data: currentOrder, error: currentOrderError } = await supabase
    .from("orders")
    .select("id, status, confirmed_at, shipped_at, completed_at")
    .eq("id", orderId)
    .maybeSingle();

  if (currentOrderError || !currentOrder) {
    redirect("/admin/orders?error=order-not-found");
  }

  const now = new Date().toISOString();
  const statusChanged = currentOrder.status !== status;

  const updatePayload: Record<string, string | null> = {
    status,
    admin_note: adminNote || null,
    updated_by: user.id,
  };

  if (
    ["confirmed", "preparing", "shipped", "completed"].includes(status) &&
    !currentOrder.confirmed_at
  ) {
    updatePayload.confirmed_at = now;
  }

  if (["shipped", "completed"].includes(status) && !currentOrder.shipped_at) {
    updatePayload.shipped_at = now;
  }

  if (status === "completed" && !currentOrder.completed_at) {
    updatePayload.completed_at = now;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", orderId);

  if (updateError) {
    redirectWithError(orderId, "Поръчката не можа да бъде обновена.");
  }

  if (statusChanged && statusNote) {
    const serviceClient = createServiceRoleClient();

    const { data: latestEvent } = await serviceClient
      .from("order_status_events")
      .select("id")
      .eq("order_id", orderId)
      .eq("new_status", status)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestEvent?.id) {
      await serviceClient
        .from("order_status_events")
        .update({ note: statusNote })
        .eq("id", latestEvent.id);
    }
  }

  redirect(`/admin/orders/${orderId}?updated=1`);
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();

  const orderId = getText(formData, "order_id");
  const orderNumber = getText(formData, "order_number");
  const confirmation = getText(formData, "delete_confirmation");

  if (!orderId) {
    redirect("/admin/orders?error=missing-order");
  }

  if (confirmation !== orderNumber) {
    redirectWithError(
      orderId,
      `За изтриване въведете точно номера на поръчката: ${orderNumber}.`,
    );
  }

  const serviceClient = createServiceRoleClient();

  const { error: eventsError } = await serviceClient
    .from("order_status_events")
    .delete()
    .eq("order_id", orderId);

  if (eventsError) {
    redirectWithError(orderId, "Историята на поръчката не можа да бъде изтрита.");
  }

  const { error: itemsError } = await serviceClient
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (itemsError) {
    redirectWithError(orderId, "Продуктите към поръчката не можаха да бъдат изтрити.");
  }

  const { error: orderError } = await serviceClient
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (orderError) {
    redirectWithError(orderId, "Поръчката не можа да бъде изтрита.");
  }

  redirect(`/admin/orders?deleted=${encodeURIComponent(orderNumber)}`);
}
