"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
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

type PublishReadinessInput = {
  name: string | null;
  slug: string | null;
  priceAmount: number | string | null;
  brandId: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  hasPrimaryImage: boolean;
  hasSpecs: boolean;
};

function getPublishReadinessMissingItems(input: PublishReadinessInput) {
  const missingItems: string[] = [];

  if (!input.name?.trim()) missingItems.push("име");
  if (!input.slug?.trim()) missingItems.push("slug");
  if (input.priceAmount === null || input.priceAmount === undefined) {
    missingItems.push("цена");
  }
  if (!input.brandId) missingItems.push("марка");
  if (!input.categoryId) missingItems.push("категория");
  if (!input.subcategoryId) missingItems.push("подкатегория");
  if (!input.hasPrimaryImage) missingItems.push("основна снимка");
  if (!input.hasSpecs) missingItems.push("характеристики");

  return missingItems;
}

function redirectPublishBlocked(path: string, missingItems: string[]): never {
  redirectWithError(
    path,
    `Публикуването е блокирано. Липсват: ${missingItems.join(", ")}.`,
  );
}

async function getProductContentReadiness({
  supabase,
  productId,
  errorPath,
}: {
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  productId: string;
  errorPath: string;
}) {
  const [{ data: primaryImage, error: imageError }, { data: spec, error: specError }] =
    await Promise.all([
      supabase
        .from("product_images")
        .select("id")
        .eq("product_id", productId)
        .eq("is_primary", true)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("product_specs")
        .select("id")
        .eq("product_id", productId)
        .limit(1)
        .maybeSingle(),
    ]);

  if (imageError || specError) {
    redirectWithError(
      errorPath,
      "Готовността за публикуване не можа да бъде проверена. Опитайте отново.",
    );
  }

  return {
    hasPrimaryImage: Boolean(primaryImage),
    hasSpecs: Boolean(spec),
  };
}

function validateSharedProductInput(formData: FormData, errorPath: string) {
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
    redirectWithError(errorPath, "Моля, въведете име на продукта.");
  }

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirectWithError(
      errorPath,
      "Slug трябва да съдържа само малки латински букви, цифри и тирета.",
    );
  }

  if (!categoryId || !subcategoryId) {
    redirectWithError(errorPath, "Моля, изберете категория и подкатегория.");
  }

  if (!priceAmount) {
    redirectWithError(errorPath, "Моля, въведете валидна цена.");
  }

  if (!currency || !["EUR", "BGN"].includes(currency)) {
    redirectWithError(errorPath, "Моля, изберете валута EUR или BGN.");
  }

  if (!["available", "on_request", "out_of_stock"].includes(stockStatus)) {
    redirectWithError(errorPath, "Моля, изберете валиден статус на наличност.");
  }

  return {
    name,
    slug,
    sku,
    brandIdFromForm,
    newBrandName,
    categoryId,
    subcategoryId,
    shortDescription,
    description,
    priceAmount,
    currency,
    stockStatus,
    badges,
    isPublished,
    isFeatured,
  };
}

async function resolveBrandId({
  supabase,
  brandIdFromForm,
  newBrandName,
  errorPath,
}: {
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  brandIdFromForm: string;
  newBrandName: string;
  errorPath: string;
}) {
  let brandId: string | null = brandIdFromForm || null;

  if (newBrandName) {
    const brandSlug = slugify(newBrandName);

    if (!brandSlug) {
      redirectWithError(errorPath, "Новата марка трябва да има валидно име.");
    }

    const { data: existingBrand, error: existingBrandError } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brandSlug)
      .maybeSingle();

    if (existingBrandError) {
      redirectWithError(errorPath, "Възникна грешка при проверка на марката.");
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
        redirectWithError(errorPath, "Новата марка не можа да бъде създадена.");
      }

      brandId = insertedBrand.id;
    }
  }

  if (!brandId) {
    redirectWithError(errorPath, "Моля, изберете марка или въведете нова марка.");
  }

  const { data: selectedBrand, error: selectedBrandError } = await supabase
    .from("brands")
    .select("id")
    .eq("id", brandId)
    .eq("is_active", true)
    .maybeSingle();

  if (selectedBrandError || !selectedBrand) {
    redirectWithError(errorPath, "Избраната марка не е активна.");
  }

  return brandId;
}

async function assertCategoryAndSubcategory({
  supabase,
  categoryId,
  subcategoryId,
  errorPath,
}: {
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  categoryId: string;
  subcategoryId: string;
  errorPath: string;
}) {
  const { data: selectedSubcategory, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("id, category_id")
    .eq("id", subcategoryId)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (subcategoryError || !selectedSubcategory) {
    redirectWithError(
      errorPath,
      "Избраната подкатегория не принадлежи към избраната категория.",
    );
  }
}

export async function createProduct(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const errorPath = "/admin/products/new";
  const input = validateSharedProductInput(formData, errorPath);

  if (input.isPublished) {
    redirectPublishBlocked(errorPath, ["основна снимка", "характеристики"]);
  }

  const { data: existingProduct } = await supabase
    .from("products")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  if (existingProduct) {
    redirectWithError(errorPath, "Вече има продукт с този slug. Променете slug-а.");
  }

  if (input.sku) {
    const { data: existingSku } = await supabase
      .from("products")
      .select("id")
      .eq("sku", input.sku)
      .maybeSingle();

    if (existingSku) {
      redirectWithError(errorPath, "Вече има продукт с този SKU.");
    }
  }

  await assertCategoryAndSubcategory({
    supabase,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    errorPath,
  });

  const brandId = await resolveBrandId({
    supabase,
    brandIdFromForm: input.brandIdFromForm,
    newBrandName: input.newBrandName,
    errorPath,
  });

  const { data: insertedProduct, error: insertProductError } = await supabase
    .from("products")
    .insert({
      slug: input.slug,
      sku: input.sku,
      name: input.name,
      brand_id: brandId,
      category_id: input.categoryId,
      subcategory_id: input.subcategoryId,
      short_description: input.shortDescription,
      description: input.description,
      price_amount: input.priceAmount,
      currency: input.currency,
      stock_status: input.stockStatus,
      badges: input.badges,
      is_published: input.isPublished,
      is_featured: input.isFeatured,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (insertProductError || !insertedProduct) {
    redirectWithError(
      errorPath,
      insertProductError?.message ?? "Продуктът не можа да бъде създаден.",
    );
  }

  redirect(`/admin/products?created=${encodeURIComponent(input.name)}`);
}

export async function updateProduct(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const productId = getText(formData, "product_id");
  const errorPath = productId
    ? `/admin/products/${productId}/edit`
    : "/admin/products";

  if (!productId) {
    redirectWithError("/admin/products", "Липсва продукт за редакция.");
  }

  const input = validateSharedProductInput(formData, errorPath);

  const { data: existingProduct, error: existingProductError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();

  if (existingProductError || !existingProduct) {
    redirectWithError("/admin/products", "Продуктът за редакция не беше намерен.");
  }

  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", input.slug)
    .neq("id", productId)
    .maybeSingle();

  if (existingSlug) {
    redirectWithError(errorPath, "Вече има друг продукт с този slug.");
  }

  if (input.sku) {
    const { data: existingSku } = await supabase
      .from("products")
      .select("id")
      .eq("sku", input.sku)
      .neq("id", productId)
      .maybeSingle();

    if (existingSku) {
      redirectWithError(errorPath, "Вече има друг продукт с този SKU.");
    }
  }

  await assertCategoryAndSubcategory({
    supabase,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    errorPath,
  });

  const brandId = await resolveBrandId({
    supabase,
    brandIdFromForm: input.brandIdFromForm,
    newBrandName: input.newBrandName,
    errorPath,
  });

  if (input.isPublished) {
    const contentReadiness = await getProductContentReadiness({
      supabase,
      productId,
      errorPath,
    });
    const missingItems = getPublishReadinessMissingItems({
      name: input.name,
      slug: input.slug,
      priceAmount: input.priceAmount,
      brandId,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      ...contentReadiness,
    });

    if (missingItems.length > 0) {
      redirectPublishBlocked(errorPath, missingItems);
    }
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      slug: input.slug,
      sku: input.sku,
      name: input.name,
      brand_id: brandId,
      category_id: input.categoryId,
      subcategory_id: input.subcategoryId,
      short_description: input.shortDescription,
      description: input.description,
      price_amount: input.priceAmount,
      currency: input.currency,
      stock_status: input.stockStatus,
      badges: input.badges,
      is_published: input.isPublished,
      is_featured: input.isFeatured,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (updateError) {
    redirectWithError(errorPath, updateError.message || "Продуктът не можа да бъде обновен.");
  }

  redirect(`/admin/products?updated=${encodeURIComponent(input.name)}`);
}

export async function toggleProductPublished(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const productId = getText(formData, "product_id");
  const nextPublished = getText(formData, "next_published") === "true";

  if (!productId) {
    redirect("/admin/products?error=missing-product");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, slug, price_amount, brand_id, category_id, subcategory_id")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    redirect("/admin/products?error=product-not-found");
  }

  if (nextPublished) {
    const contentReadiness = await getProductContentReadiness({
      supabase,
      productId,
      errorPath: "/admin/products",
    });
    const missingItems = getPublishReadinessMissingItems({
      name: product.name,
      slug: product.slug,
      priceAmount: product.price_amount,
      brandId: product.brand_id,
      categoryId: product.category_id,
      subcategoryId: product.subcategory_id,
      ...contentReadiness,
    });

    if (missingItems.length > 0) {
      redirectPublishBlocked("/admin/products", missingItems);
    }
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      is_published: nextPublished,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (updateError) {
    redirect("/admin/products?error=publish-update-failed");
  }

  const key = nextPublished ? "published" : "hidden";
  redirect(`/admin/products?${key}=${encodeURIComponent(product.name)}`);
}
