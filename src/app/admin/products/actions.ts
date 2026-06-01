"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

function redirectWithError(message: string): never {
  redirect(`/admin/products/new?error=${encodeURIComponent(message)}`);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);

  return value.length > 0 ? value : null;
}

function slugify(input: string) {
  const basicMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sht",
    ъ: "a",
    ь: "",
    ю: "yu",
    я: "ya",
  };

  return input
    .toLowerCase()
    .split("")
    .map((character) => basicMap[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parsePrice(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const amount = Number.parseFloat(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return amount.toFixed(2);
}

function parseBadges(value: string) {
  return value
    .split(",")
    .map((badge) => badge.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function createProduct(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const name = getText(formData, "name");
  const slug = slugify(getText(formData, "slug"));
  const sku = getOptionalText(formData, "sku");
  const brandIdFromForm = getText(formData, "brand_id");
  const newBrandName = getText(formData, "new_brand_name");
  const categoryId = getText(formData, "category_id");
  const subcategoryId = getText(formData, "subcategory_id");
  const shortDescription = getText(formData, "short_description");
  const description = getText(formData, "description");
  const priceAmount = parsePrice(getText(formData, "price_amount"));
  const currency = getText(formData, "currency") || "EUR";
  const stockStatus = getText(formData, "stock_status") || "available";
  const badges = parseBadges(getText(formData, "badges"));
  const isPublished = formData.get("is_published") === "on";
  const isFeatured = formData.get("is_featured") === "on";

  if (name.length < 2) {
    redirectWithError("Моля, въведете име на продукта.");
  }

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirectWithError("Slug трябва да съдържа само малки латински букви, цифри и тирета.");
  }

  if (!categoryId || !subcategoryId) {
    redirectWithError("Моля, изберете категория и подкатегория.");
  }

  if (!priceAmount) {
    redirectWithError("Моля, въведете валидна цена.");
  }

  if (!["EUR", "BGN"].includes(currency)) {
    redirectWithError("Моля, изберете валута EUR или BGN.");
  }

  if (!["available", "on_request", "out_of_stock"].includes(stockStatus)) {
    redirectWithError("Моля, изберете валиден статус на наличност.");
  }

  const { data: existingProduct } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingProduct) {
    redirectWithError("Вече има продукт с този slug. Променете slug-а.");
  }

  if (sku) {
    const { data: existingSku } = await supabase
      .from("products")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (existingSku) {
      redirectWithError("Вече има продукт с този SKU.");
    }
  }

  const { data: selectedSubcategory, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("id, category_id")
    .eq("id", subcategoryId)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (subcategoryError || !selectedSubcategory) {
    redirectWithError("Избраната подкатегория не принадлежи към избраната категория.");
  }

  let brandId: string | null = brandIdFromForm || null;

  if (newBrandName) {
    const brandSlug = slugify(newBrandName);

    if (!brandSlug) {
      redirectWithError("Новата марка трябва да има валидно име.");
    }

    const { data: existingBrand, error: existingBrandError } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brandSlug)
      .maybeSingle();

    if (existingBrandError) {
      redirectWithError("Възникна грешка при проверка на марката.");
    }

    if (existingBrand) {
      brandId = existingBrand.id;
    } else {
      const { data: insertedBrand, error: insertBrandError } = await supabase
        .from("brands")
        .insert({
          name: newBrandName,
          slug: brandSlug,
          is_active: true,
        })
        .select("id")
        .single();

      if (insertBrandError || !insertedBrand) {
        redirectWithError("Новата марка не можа да бъде създадена.");
      }

      brandId = insertedBrand.id;
    }
  }

  if (!brandId) {
    redirectWithError("Моля, изберете марка или въведете нова марка.");
  }

  const { data: selectedBrand, error: selectedBrandError } = await supabase
    .from("brands")
    .select("id")
    .eq("id", brandId)
    .eq("is_active", true)
    .maybeSingle();

  if (selectedBrandError || !selectedBrand) {
    redirectWithError("Избраната марка не е активна.");
  }

  const { data: insertedProduct, error: insertProductError } = await supabase
    .from("products")
    .insert({
      slug,
      sku,
      name,
      brand_id: brandId,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      short_description: shortDescription,
      description,
      price_amount: priceAmount,
      currency,
      stock_status: stockStatus,
      badges,
      is_published: isPublished,
      is_featured: isFeatured,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (insertProductError || !insertedProduct) {
    redirectWithError(insertProductError?.message ?? "Продуктът не можа да бъде създаден.");
  }

  redirect(`/admin/products?created=${encodeURIComponent(name)}`);
}
