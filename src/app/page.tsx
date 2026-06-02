import ProductCatalog from "@/components/ProductCatalog";
import { products as fallbackProducts } from "@/data/products";
import { getPublishedCatalogData } from "@/lib/catalog/supabaseCatalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = fallbackProducts;

  try {
    const catalogData = await getPublishedCatalogData();
    products = catalogData.products;
  } catch {
    products = fallbackProducts;
  }

  return <ProductCatalog products={products} />;
}
