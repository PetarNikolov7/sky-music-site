"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

function redirectWithError(productId: string, message: string): never {
  redirect(
    `/admin/products/${productId}/specs?error=${encodeURIComponent(message)}`,
  );
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseSortOrder(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

function splitSpecLine(line: string) {
  const separators = [":", "：", "-", "–", "—"];

  for (const separator of separators) {
    const separatorIndex = line.indexOf(separator);

    if (separatorIndex > 0) {
      const label = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + separator.length).trim();

      if (label && value) {
        return { label, value };
      }
    }
  }

  return null;
}

function parseBulkSpecs(rawText: string) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitSpecLine)
    .filter((spec): spec is { label: string; value: string } => Boolean(spec));
}

async function ensureProductExists({
  productId,
  supabase,
}: {
  productId: string;
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
}) {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) {
    redirect("/admin/products?error=product-not-found");
  }
}

export async function replaceProductSpecsFromText(formData: FormData) {
  const { supabase } = await requireAdmin();

  const productId = getText(formData, "product_id");
  const rawSpecs = getText(formData, "bulk_specs");

  if (!productId) {
    redirect("/admin/products?error=missing-product");
  }

  await ensureProductExists({ productId, supabase });

  const specs = parseBulkSpecs(rawSpecs);

  if (specs.length === 0) {
    redirectWithError(
      productId,
      "Не бяха открити валидни характеристики. Използвайте формат: Име: Стойност.",
    );
  }

  const { error: deleteError } = await supabase
    .from("product_specs")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    redirectWithError(
      productId,
      "Старите характеристики не можаха да бъдат изчистени.",
    );
  }

  const rows = specs.map((spec, index) => ({
    product_id: productId,
    label: spec.label,
    value: spec.value,
    sort_order: (index + 1) * 10,
  }));

  const { error: insertError } = await supabase
    .from("product_specs")
    .insert(rows);

  if (insertError) {
    redirectWithError(
      productId,
      "Новите характеристики не можаха да бъдат записани.",
    );
  }

  redirect(`/admin/products/${productId}/specs?bulkUpdated=${specs.length}`);
}

export async function createProductSpec(formData: FormData) {
  const { supabase } = await requireAdmin();

  const productId = getText(formData, "product_id");
  const label = getText(formData, "label");
  const value = getText(formData, "value");
  const sortOrder = parseSortOrder(getText(formData, "sort_order"), 100);

  if (!productId) {
    redirect("/admin/products?error=missing-product");
  }

  if (label.length < 1) {
    redirectWithError(productId, "Моля, въведете име на характеристиката.");
  }

  if (value.length < 1) {
    redirectWithError(productId, "Моля, въведете стойност на характеристиката.");
  }

  await ensureProductExists({ productId, supabase });

  const { error } = await supabase.from("product_specs").insert({
    product_id: productId,
    label,
    value,
    sort_order: sortOrder,
  });

  if (error) {
    redirectWithError(productId, "Характеристиката не можа да бъде добавена.");
  }

  redirect(`/admin/products/${productId}/specs?created=1`);
}

export async function updateProductSpec(formData: FormData) {
  const { supabase } = await requireAdmin();

  const productId = getText(formData, "product_id");
  const specId = getText(formData, "spec_id");
  const label = getText(formData, "label");
  const value = getText(formData, "value");
  const sortOrder = parseSortOrder(getText(formData, "sort_order"), 100);

  if (!productId || !specId) {
    redirect("/admin/products?error=missing-spec");
  }

  if (label.length < 1) {
    redirectWithError(productId, "Моля, въведете име на характеристиката.");
  }

  if (value.length < 1) {
    redirectWithError(productId, "Моля, въведете стойност на характеристиката.");
  }

  const { error } = await supabase
    .from("product_specs")
    .update({
      label,
      value,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", specId)
    .eq("product_id", productId);

  if (error) {
    redirectWithError(productId, "Характеристиката не можа да бъде обновена.");
  }

  redirect(`/admin/products/${productId}/specs?updated=1`);
}

export async function deleteProductSpec(formData: FormData) {
  const { supabase } = await requireAdmin();

  const productId = getText(formData, "product_id");
  const specId = getText(formData, "spec_id");

  if (!productId || !specId) {
    redirect("/admin/products?error=missing-spec");
  }

  const { error } = await supabase
    .from("product_specs")
    .delete()
    .eq("id", specId)
    .eq("product_id", productId);

  if (error) {
    redirectWithError(productId, "Характеристиката не можа да бъде изтрита.");
  }

  redirect(`/admin/products/${productId}/specs?deleted=1`);
}
