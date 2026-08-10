import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";
import { getPublishedCatalogData } from "@/lib/catalog/supabaseCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Продукти",
  description:
    "Разгледайте музикални инструменти, студио оборудване, микрофони и аксесоари от SKY MUSIC BG.",
};

export default async function ProductsPage() {
  let catalogData;

  try {
    catalogData = await getPublishedCatalogData();
  } catch (error) {
    console.error("Failed to load Supabase public products catalog.", error);
    catalogData = {
      catalogCategories: [],
      categories: ["Всички"],
      brands: [],
      products: [],
    };
  }

  return (
    <ProductsPageClient
      catalogCategories={catalogData.catalogCategories}
      categories={catalogData.categories}
      products={catalogData.products}
    />
  );
}
