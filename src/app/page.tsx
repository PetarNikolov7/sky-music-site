import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import { getPublishedCatalogData } from "@/lib/catalog/supabaseCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SKY MUSIC BG | Музикални инструменти и студио оборудване в Бургас",
  description:
    "Музикални инструменти, студио оборудване, микрофони и аксесоари от SKY MUSIC BG в Бургас. Разгледайте продуктите и изпратете поръчка през сайта.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getPublishedCatalogData>>["products"] =
    [];

  try {
    const catalogData = await getPublishedCatalogData();
    products = catalogData.products;
  } catch (error) {
    console.error("Failed to load Supabase homepage products.", error);
  }

  return <ProductCatalog products={products} />;
}
