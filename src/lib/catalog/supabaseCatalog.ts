import { createClient } from "@/lib/supabase/server";

export type CatalogProductSpec = {
  label: string;
  value: string;
};

export type CatalogProductStatus = "Наличен" | "По заявка" | "Изчерпан";

export type CatalogCategory = {
  name: string;
  subcategories: string[];
};

export type CatalogProduct = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  status: CatalogProductStatus;
  description: string;
  shortDescription: string;
  imageLabel: string;
  image?: string;
  images: string[];
  badges: string[];
  specs: CatalogProductSpec[];
  featured: boolean;
};

export type PublishedCatalogData = {
  catalogCategories: CatalogCategory[];
  categories: string[];
  brands: string[];
  products: CatalogProduct[];
};

type RawCategory = {
  id: string;
  name: string;
  sort_order: number | null;
};

type RawSubcategory = {
  id: string;
  category_id: string;
  name: string;
  sort_order: number | null;
};

type RawBrand = {
  name: string;
};

type RelationName = { name: string | null } | { name: string | null }[] | null;

type RawProductImage = {
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
};

type RawProductSpec = {
  label: string | null;
  value: string | null;
  sort_order: number | null;
};

type RawProduct = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  short_description: string | null;
  description: string | null;
  price_amount: number | string | null;
  currency: string | null;
  stock_status: string | null;
  is_featured: boolean | null;
  badges: string[] | null;
  brands: RelationName;
  categories: RelationName;
  subcategories: RelationName;
  product_images: RawProductImage[] | null;
  product_specs: RawProductSpec[] | null;
};

const BGN_PER_EUR = 1.95583;

function getRelationName(value: RelationName) {
  if (Array.isArray(value)) {
    return value[0]?.name ?? "";
  }

  return value?.name ?? "";
}

function formatCurrencyValue(value: number, currency: "EUR" | "BGN") {
  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + (currency === "EUR" ? " €" : " лв.");
}

function formatProductPrice(
  amount: number | string | null,
  currency: string | null,
) {
  if (amount === null || amount === undefined) {
    return "Цена при запитване";
  }

  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : amount;

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency ?? ""}`.trim();
  }

  if ((currency ?? "EUR").toUpperCase() === "EUR") {
    const bgnValue = numericAmount * BGN_PER_EUR;

    return `${formatCurrencyValue(numericAmount, "EUR")} / ${formatCurrencyValue(
      bgnValue,
      "BGN",
    )}`;
  }

  if ((currency ?? "").toUpperCase() === "BGN") {
    return formatCurrencyValue(numericAmount, "BGN");
  }

  return `${numericAmount.toFixed(2)} ${currency ?? ""}`.trim();
}

function mapStockStatus(status: string | null): CatalogProductStatus {
  if (status === "available") {
    return "Наличен";
  }

  if (status === "on_request") {
    return "По заявка";
  }

  if (status === "out_of_stock") {
    return "Изчерпан";
  }

  return "По заявка";
}

function getPublicImageUrl(storagePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return "";
  }

  return `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}`;
}

function normalizeProductImages(images: RawProductImage[] | null) {
  return [...(images ?? [])]
    .filter((image) => Boolean(image.storage_path))
    .sort((first, second) => {
      if (first.is_primary && !second.is_primary) {
        return -1;
      }

      if (!first.is_primary && second.is_primary) {
        return 1;
      }

      return (first.sort_order ?? 0) - (second.sort_order ?? 0);
    })
    .map((image) => getPublicImageUrl(image.storage_path as string))
    .filter(Boolean);
}

function normalizeProductSpecs(specs: RawProductSpec[] | null) {
  return [...(specs ?? [])]
    .filter((spec) => Boolean(spec.label) && Boolean(spec.value))
    .sort((first, second) => (first.sort_order ?? 0) - (second.sort_order ?? 0))
    .map((spec) => ({
      label: spec.label as string,
      value: spec.value as string,
    }));
}

function normalizeBadges(product: RawProduct, status: CatalogProductStatus) {
  const fromDatabase = Array.isArray(product.badges) ? product.badges : [];
  const unique = new Set<string>();

  for (const badge of fromDatabase) {
    const clean = badge.trim();

    if (clean.length > 0) {
      unique.add(clean);
    }
  }

  if (status && !unique.has(status)) {
    unique.add(status);
  }

  return Array.from(unique);
}

function normalizeProduct(product: RawProduct): CatalogProduct {
  const brand = getRelationName(product.brands);
  const category = getRelationName(product.categories);
  const subcategory = getRelationName(product.subcategories);
  const status = mapStockStatus(product.stock_status);
  const images = normalizeProductImages(product.product_images);
  const specs = normalizeProductSpecs(product.product_specs);

  return {
    id: product.slug,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    brand,
    category,
    subcategory,
    price: formatProductPrice(product.price_amount, product.currency),
    status,
    description: product.short_description || product.description || "",
    shortDescription: product.short_description || "",
    imageLabel: subcategory || "Product",
    image: images[0],
    images,
    badges: normalizeBadges(product, status),
    specs,
    featured: Boolean(product.is_featured),
  };
}

export async function getPublishedCatalogData(): Promise<PublishedCatalogData> {
  const supabase = await createClient();

  const [
    categoriesResult,
    subcategoriesResult,
    brandsResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),

    supabase
      .from("subcategories")
      .select("id, category_id, name, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),

    supabase
      .from("brands")
      .select("name")
      .eq("is_active", true)
      .order("name", { ascending: true }),

    supabase
      .from("products")
      .select(
        `
          id,
          slug,
          sku,
          name,
          short_description,
          description,
          price_amount,
          currency,
          stock_status,
          is_featured,
          badges,
          brands(name),
          categories(name),
          subcategories(name),
          product_images(storage_path, alt_text, sort_order, is_primary),
          product_specs(label, value, sort_order)
        `,
      )
      .eq("is_published", true)
      .order("updated_at", { ascending: false }),
  ]);

  if (categoriesResult.error) {
    throw new Error(`Categories query failed: ${categoriesResult.error.message}`);
  }

  if (subcategoriesResult.error) {
    throw new Error(
      `Subcategories query failed: ${subcategoriesResult.error.message}`,
    );
  }

  if (brandsResult.error) {
    throw new Error(`Brands query failed: ${brandsResult.error.message}`);
  }

  if (productsResult.error) {
    throw new Error(`Products query failed: ${productsResult.error.message}`);
  }

  const rawCategories = (categoriesResult.data ?? []) as RawCategory[];
  const rawSubcategories = (subcategoriesResult.data ?? []) as RawSubcategory[];
  const rawBrands = (brandsResult.data ?? []) as RawBrand[];
  const rawProducts = (productsResult.data ?? []) as unknown as RawProduct[];

  const subcategoriesByCategoryId = new Map<string, string[]>();

  for (const subcategory of rawSubcategories) {
    const existing = subcategoriesByCategoryId.get(subcategory.category_id) ?? [];

    existing.push(subcategory.name);
    subcategoriesByCategoryId.set(subcategory.category_id, existing);
  }

  const catalogCategories = rawCategories.map((category) => ({
    name: category.name,
    subcategories: subcategoriesByCategoryId.get(category.id) ?? [],
  }));

  const products = rawProducts.map(normalizeProduct);

  return {
    catalogCategories,
    categories: ["Всички", ...catalogCategories.map((category) => category.name)],
    brands: rawBrands.map((brand) => brand.name),
    products,
  };
}
