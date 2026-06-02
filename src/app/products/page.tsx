import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";
import { getPublishedCatalogData } from "@/lib/catalog/supabaseCatalog";
import {
  catalogCategories as staticCatalogCategories,
  categories as staticCategories,
  products as staticProducts,
} from "@/data/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Продукти",
  description:
    "Разгледайте музикални инструменти, студио оборудване, микрофони и аксесоари от SKY MUSIC BG.",
};

function getStaticFallbackCatalogData() {
  return {
    catalogCategories: staticCatalogCategories,
    categories: staticCategories,
    products: staticProducts,
  };
}

export default async function ProductsPage() {
  try {
    const catalogData = await getPublishedCatalogData();

    return (
      <ProductsPageClient
        catalogCategories={catalogData.catalogCategories}
        categories={catalogData.categories}
        products={catalogData.products}
      />
    );
  } catch (error) {
    console.error("Failed to load Supabase public products catalog.", error);

    const fallbackData = getStaticFallbackCatalogData();

    return (
      <ProductsPageClient
        catalogCategories={fallbackData.catalogCategories}
        categories={fallbackData.categories}
        products={fallbackData.products}
      />
    );
  }
}
