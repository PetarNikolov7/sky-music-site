"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/admin/lib/requireAdmin";

const bucketName = "product-images";
const maxFileSize = 10 * 1024 * 1024;

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function redirectWithError(productId: string, message: string): never {
  redirect(
    `/admin/products/${productId}/images?error=${encodeURIComponent(message)}`,
  );
}

function redirectWithSuccess(productId: string, key: string): never {
  redirect(`/admin/products/${productId}/images?${key}=1`);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getSortOrder(formData: FormData) {
  const rawValue = getText(formData, "sort_order");

  if (!rawValue) {
    return null;
  }

  const parsed = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

async function ensureProductExists(productId: string) {
  const { supabase } = await requireAdmin();

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, is_published")
    .eq("id", productId)
    .maybeSingle();

  if (error || !product) {
    redirect("/admin/products");
  }

  return { supabase, product };
}

export async function uploadProductImage(productId: string, formData: FormData) {
  const { supabase, product } = await ensureProductExists(productId);

  const uploadedFile = formData.get("image");

  if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
    redirectWithError(productId, "Моля, изберете снимка за качване.");
  }

  if (uploadedFile.size > maxFileSize) {
    redirectWithError(productId, "Снимката трябва да бъде до 10 MB.");
  }

  const extension = allowedMimeTypes.get(uploadedFile.type);

  if (!extension) {
    redirectWithError(
      productId,
      "Позволени са само JPEG, PNG и WebP изображения.",
    );
  }

  const altText = getText(formData, "alt_text") || product.name;
  const requestedPrimary = formData.get("is_primary") === "on";
  const requestedSortOrder = getSortOrder(formData);

  const { count: existingImageCount, error: countError } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (countError) {
    redirectWithError(productId, "Не може да се провери броят на снимките.");
  }

  const imageCount = existingImageCount ?? 0;
  const isPrimary = imageCount === 0 || requestedPrimary;
  const sortOrder = requestedSortOrder ?? imageCount;

  const storagePath = `products/${productId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, uploadedFile, {
      cacheControl: "31536000",
      contentType: uploadedFile.type,
      upsert: false,
    });

  if (uploadError) {
    redirectWithError(
      productId,
      uploadError.message || "Снимката не можа да бъде качена.",
    );
  }

  if (isPrimary) {
    const { error: clearPrimaryError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    if (clearPrimaryError) {
      await supabase.storage.from(bucketName).remove([storagePath]);
      redirectWithError(productId, "Не можа да се обнови основната снимка.");
    }
  }

  const { error: insertError } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_bucket: bucketName,
    storage_path: storagePath,
    alt_text: altText,
    sort_order: sortOrder,
    is_primary: isPrimary,
  });

  if (insertError) {
    await supabase.storage.from(bucketName).remove([storagePath]);
    redirectWithError(
      productId,
      insertError.message || "Записът за снимката не можа да бъде създаден.",
    );
  }

  redirectWithSuccess(productId, "uploaded");
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
) {
  const { supabase } = await ensureProductExists(productId);

  const { data: image, error: imageError } = await supabase
    .from("product_images")
    .select("id")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (imageError || !image) {
    redirectWithError(productId, "Снимката не беше намерена.");
  }

  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (clearError) {
    redirectWithError(productId, "Не можа да се изчисти текущата основна снимка.");
  }

  const { error: updateError } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (updateError) {
    redirectWithError(productId, "Не можа да се зададе основна снимка.");
  }

  redirectWithSuccess(productId, "primaryUpdated");
}

export async function deleteProductImage(productId: string, imageId: string) {
  const { supabase, product } = await ensureProductExists(productId);

  const { data: images, error: imageError } = await supabase
    .from("product_images")
    .select("id, storage_path, is_primary, sort_order, created_at")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const image = images?.find((candidate) => candidate.id === imageId);

  if (imageError || !image) {
    redirectWithError(productId, "Снимката не беше намерена.");
  }

  const remainingImages = (images ?? []).filter(
    (candidate) => candidate.id !== imageId,
  );

  if (product.is_published && remainingImages.length === 0) {
    redirectWithError(
      productId,
      "Публикуван продукт не може да остане без основна снимка. Първо скрийте продукта или добавете снимка заместител.",
    );
  }

  if (product.is_published) {
    const remainingPrimary = remainingImages.find(
      (candidate) => candidate.is_primary,
    );
    const replacement = remainingPrimary ?? remainingImages[0];

    if (!replacement) {
      redirectWithError(
        productId,
        "Публикуван продукт не може да остане без основна снимка. Първо скрийте продукта или добавете снимка заместител.",
      );
    }

    if (!remainingPrimary) {
      const { error: replacementError } = await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", replacement.id)
        .eq("product_id", productId);

      if (replacementError) {
        redirectWithError(
          productId,
          "Снимката не беше изтрита, защото основната снимка заместител не можа да бъде зададена.",
        );
      }
    }
  }

  const { error: deleteRowError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);

  if (deleteRowError) {
    redirectWithError(productId, "Снимката не можа да бъде премахната от базата.");
  }

  if (image.storage_path) {
    await supabase.storage.from(bucketName).remove([image.storage_path]);
  }

  if (image.is_primary && !product.is_published) {
    const { data: nextImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextImage) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", nextImage.id)
        .eq("product_id", productId);
    }
  }

  redirectWithSuccess(productId, "deleted");
}
